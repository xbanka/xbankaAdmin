import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RoleChangeConfirmProvider } from "./RoleChangeConfirmProvider";
import {
  useConfirmRoleChange,
  useGetNotifications,
} from "@/lib/services/notification.service";
import { PayoutNotification } from "@/components/notifications-panel/notifications";

vi.mock("@/lib/services/notification.service", () => ({
  useGetNotifications: vi.fn(),
  useConfirmRoleChange: vi.fn(),
}));

const mockUseGetNotifications = vi.mocked(useGetNotifications);
const mockUseConfirmRoleChange = vi.mocked(useConfirmRoleChange);

const roleChangeNotification: PayoutNotification = {
  id: "n-1",
  amount: 0,
  message: "deji williams requested to change your role to Manager.",
  type: "system",
  method: "",
  is_read: false,
  read_at: null,
  status: "ACTIVE",
  reference_id: "rc-1",
  reference_type: "STAFF_ACCOUNT",
  affiliate: null as unknown as PayoutNotification["affiliate"],
  action: { type: "CONFIRM_ROLE_CHANGE", role_change_id: "rc-1" },
};

// Password-change events share reference_type: STAFF_ACCOUNT but carry no
// confirmable action — exactly the shape that used to false-positive.
const passwordChangeNotification: PayoutNotification = {
  ...roleChangeNotification,
  id: "n-2",
  message: "Your password was changed.",
  reference_id: "pc-1",
  action: null,
};

// Matches the shape useQuery actually resolves to: { data: { data: [...] } }
function notificationsQueryResult(notifications: PayoutNotification[]) {
  return {
    data: { success: true, data: notifications, status: 200 },
  } as unknown as ReturnType<typeof useGetNotifications>;
}

describe("RoleChangeConfirmProvider", () => {
  beforeEach(() => {
    mockUseConfirmRoleChange.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useConfirmRoleChange>);
  });

  it("stays closed when there is no CONFIRM_ROLE_CHANGE action, even for a staff member with an unrelated active STAFF_ACCOUNT notification (e.g. a password change, or an admin with no role change of their own)", () => {
    mockUseGetNotifications.mockReturnValue(
      notificationsQueryResult([passwordChangeNotification]),
    );

    render(
      <RoleChangeConfirmProvider>
        <div>app</div>
      </RoleChangeConfirmProvider>,
    );

    expect(
      screen.queryByText("Role Change Requested"),
    ).not.toBeInTheDocument();
  });

  it("opens when a notification carries a CONFIRM_ROLE_CHANGE action", () => {
    mockUseGetNotifications.mockReturnValue(
      notificationsQueryResult([roleChangeNotification]),
    );

    render(
      <RoleChangeConfirmProvider>
        <div>app</div>
      </RoleChangeConfirmProvider>,
    );

    expect(screen.getByText("Role Change Requested")).toBeInTheDocument();
    expect(screen.getByText(roleChangeNotification.message)).toBeInTheDocument();
  });

  it("dismisses on Later and does not reopen for the same notification", async () => {
    mockUseGetNotifications.mockReturnValue(
      notificationsQueryResult([roleChangeNotification]),
    );

    render(
      <RoleChangeConfirmProvider>
        <div>app</div>
      </RoleChangeConfirmProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Later" }));

    // Radix's Dialog keeps its exit animation frame mounted for a tick even
    // once `open` flips to false, so the unmount isn't synchronous with the
    // click in jsdom.
    await waitFor(() =>
      expect(
        screen.queryByText("Role Change Requested"),
      ).not.toBeInTheDocument(),
    );
  });

  it("reopens for a new pending role change after a previous one was dismissed", async () => {
    mockUseGetNotifications.mockReturnValue(
      notificationsQueryResult([roleChangeNotification]),
    );

    const { rerender } = render(
      <RoleChangeConfirmProvider>
        <div>app</div>
      </RoleChangeConfirmProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Later" }));
    await waitFor(() =>
      expect(
        screen.queryByText("Role Change Requested"),
      ).not.toBeInTheDocument(),
    );

    const nextNotification: PayoutNotification = {
      ...roleChangeNotification,
      id: "n-3",
      message: "deji williams requested to change your role to Admin.",
      action: { type: "CONFIRM_ROLE_CHANGE", role_change_id: "rc-2" },
    };
    mockUseGetNotifications.mockReturnValue(
      notificationsQueryResult([nextNotification]),
    );

    rerender(
      <RoleChangeConfirmProvider>
        <div>app</div>
      </RoleChangeConfirmProvider>,
    );

    expect(screen.getByText("Role Change Requested")).toBeInTheDocument();
    expect(screen.getByText(nextNotification.message)).toBeInTheDocument();
  });

  it("confirms with the action's role_change_id and closes the popup on success", async () => {
    const mutate = vi.fn(
      (_vars: { id: string }, opts?: { onSuccess?: () => void }) => {
        opts?.onSuccess?.();
      },
    );
    mockUseConfirmRoleChange.mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useConfirmRoleChange>);
    mockUseGetNotifications.mockReturnValue(
      notificationsQueryResult([roleChangeNotification]),
    );

    render(
      <RoleChangeConfirmProvider>
        <div>app</div>
      </RoleChangeConfirmProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(mutate).toHaveBeenCalledWith(
      { id: roleChangeNotification.action?.role_change_id },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    await waitFor(() =>
      expect(
        screen.queryByText("Role Change Requested"),
      ).not.toBeInTheDocument(),
    );
  });
});
