import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mocks = vi.hoisted(() => ({
  resetStaff2fa: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/actions/twoFactorActions", () => ({ resetStaff2fa: mocks.resetStaff2fa }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: mocks.toast }));

import StaffActionMenu from "./staff-action-menu";
import Reset2faModal from "./reset-2fa-modal";
import { StaffMember } from "@/lib/types/staffTypes";

const STAFF = { id: "staff-1", first_name: "Ada", last_name: "Obi" } as StaffMember;

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  mocks.resetStaff2fa.mockReset();
  Object.values(mocks.toast).forEach((m) => m.mockReset());
});

describe("StaffActionMenu Reset 2FA", () => {
  it("is hidden unless the viewer is a Super Admin", async () => {
    const user = userEvent.setup();
    render(<StaffActionMenu />);
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("Reset 2FA")).not.toBeInTheDocument();
  });

  it("calls back when a Super Admin picks it", async () => {
    const onReset2fa = vi.fn();
    const user = userEvent.setup();
    render(<StaffActionMenu canReset2fa onReset2fa={onReset2fa} />);
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Reset 2FA"));
    expect(onReset2fa).toHaveBeenCalledTimes(1);
  });
});

describe("Reset2faModal", () => {
  it("names the staff member and resets on confirm", async () => {
    mocks.resetStaff2fa.mockResolvedValue({ data: { message: "Two-factor authentication reset." } });
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Reset2faModal isOpen onClose={onClose} staff={STAFF} />, { wrapper });

    expect(screen.getByText("Ada Obi")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset 2FA" }));

    expect(mocks.resetStaff2fa).toHaveBeenCalledWith("staff-1");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.toast.success).toHaveBeenCalledWith("Two-factor authentication reset.");
  });

  it("toasts a 403 and stays open", async () => {
    mocks.resetStaff2fa.mockRejectedValue({ status: 403, message: "Forbidden" });
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Reset2faModal isOpen onClose={onClose} staff={STAFF} />, { wrapper });

    await user.click(screen.getByRole("button", { name: "Reset 2FA" }));

    await waitFor(() => expect(mocks.toast.error).toHaveBeenCalledWith("Forbidden", expect.anything()));
    expect(onClose).not.toHaveBeenCalled();
  });
});
