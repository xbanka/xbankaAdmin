import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { mutate, useProfile } = vi.hoisted(() => ({ mutate: vi.fn(), useProfile: vi.fn() }));
vi.mock("@/lib/services/profile.service", () => ({ useProfile }));
vi.mock("@/lib/services/funding.service", () => ({
  useRejectFundingIntent: () => ({ mutate, isPending: false }),
}));

import { RejectIntentModal } from "./reject-intent-modal";
import { pendingIntent } from "@/lib/utils/funding.fixtures";

beforeEach(() => {
  mutate.mockReset();
  useProfile.mockReturnValue({ data: { data: { email: "ops@xbanka.com" } } });
});

describe("RejectIntentModal", () => {
  it("requires a reason", async () => {
    const user = userEvent.setup();
    render(<RejectIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Reason"), "   ");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Give a reason for rejecting")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("confirms before rejecting, then sends rejectedBy and the trimmed reason", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<RejectIntentModal intent={pendingIntent} onClose={onClose} />);

    await user.type(screen.getByLabelText("Reason"), " No matching credit on the bank statement ");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText(/This is final/)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Yes, reject" }));

    const [vars, opts] = mutate.mock.calls[0];
    expect(vars).toEqual({
      transactionId: pendingIntent.transactionId,
      payload: { rejectedBy: "ops@xbanka.com", reason: "No matching credit on the bank statement" },
    });
    opts.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });

  it("Back returns to the reason without sending", async () => {
    const user = userEvent.setup();
    render(<RejectIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Reason"), "x");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByRole("button", { name: "Back" }));

    expect(screen.getByLabelText("Reason")).toHaveValue("x");
    expect(mutate).not.toHaveBeenCalled();
  });
});
