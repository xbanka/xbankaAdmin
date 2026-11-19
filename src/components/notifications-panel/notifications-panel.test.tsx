import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsPanel } from "./notifications-panel";
import {
  useConfirmRoleChange,
  useGetNotifications,
} from "@/lib/services/notification.service";
import { markAsReadNotification } from "@/lib/actions/notificationsActions";
import { PayoutNotification } from "./notifications";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";

vi.mock("@/lib/services/notification.service", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/services/notification.service")
  >("@/lib/services/notification.service");
  return {
    ...actual,
    useGetNotifications: vi.fn(),
    useConfirmRoleChange: vi.fn(),
  };
});

vi.mock("@/lib/actions/notificationsActions", () => ({
  markAsReadNotification: vi.fn().mockResolvedValue({ success: true }),
}));

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const mockUseGetNotifications = vi.mocked(useGetNotifications);
const mockUseConfirmRoleChange = vi.mocked(useConfirmRoleChange);

const affiliate: PayoutNotification["affiliate"] = {
  id: "a1",
  email: "a@x.com",
  first_name: "A",
  last_name: "B",
  username: "ab",
  created_at: "2026-01-01T00:00:00Z",
};

const roleChangeNotification: PayoutNotification = {
  id: "n-role",
  amount: 0,
  message: "deji williams requested to change your role to Manager.",
  type: "system",
  method: "",
  is_read: false,
  read_at: null,
  status: "ACTIVE",
  reference_id: "rc-1",
  reference_type: "STAFF_ACCOUNT",
  affiliate,
  action: { type: "CONFIRM_ROLE_CHANGE", role_change_id: "rc-1" },
};

// Same reference_type, but nothing to confirm — this is the case that used
// to render a "Confirm" CTA wired to POST /audit/role-changes/{reference_id}
// even though reference_id pointed at a password-change record, not a role
// change.
const passwordChangeNotification: PayoutNotification = {
  ...roleChangeNotification,
  id: "n-password",
  message: "Your password was changed.",
  reference_id: "pc-1",
  action: null,
};

// A customer tapped "I have sent the money". reference_id is the core
// transaction id, which is not a payout id.
const fundingIntentNotification: PayoutNotification = {
  ...roleChangeNotification,
  id: "n-funding",
  message: "Ada Tester says they sent ₦5,000. Check the bank account.",
  amount: 5000,
  reference_id: "tx-1",
  reference_type: "FUNDING_INTENT",
  action: null,
};

function renderPanel(
  notifications: PayoutNotification[],
  onClose: () => void = () => {},
) {
  mockUseGetNotifications.mockReturnValue({
    data: { success: true, data: notifications, status: 200 },
    error: null,
    isPending: false,
  } as unknown as ReturnType<typeof useGetNotifications>);

  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationsPanel onClose={onClose} />
    </QueryClientProvider>,
  );
}

describe("NotificationsPanel bell dropdown", () => {
  const confirmMutate = vi.fn();

  beforeEach(() => {
    confirmMutate.mockClear();
    mockUseConfirmRoleChange.mockReturnValue({
      mutate: confirmMutate,
      isPending: false,
      variables: undefined,
    } as unknown as ReturnType<typeof useConfirmRoleChange>);
  });

  it("shows a Confirm CTA for a STAFF_ACCOUNT notification with a CONFIRM_ROLE_CHANGE action", () => {
    renderPanel([roleChangeNotification]);

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("shows no Confirm CTA for a STAFF_ACCOUNT notification with no action (e.g. a password change)", () => {
    renderPanel([passwordChangeNotification]);

    expect(
      screen.queryByRole("button", { name: "Confirm" }),
    ).not.toBeInTheDocument();
  });

  it("confirms using the action's role_change_id, not reference_id", () => {
    renderPanel([roleChangeNotification]);

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(confirmMutate).toHaveBeenCalledWith({ id: "rc-1" });
  });

  describe("FUNDING_INTENT", () => {
    beforeEach(() => {
      push.mockClear();
      vi.mocked(markAsReadNotification).mockClear();
      usePayoutSidebarStore.setState({
        isDetailsOpen: false,
        selectedPayoutId: null,
      });
    });

    it("shows the declared amount and a Review CTA, not payout affiliate/method rows", () => {
      renderPanel([fundingIntentNotification]);

      expect(screen.getByRole("button", { name: "Review" })).toBeInTheDocument();
      expect(screen.getByText("Declared:")).toBeInTheDocument();
      expect(screen.queryByText("Affiliate:")).not.toBeInTheDocument();
      expect(screen.queryByText("Method:")).not.toBeInTheDocument();
    });

    it("clicking opens the Funding Requests tab, marks it read and closes the panel", async () => {
      const onClose = vi.fn();
      renderPanel([fundingIntentNotification], onClose);

      fireEvent.click(screen.getByText(fundingIntentNotification.message));

      expect(push).toHaveBeenCalledWith("/finance?tab=funding");
      expect(onClose).toHaveBeenCalled();
      await waitFor(() =>
        expect(markAsReadNotification).toHaveBeenCalledWith({ id: "n-funding" }),
      );
    });

    it("never opens the payout sidebar with the transaction id", () => {
      renderPanel([fundingIntentNotification]);

      fireEvent.click(screen.getByRole("button", { name: "Review" }));

      const sidebar = usePayoutSidebarStore.getState();
      expect(sidebar.isDetailsOpen).toBe(false);
      expect(sidebar.selectedPayoutId).toBeNull();
    });

    it("a resolved one has no Review CTA", () => {
      renderPanel([{ ...fundingIntentNotification, status: "RESOLVED" }]);

      expect(
        screen.queryByRole("button", { name: "Review" }),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Resolved")).toBeInTheDocument();
    });

    it("has its own filter tab", () => {
      renderPanel([fundingIntentNotification]);

      expect(screen.getByRole("button", { name: "Funding" })).toBeInTheDocument();
    });
  });

  it("clicking a password-change STAFF_ACCOUNT notification just marks it read — no confirm-role-change call with the wrong id", async () => {
    renderPanel([passwordChangeNotification]);

    fireEvent.click(screen.getByText("Your password was changed."));

    expect(confirmMutate).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(markAsReadNotification).toHaveBeenCalledWith({
        id: "n-password",
      }),
    );
  });
});
