import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { mutate, useProfile, uploadProofFile } = vi.hoisted(() => ({
  mutate: vi.fn(),
  useProfile: vi.fn(),
  uploadProofFile: vi.fn(),
}));
vi.mock("@/lib/services/profile.service", () => ({ useProfile }));
vi.mock("@/lib/services/funding.service", () => ({
  useCompleteFundingIntent: () => ({ mutate, isPending: false }),
  uploadProofFile,
}));

import { CompleteIntentModal } from "./complete-intent-modal";
import { pendingIntent } from "@/lib/utils/funding.fixtures";

const twoAccounts = {
  ...pendingIntent,
  registeredFundingAccounts: [
    ...pendingIntent.registeredFundingAccounts,
    { id: "acc-2", bankName: "Access Bank", accountNumber: "0000000002", accountName: "ADA TESTER" },
  ],
};

beforeEach(() => {
  mutate.mockReset();
  uploadProofFile.mockReset();
  useProfile.mockReturnValue({ data: { data: { email: "ops@xbanka.com" } } });
});

const referenceInput = () => screen.getByLabelText("Bank reference / session ID");

describe("CompleteIntentModal", () => {
  it("shows the declared amount locked by default and needs a bank reference", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    expect(screen.getByTestId("locked-amount")).toHaveTextContent("₦5,000");
    expect(screen.queryByLabelText("Amount received")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Why does it differ/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(await screen.findByText("Enter the bank reference or session ID")).toBeInTheDocument();
  });

  it("sends only bankReference, creditedBy and the single sender account when the amount is unchanged", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CompleteIntentModal intent={pendingIntent} onClose={onClose} />);

    await user.type(referenceInput(), " NIP240815123456789 ");
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(await screen.findByText("Review & Credit")).toBeInTheDocument();
    expect(screen.getByText("Guaranty Trust Bank · 0000000001")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Credit wallet" }));

    const [vars, opts] = mutate.mock.calls[0];
    expect(vars).toEqual({
      transactionId: pendingIntent.transactionId,
      payload: {
        bankReference: "NIP240815123456789",
        creditedBy: "ops@xbanka.com",
        // Only one registered account, so it is pre-selected.
        fundingAccountId: "b7d2a9e1-5c33-4f0a-8a6e-1d9f3c7e2b44",
      },
    });
    opts.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });

  it("does not pre-select when the customer has several sender accounts", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={twoAccounts} onClose={vi.fn()} />);

    await user.type(referenceInput(), "NIP1");
    await user.click(screen.getByRole("button", { name: "Review" }));
    await user.click(await screen.findByRole("button", { name: "Credit wallet" }));

    expect(mutate.mock.calls[0][0].payload).not.toHaveProperty("fundingAccountId");
  });

  it("unlocks on purpose, asks for a reason when the amount changes, then sends amount + reason", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={{ ...pendingIntent, declaredAmount: 50000 }} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Bank received a different amount?" }));
    const amountInput = screen.getByLabelText("Amount received");
    expect(amountInput).toHaveValue("50,000");
    expect(amountInput).toHaveFocus();
    // Unlocking alone changes nothing, so no reason is asked for yet.
    expect(screen.queryByLabelText(/Why does it differ/)).not.toBeInTheDocument();

    await user.clear(amountInput);
    await user.type(amountInput, "48000");
    await user.type(referenceInput(), "NIP1");
    await user.click(screen.getByRole("button", { name: "Review" }));

    expect(
      await screen.findByText("Explain why the amount differs from what the customer declared"),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Why does it differ/), "Customer sent 48k, not 50k");
    await user.click(screen.getByRole("button", { name: "Review" }));

    expect(await screen.findByText("₦2,000 less than declared")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Credit wallet" }));

    expect(mutate.mock.calls[0][0].payload).toEqual({
      bankReference: "NIP1",
      creditedBy: "ops@xbanka.com",
      amount: 48000,
      overrideReason: "Customer sent 48k, not 50k",
      fundingAccountId: "b7d2a9e1-5c33-4f0a-8a6e-1d9f3c7e2b44",
    });
  });

  it("'Use declared' re-locks the amount and drops the override from the request", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Bank received a different amount?" }));
    await user.clear(screen.getByLabelText("Amount received"));
    await user.type(screen.getByLabelText("Amount received"), "4000");
    await user.type(screen.getByLabelText(/Why does it differ/), "typo");
    await user.click(screen.getByRole("button", { name: "Use declared" }));

    expect(screen.getByTestId("locked-amount")).toHaveTextContent("₦5,000");

    await user.type(referenceInput(), "NIP1");
    await user.click(screen.getByRole("button", { name: "Review" }));
    await user.click(await screen.findByRole("button", { name: "Credit wallet" }));

    const { payload } = mutate.mock.calls[0][0];
    expect(payload).not.toHaveProperty("amount");
    expect(payload).not.toHaveProperty("overrideReason");
  });

  it("uploads proof on add, blocks Review while uploading, and sends the URL", async () => {
    const user = userEvent.setup();
    let finish: (url: string) => void = () => {};
    uploadProofFile.mockReturnValue(new Promise<string>((resolve) => (finish = resolve)));
    const { container } = render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await user.type(referenceInput(), "NIP1");
    const file = new File(["x"], "proof.pdf", { type: "application/pdf" });
    await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, file);

    expect(uploadProofFile).toHaveBeenCalledWith(file);
    expect(screen.getByRole("button", { name: "Uploading proof..." })).toBeDisabled();

    finish("https://s3/proof.pdf");
    expect(await screen.findByText("Uploaded")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Review" }));
    await user.click(await screen.findByRole("button", { name: "Credit wallet" }));
    expect(mutate.mock.calls[0][0].payload.attachmentUrls).toEqual(["https://s3/proof.pdf"]);
  });

  it("blocks Review on a failed upload until it is retried or removed", async () => {
    const user = userEvent.setup();
    uploadProofFile.mockRejectedValueOnce(new Error("413")).mockResolvedValueOnce("https://s3/ok.png");
    const { container } = render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      new File(["x"], "big.png", { type: "image/png" }),
    );
    expect(await screen.findByText("Upload failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Retry big.png" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Review" })).toBeEnabled());
  });

  it("shows the intent reference read-only and never pre-fills it as the bank reference", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    expect(screen.getByText("MANUAL-1760549712345-K3J9X2A")).toBeInTheDocument();
    expect(referenceInput()).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Copy intent reference" }));
    await expect(navigator.clipboard.readText()).resolves.toBe("MANUAL-1760549712345-K3J9X2A");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("cleans a pasted bank reference (trailing newline from a statement)", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await user.click(referenceInput());
    await user.paste("  NIP/20261015/000123\r\n");

    expect(referenceInput()).toHaveValue("NIP/20261015/000123");
  });

  it("Paste button fills the bank reference from the clipboard", async () => {
    const user = userEvent.setup();
    render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);

    await navigator.clipboard.writeText("NIP240815123456789\n");
    await user.click(screen.getByRole("button", { name: "Paste" }));

    await waitFor(() => expect(referenceInput()).toHaveValue("NIP240815123456789"));
  });

  it("will not submit before the staff email is known", () => {
    useProfile.mockReturnValue({ data: undefined });
    render(<CompleteIntentModal intent={pendingIntent} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Review" })).toBeDisabled();
  });
});
