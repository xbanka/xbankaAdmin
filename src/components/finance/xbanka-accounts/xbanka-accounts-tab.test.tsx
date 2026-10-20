import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { useXbankaAccounts, mutate, removeMutate, hasPermission, useProfile } = vi.hoisted(() => ({
  useXbankaAccounts: vi.fn(),
  mutate: vi.fn(),
  removeMutate: vi.fn(),
  hasPermission: vi.fn(),
  useProfile: vi.fn(),
}));
vi.mock("@/lib/services/xbanka-accounts.service", () => ({
  useXbankaAccounts,
  useUpdateXbankaAccount: () => ({ mutate, isPending: false, variables: undefined }),
  useDeleteXbankaAccount: () => ({ mutate: removeMutate, isPending: false, variables: undefined }),
  useBankLogos: () => ({ data: undefined }),
}));
vi.mock("@/hooks/usePermissions", () => ({ usePermissions: () => ({ hasPermission, isLoading: false }) }));
vi.mock("@/lib/services/profile.service", () => ({ useProfile }));
vi.mock("./account-form-modal", () => ({
  AccountFormModal: ({ account }: { account?: { bankName: string } }) => (
    <div>{account ? `form-edit-${account.bankName}` : "form-add"}</div>
  ),
}));

import { XbankaAccountsTab } from "./xbanka-accounts-tab";
import { access, gtb } from "@/lib/utils/xbanka-accounts.fixtures";

const hidden = { ...access, id: "hidden-1", bankName: "Zenith Bank", bankCode: "057", isActive: false };
const card = (id: string) => within(screen.getByTestId(`account-${id}`));

function withAccounts(accounts: unknown[]) {
  useXbankaAccounts.mockReturnValue({ data: accounts, isPending: false, isError: false });
}

beforeEach(() => {
  [useXbankaAccounts, mutate, removeMutate, hasPermission, useProfile].forEach((m) => m.mockReset());
  hasPermission.mockReturnValue(true);
  useProfile.mockReturnValue({ data: { data: { email: "ops@xbanka.com" } } });
  withAccounts([gtb, access, hidden]);
});

describe("XbankaAccountsTab", () => {
  it("marks the primary and hidden accounts and counts what customers see", () => {
    render(<XbankaAccountsTab />);
    expect(card(gtb.id).getByText("Primary")).toBeInTheDocument();
    expect(card(hidden.id).getByText("Hidden from customers")).toBeInTheDocument();
    expect(card(access.id).queryByText("Primary")).not.toBeInTheDocument();
    expect(screen.getByText(/2 of 3 visible to customers/)).toBeInTheDocument();
  });

  it("hides a non-primary account right away when another stays visible, sending only isActive", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(access.id).getByRole("button", { name: "Hide" }));

    expect(mutate.mock.calls[0][0]).toMatchObject({
      accountId: access.id,
      payload: { isActive: false, updatedBy: "ops@xbanka.com" },
    });
    expect(Object.keys(mutate.mock.calls[0][0].payload).sort()).toEqual(["isActive", "updatedBy"]);
  });

  it("asks before hiding the primary account and only then sends", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(gtb.id).getByRole("button", { name: "Hide" }));
    expect(screen.getByText(/primary account/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Hide anyway" }));
    expect(mutate.mock.calls[0][0].payload).toEqual({ isActive: false, updatedBy: "ops@xbanka.com" });
  });

  it("asks before hiding the last visible account", async () => {
    const user = userEvent.setup();
    withAccounts([{ ...gtb, isPrimary: false, isActive: false }, access]);
    render(<XbankaAccountsTab />);

    await user.click(card(access.id).getByRole("button", { name: "Hide" }));
    expect(screen.getByText(/nothing to pay into/)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows a hidden account again with isActive: true and no confirmation", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(hidden.id).getByRole("button", { name: "Show" }));
    expect(mutate.mock.calls[0][0].payload).toEqual({ isActive: true, updatedBy: "ops@xbanka.com" });
  });

  it("makes primary after confirmation with just isPrimary + updatedBy", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(access.id).getByRole("button", { name: "Make primary" }));
    expect(mutate).not.toHaveBeenCalled();
    // The confirm dialog renders after the cards, so its button is the last one.
    await user.click(screen.getAllByRole("button", { name: "Make primary" }).at(-1)!);

    expect(mutate.mock.calls[0][0].payload).toEqual({ isPrimary: true, updatedBy: "ops@xbanka.com" });
  });

  it("offers Make primary only on visible non-primary accounts", () => {
    render(<XbankaAccountsTab />);
    expect(card(gtb.id).queryByRole("button", { name: "Make primary" })).not.toBeInTheDocument();
    expect(card(hidden.id).queryByRole("button", { name: "Make primary" })).not.toBeInTheDocument();
    expect(card(access.id).getByRole("button", { name: "Make primary" })).toBeInTheDocument();
  });

  it("opens the add and edit forms", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(screen.getByRole("button", { name: "Add account" }));
    expect(screen.getByText("form-add")).toBeInTheDocument();
  });

  it("opens edit pre-filled for that account", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);
    await user.click(card(access.id).getByRole("button", { name: "Edit" }));
    expect(screen.getByText("form-edit-Access Bank")).toBeInTheDocument();
  });

  it("disables Delete on the primary account with a reason", () => {
    render(<XbankaAccountsTab />);
    const del = card(gtb.id).getByRole("button", { name: /Delete Guaranty Trust Bank/ });
    expect(del).toBeDisabled();
    expect(del.closest("span")).toHaveAttribute("title", "Make another account primary first");
  });

  it("confirms a delete naming the bank and full account number, then sends deletedBy", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(access.id).getByRole("button", { name: "Delete Access Bank" }));
    expect(screen.getByText(/permanently removes Access Bank \(0987654321\)/)).toBeInTheDocument();
    expect(screen.getByText(/hide it instead/)).toBeInTheDocument();
    expect(removeMutate).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(removeMutate.mock.calls[0][0]).toEqual({
      accountId: access.id,
      deletedBy: "ops@xbanka.com",
      bankName: "Access Bank",
      accountNumber: "0987654321",
    });
  });

  it("Cancel leaves the account alone", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(access.id).getByRole("button", { name: "Delete Access Bank" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(removeMutate).not.toHaveBeenCalled();
    expect(screen.queryByText(/permanently removes/)).not.toBeInTheDocument();
  });

  it("adds a warning when the account is the only one customers can see", async () => {
    const user = userEvent.setup();
    withAccounts([{ ...gtb, isActive: false, isPrimary: false }, access]);
    render(<XbankaAccountsTab />);

    await user.click(card(access.id).getByRole("button", { name: "Delete Access Bank" }));
    expect(screen.getByText(/nothing to pay into/)).toBeInTheDocument();
  });

  it("lets a hidden account be deleted without the visibility warning", async () => {
    const user = userEvent.setup();
    render(<XbankaAccountsTab />);

    await user.click(card(hidden.id).getByRole("button", { name: "Delete Zenith Bank" }));
    expect(screen.queryByText(/nothing to pay into/)).not.toBeInTheDocument();
  });

  it("shows no management controls without finance:adjust_balance", () => {
    hasPermission.mockImplementation((p: string) => p !== "finance:adjust_balance");
    render(<XbankaAccountsTab />);
    expect(screen.queryByRole("button", { name: "Add account" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hide" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Delete/ })).not.toBeInTheDocument();
    expect(screen.getByText("Guaranty Trust Bank")).toBeInTheDocument();
  });

  it("does not load without finance:view_payments", () => {
    hasPermission.mockReturnValue(false);
    render(<XbankaAccountsTab />);
    expect(useXbankaAccounts).toHaveBeenCalledWith({ enabled: false });
    expect(screen.getByText(/permission to view Xbanka accounts/)).toBeInTheDocument();
  });

  it("explains an empty list", () => {
    withAccounts([]);
    render(<XbankaAccountsTab />);
    expect(screen.getByText(/nowhere to send bank transfers/)).toBeInTheDocument();
  });
});
