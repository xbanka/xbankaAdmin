import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const svc = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  lookup: vi.fn(),
  banks: vi.fn(),
  profile: vi.fn(),
}));
vi.mock("@/lib/services/profile.service", () => ({ useProfile: svc.profile }));
vi.mock("@/lib/services/xbanka-accounts.service", () => ({
  useFundingBanks: svc.banks,
  useAccountLookup: svc.lookup,
  useCreateXbankaAccount: () => ({ mutate: svc.create, isPending: false }),
  useUpdateXbankaAccount: () => ({ mutate: svc.update, isPending: false }),
  useBankLogos: () => ({ data: undefined }),
}));

import { AccountFormModal } from "./account-form-modal";
import { access } from "@/lib/utils/xbanka-accounts.fixtures";

const BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Guaranty Trust Bank", code: "058" },
];
const idle = { data: undefined, isFetching: false, isError: false, error: null };

const number = () => screen.getByLabelText("Account number");
const name = () => screen.getByLabelText("Account name");

async function pickBank(user: ReturnType<typeof userEvent.setup>, bank: string) {
  await user.click(screen.getByLabelText("Bank"));
  await user.click(screen.getByRole("option", { name: bank }));
}

beforeEach(() => {
  Object.values(svc).forEach((m) => m.mockReset());
  svc.profile.mockReturnValue({ data: { data: { email: "ops@xbanka.com" } } });
  svc.banks.mockReturnValue({ data: BANKS, isPending: false, isError: false });
  svc.lookup.mockReturnValue(idle);
});

describe("AccountFormModal (add)", () => {
  it("validates bank, 10-digit number and name before sending anything", async () => {
    const user = userEvent.setup();
    render(<AccountFormModal onClose={vi.fn()} />);

    await user.type(number(), "12345");
    await user.click(screen.getByRole("button", { name: "Add account" }));

    expect(await screen.findByText("Account number must be exactly 10 digits")).toBeInTheDocument();
    expect(screen.getByText("Enter the account name")).toBeInTheDocument();
    expect(screen.getAllByText("Pick the bank").length).toBeGreaterThan(0);
    expect(svc.create).not.toHaveBeenCalled();
  });

  it("only accepts digits, capped at 10", async () => {
    const user = userEvent.setup();
    render(<AccountFormModal onClose={vi.fn()} />);
    await user.type(number(), "09a8-7654 32109999");
    expect(number()).toHaveValue("0987654321");
  });

  it("picks a bank, adds the account with the string bank code and the staff email", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AccountFormModal onClose={onClose} />);

    await pickBank(user, "Access Bank");
    await user.type(number(), "0987654321");
    await user.type(name(), "XBANKA TECHNOLOGIES LTD");
    await user.click(screen.getByLabelText("Make this the primary account"));
    await user.click(screen.getByRole("button", { name: "Add account" }));

    await waitFor(() => expect(svc.create).toHaveBeenCalledTimes(1));
    const [payload, opts] = svc.create.mock.calls[0];
    expect(payload).toEqual({
      bankName: "Access Bank",
      bankCode: "044", // string with its leading zero, never 44
      accountNumber: "0987654321",
      accountName: "XBANKA TECHNOLOGIES LTD",
      isPrimary: true,
      updatedBy: "ops@xbanka.com",
    });
    opts.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });

  it("starts the lookup only with a bank and 10 digits", async () => {
    const user = userEvent.setup();
    render(<AccountFormModal onClose={vi.fn()} />);
    expect(svc.lookup).toHaveBeenLastCalledWith("", "");

    await pickBank(user, "Guaranty Trust Bank");
    await user.type(number(), "0123456789");
    expect(svc.lookup).toHaveBeenLastCalledWith("058", "0123456789");
  });

  it("pre-fills the account name from a successful lookup and keeps it editable", async () => {
    const user = userEvent.setup();
    svc.lookup.mockReturnValue({ ...idle, data: { account_name: "JOHN DOE" } });
    render(<AccountFormModal onClose={vi.fn()} />);

    expect(await screen.findByText("Verified: JOHN DOE")).toBeInTheDocument();
    await waitFor(() => expect(name()).toHaveValue("JOHN DOE"));

    await user.clear(name());
    await user.type(name(), "XBANKA LTD");
    expect(name()).toHaveValue("XBANKA LTD");
    expect(screen.getByText(/differs from the bank's registered name \(JOHN DOE\)/)).toBeInTheDocument();
  });

  it("never overwrites a name staff already typed", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<AccountFormModal onClose={vi.fn()} />);
    await user.type(name(), "MY LABEL");

    svc.lookup.mockReturnValue({ ...idle, data: { account_name: "JOHN DOE" } });
    rerender(<AccountFormModal onClose={vi.fn()} />);

    expect(name()).toHaveValue("MY LABEL");
  });

  it("shows a failed lookup but still lets staff continue", () => {
    svc.lookup.mockReturnValue({ ...idle, isError: true, error: { message: "Could not resolve account" } });
    render(<AccountFormModal onClose={vi.fn()} />);
    expect(screen.getByText(/Could not resolve account/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add account" })).toBeEnabled();
  });

  it("blocks saving while the lookup is running", () => {
    svc.lookup.mockReturnValue({ ...idle, isFetching: true });
    render(<AccountFormModal onClose={vi.fn()} />);
    expect(screen.getByText("Verifying account...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add account" })).toBeDisabled();
  });

  it("searches the bank list by name", async () => {
    const user = userEvent.setup();
    render(<AccountFormModal onClose={vi.fn()} />);
    await user.click(screen.getByLabelText("Bank"));
    await user.type(screen.getByLabelText("Search banks"), "guar");
    expect(screen.getByRole("option", { name: "Guaranty Trust Bank" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Access Bank" })).not.toBeInTheDocument();
  });

  it("tells staff when the bank list fails to load", () => {
    svc.banks.mockReturnValue({ data: undefined, isPending: false, isError: true });
    render(<AccountFormModal onClose={vi.fn()} />);
    expect(screen.getAllByText(/load the bank list|load banks/i).length).toBeGreaterThan(0);
  });

  it("will not submit before the staff email is known", () => {
    svc.profile.mockReturnValue({ data: undefined });
    render(<AccountFormModal onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add account" })).toBeDisabled();
  });
});

describe("AccountFormModal (edit)", () => {
  it("is pre-filled, has no primary checkbox, and can't save with no changes", () => {
    render(<AccountFormModal account={access} onClose={vi.fn()} />);
    expect(number()).toHaveValue("0987654321");
    expect(name()).toHaveValue("XBANKA TECHNOLOGIES LTD");
    expect(screen.queryByLabelText("Make this the primary account")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No changes" })).toBeDisabled();
  });

  it("sends only the field that changed, plus updatedBy", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AccountFormModal account={access} onClose={onClose} />);

    await user.clear(name());
    await user.type(name(), "XBANKA NEW LTD");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(svc.update).toHaveBeenCalledTimes(1));
    const [vars, opts] = svc.update.mock.calls[0];
    expect(vars).toEqual({
      accountId: access.id,
      payload: { accountName: "XBANKA NEW LTD", updatedBy: "ops@xbanka.com" },
      successMessage: "Account updated.",
    });
    opts.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });

  it("keeps the saved name when the lookup returns a different registered name", async () => {
    svc.lookup.mockReturnValue({ ...idle, data: { account_name: "REGISTERED NAME" } });
    render(<AccountFormModal account={access} onClose={vi.fn()} />);
    // Bank and number are unchanged, so a deliberate saved label isn't overwritten.
    expect(name()).toHaveValue("XBANKA TECHNOLOGIES LTD");
  });
});
