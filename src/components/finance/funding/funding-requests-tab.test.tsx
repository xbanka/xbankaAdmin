import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { useGetFundingIntents, hasPermission } = vi.hoisted(() => ({
  useGetFundingIntents: vi.fn(),
  hasPermission: vi.fn(),
}));
vi.mock("@/lib/services/funding.service", () => ({ useGetFundingIntents }));
vi.mock("@/hooks/usePermissions", () => ({
  usePermissions: () => ({ hasPermission, isLoading: false }),
}));
// Debounce is covered by its own hook; pass values straight through here.
vi.mock("@/hooks/useDebounce", () => ({ useDebounce: <T,>(v: T) => v }));
vi.mock("./complete-intent-modal", () => ({
  CompleteIntentModal: () => <div>complete-modal</div>,
}));
vi.mock("./reject-intent-modal", () => ({
  RejectIntentModal: () => <div>reject-modal</div>,
}));

import { FundingRequestsTab } from "./funding-requests-tab";
import { intentsResponse } from "@/lib/utils/funding.fixtures";

const lastQuery = () => useGetFundingIntents.mock.calls.at(-1)![0];

beforeEach(() => {
  useGetFundingIntents.mockReset();
  useGetFundingIntents.mockReturnValue({
    data: intentsResponse,
    isPending: false,
    isError: false,
    isFetching: false,
  });
  hasPermission.mockReset();
  hasPermission.mockReturnValue(true);
});

describe("FundingRequestsTab", () => {
  it("lists pending intents with the customer and sender account", () => {
    render(<FundingRequestsTab />);

    expect(lastQuery()).toMatchObject({ status: "pending", page: 1, enabled: true });
    expect(screen.getAllByText("Ada Tester").length).toBeGreaterThan(0);
    expect(screen.getAllByText("₦5,000").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0000000001").length).toBeGreaterThan(0);
  });

  it("opens the confirm and reject modals from a pending row", async () => {
    const user = userEvent.setup();
    render(<FundingRequestsTab />);

    await user.click(screen.getAllByRole("button", { name: "Confirm" })[0]);
    expect(screen.getByText("complete-modal")).toBeInTheDocument();
  });

  it("hides Confirm/Reject without finance:adjust_balance", () => {
    hasPermission.mockImplementation((p: string) => p !== "finance:adjust_balance");
    render(<FundingRequestsTab />);
    expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reject" })).not.toBeInTheDocument();
  });

  it("does not load the list without finance:view_payments", () => {
    hasPermission.mockReturnValue(false);
    render(<FundingRequestsTab />);
    expect(lastQuery().enabled).toBe(false);
    expect(screen.getByText(/permission to view funding requests/)).toBeInTheDocument();
  });

  it("switching status resets to page 1 and hides settle actions", async () => {
    const user = userEvent.setup();
    render(<FundingRequestsTab />);

    await user.click(screen.getByRole("button", { name: "Completed" }));

    expect(lastQuery()).toMatchObject({ status: "completed", page: 1 });
    expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument();
  });

  it("strips non-digits from the account search and hints until 10 digits", async () => {
    const user = userEvent.setup();
    render(<FundingRequestsTab />);
    const input = screen.getByLabelText("Sender account number");

    await user.type(input, "00a00");
    expect(input).toHaveValue("0000");
    expect(screen.getByText("Enter all 10 digits to search (4/10)")).toBeInTheDocument();

    await user.type(input, "000001");
    expect(input).toHaveValue("0000000001");
    expect(screen.queryByText(/Enter all 10 digits/)).not.toBeInTheDocument();
    expect(lastQuery()).toMatchObject({ accountNumber: "0000000001", page: 1 });
  });
});
