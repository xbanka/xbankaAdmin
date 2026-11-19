import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FinancePage from "./page";

let tabParam: string | null = null;
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(tabParam ? { tab: tabParam } : {}),
}));

vi.mock("@/hooks/usePermissions", () => ({
  usePermissions: () => ({ hasPermission: () => false }),
}));
vi.mock("@/components/finance/payouts-tab", () => ({
  PayoutsTab: () => <div>payouts tab</div>,
}));
vi.mock("@/components/finance/funding/funding-requests-tab", () => ({
  FundingRequestsTab: () => <div>funding tab</div>,
}));
vi.mock("@/components/finance/xbanka-accounts/xbanka-accounts-tab", () => ({
  XbankaAccountsTab: () => <div>accounts tab</div>,
}));

describe("Finance page ?tab=", () => {
  beforeEach(() => {
    tabParam = null;
  });

  it("opens Payout Requests by default", () => {
    render(<FinancePage />);

    expect(screen.getByText("payouts tab")).toBeInTheDocument();
  });

  it("opens Funding Requests for ?tab=funding (where funding notifications link)", () => {
    tabParam = "funding";

    render(<FinancePage />);

    expect(screen.getByText("funding tab")).toBeInTheDocument();
    expect(screen.queryByText("payouts tab")).not.toBeInTheDocument();
  });

  it("follows the query string when already on the page", () => {
    const { rerender } = render(<FinancePage />);
    expect(screen.getByText("payouts tab")).toBeInTheDocument();

    tabParam = "funding";
    rerender(<FinancePage />);

    expect(screen.getByText("funding tab")).toBeInTheDocument();
  });

  it("ignores an unknown tab value", () => {
    tabParam = "nonsense";

    render(<FinancePage />);

    expect(screen.getByText("payouts tab")).toBeInTheDocument();
  });
});
