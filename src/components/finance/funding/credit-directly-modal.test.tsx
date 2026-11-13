import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { useFundingLookup, useGetFundingIntents, mutate, creditState, useProfile, uploadProofFile } =
  vi.hoisted(() => ({
    useFundingLookup: vi.fn(),
    useGetFundingIntents: vi.fn(),
    mutate: vi.fn(),
    creditState: { isPending: false },
    useProfile: vi.fn(),
    uploadProofFile: vi.fn(),
  }));
vi.mock("@/lib/services/profile.service", () => ({ useProfile }));
vi.mock("@/lib/services/funding.service", () => ({
  useFundingLookup,
  useGetFundingIntents,
  useCreditFundingDirectly: () => ({ mutate, isPending: creditState.isPending }),
  uploadProofFile,
}));

import { CreditDirectlyModal } from "./credit-directly-modal";
import {
  creditResult,
  lookupMatch,
  pendingIntent,
  secondLookupMatch,
} from "@/lib/utils/funding.fixtures";

const ACCOUNT = "7054178290";
const REFERENCE = "100004261006204500123456";

const emptyIntents = {
  data: { items: [], meta: {} },
  isPending: false,
  isFetching: false,
  isPlaceholderData: false,
  isError: false,
  refetch: vi.fn(),
};

const lookupResult = (data: unknown) => ({
  data,
  isPending: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
});

const suspended = { ...lookupMatch, customer: { ...lookupMatch.customer, isActive: false } };

// pendingIntent belongs to another customer; this one belongs to lookupMatch's.
const theirPendingIntent = {
  ...pendingIntent,
  customer: { ...pendingIntent.customer, userId: lookupMatch.customer.userId },
};

function renderModal(props: Partial<React.ComponentProps<typeof CreditDirectlyModal>> = {}) {
  const onClose = vi.fn();
  const onOpenIntent = vi.fn();
  render(
    <CreditDirectlyModal initialAccount={ACCOUNT} onClose={onClose} onOpenIntent={onOpenIntent} {...props} />,
  );
  return { onClose, onOpenIntent };
}

const continueButton = () => screen.getByRole("button", { name: "Continue" });

async function toDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.click(continueButton());
  expect(await screen.findByLabelText("Amount received")).toBeInTheDocument();
}

async function toReview(user: ReturnType<typeof userEvent.setup>, amount = "2000") {
  await toDetails(user);
  await user.type(screen.getByLabelText("Amount received"), amount);
  await user.type(screen.getByLabelText("Bank reference / session ID"), REFERENCE);
  await user.click(screen.getByRole("button", { name: "Review" }));
  expect(await screen.findByText("Review & Credit")).toBeInTheDocument();
}

beforeEach(() => {
  mutate.mockReset();
  uploadProofFile.mockReset();
  creditState.isPending = false;
  useProfile.mockReturnValue({ data: { data: { email: "ops@xbanka.com" } } });
  useFundingLookup.mockReturnValue(lookupResult([lookupMatch]));
  useGetFundingIntents.mockReturnValue(emptyIntents);
});

describe("CreditDirectlyModal: finding the customer", () => {
  it("pre-fills the sender account and selects the only match", () => {
    renderModal();

    expect(screen.getByLabelText("Sender account number")).toHaveValue(ACCOUNT);
    expect(screen.getByRole("radio", { name: /OMOLADE OLUWASEGUN AKANBI/ })).toBeChecked();
    expect(screen.getByText("Omolade Akanbi")).toBeInTheDocument();
    expect(screen.getByText("Paycom (Opay)")).toBeInTheDocument();
    expect(continueButton()).toBeEnabled();
  });

  it("only checks for pending requests once there is a full account number", () => {
    renderModal({ initialAccount: "70541" });

    expect(useGetFundingIntents.mock.calls.at(-1)![0]).toMatchObject({
      status: "pending",
      accountNumber: "70541",
      enabled: false,
    });
    expect(continueButton()).toBeDisabled();
  });

  it("says so when nobody registered the account, and cannot continue", () => {
    useFundingLookup.mockReturnValue(lookupResult([]));
    renderModal();

    expect(screen.getByText("No customer has registered this account.")).toBeInTheDocument();
    expect(continueButton()).toBeDisabled();
  });

  it("blocks a suspended customer", () => {
    useFundingLookup.mockReturnValue(lookupResult([suspended]));
    renderModal();

    expect(screen.getByText(/Account suspended/)).toBeInTheDocument();
    const card = screen.getByRole("radio", { name: /OMOLADE OLUWASEGUN AKANBI/ });
    expect(card).toBeDisabled();
    // A lone match is auto-selected, but one that can't be credited must not look chosen.
    expect(card).not.toBeChecked();
    expect(continueButton()).toBeDisabled();
  });

  it("lets a customer with no NGN wallet through, with a note: the credit creates the wallet", async () => {
    const user = userEvent.setup();
    useFundingLookup.mockReturnValue(lookupResult([{ ...lookupMatch, wallet: null }]));
    renderModal();

    expect(screen.getByText(/No NGN wallet yet\. One will be created when you credit/)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /OMOLADE OLUWASEGUN AKANBI/ })).toBeChecked();
    expect(continueButton()).toBeEnabled();

    // The note is repeated where the money is confirmed.
    await toReview(user);
    expect(screen.getByText(/No NGN wallet yet\. One will be created when you credit/)).toBeInTheDocument();
  });

  it("does not show the no-wallet note for a customer who has one", () => {
    renderModal();
    expect(screen.queryByText(/No NGN wallet yet/)).not.toBeInTheDocument();
  });

  it("falls back to the email when the backend sends no customer name", async () => {
    const user = userEvent.setup();
    useFundingLookup.mockReturnValue(
      lookupResult([{ ...lookupMatch, customer: { ...lookupMatch.customer, name: null } }]),
    );
    renderModal();

    expect(screen.getByText("customer@example.com", { selector: "p.text-sm" })).toBeInTheDocument();
    await toReview(user);
    expect(screen.getAllByText(/customer@example\.com/).length).toBeGreaterThan(0);
  });

  it("makes staff pick when several customers registered the number", async () => {
    const user = userEvent.setup();
    useFundingLookup.mockReturnValue(lookupResult([lookupMatch, secondLookupMatch]));
    renderModal();

    expect(screen.getByText(/Several customers registered this number/)).toBeInTheDocument();
    expect(continueButton()).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: /OMOLADE O AKANBI/ }));
    expect(continueButton()).toBeEnabled();

    await toDetails(user);
    expect(screen.getByText("Omolade Akinbi")).toBeInTheDocument();
  });

  it("will not continue past the customer's pending request, and hands it to the Confirm flow", async () => {
    const user = userEvent.setup();
    useGetFundingIntents.mockReturnValue({
      ...emptyIntents,
      data: { items: [theirPendingIntent], meta: {} },
    });
    const { onOpenIntent } = renderModal();

    expect(screen.getByText(/already has a pending funding request/)).toBeInTheDocument();
    expect(continueButton()).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Review request" }));
    expect(onOpenIntent).toHaveBeenCalledWith(theirPendingIntent);
  });

  it("is not blocked by a pending request that belongs to a different customer", () => {
    // Two customers can register the same number at different banks; the
    // account-number check returns both customers' requests.
    useGetFundingIntents.mockReturnValue({
      ...emptyIntents,
      data: { items: [pendingIntent], meta: {} },
    });
    renderModal();

    expect(screen.queryByText(/already has a pending funding request/)).not.toBeInTheDocument();
    expect(continueButton()).toBeEnabled();
  });

  it("only blocks the customer whose request it is when several share the number", async () => {
    const user = userEvent.setup();
    useFundingLookup.mockReturnValue(lookupResult([lookupMatch, secondLookupMatch]));
    // Pending request belongs to the SECOND customer.
    useGetFundingIntents.mockReturnValue({
      ...emptyIntents,
      data: {
        items: [
          { ...pendingIntent, customer: { ...pendingIntent.customer, userId: secondLookupMatch.customer.userId } },
        ],
        meta: {},
      },
    });
    renderModal();

    // Nothing chosen yet: a candidate has a pending request, so it is shown and blocks.
    expect(screen.getByText(/already has a pending funding request/)).toBeInTheDocument();

    // Choosing the customer with no pending request clears it.
    await user.click(screen.getByRole("radio", { name: /OMOLADE OLUWASEGUN AKANBI/ }));
    expect(screen.queryByText(/already has a pending funding request/)).not.toBeInTheDocument();
    expect(continueButton()).toBeEnabled();

    // Choosing the customer who has one blocks again.
    await user.click(screen.getByRole("radio", { name: /OMOLADE O AKANBI/ }));
    expect(screen.getByText(/already has a pending funding request/)).toBeInTheDocument();
    expect(continueButton()).toBeDisabled();
  });

  it("does not refetch on window focus, which would blank the customer card mid-decision", () => {
    renderModal();
    expect(useGetFundingIntents.mock.calls.at(-1)![0]).toMatchObject({ refetchOnWindowFocus: false });
  });

  it("does not trust the previous account's pending-request page while a new one loads", () => {
    // keepPreviousData: the old page stays in `data` with isPlaceholderData set.
    useGetFundingIntents.mockReturnValue({
      ...emptyIntents,
      data: { items: [pendingIntent], meta: {} },
      isFetching: true,
      isPlaceholderData: true,
    });
    renderModal();

    expect(screen.queryByText(/already has a pending funding request/)).not.toBeInTheDocument();
    expect(continueButton()).toBeDisabled();
  });

  it("cannot continue when the pending-request check failed", () => {
    useGetFundingIntents.mockReturnValue({ ...emptyIntents, data: undefined, isError: true });
    renderModal();

    expect(screen.getByText(/Couldn.t check for a pending funding request/)).toBeInTheDocument();
    expect(continueButton()).toBeDisabled();
  });

  it("shows the core's sentence, not its raw JSON, for a lookup failure", () => {
    useFundingLookup.mockReturnValue({
      ...lookupResult(undefined),
      isError: true,
      error: { message: JSON.stringify({ message: "accountNumber must be exactly 10 digits", errorGroup: "HTTP_ERROR" }) },
    });
    renderModal();

    expect(screen.getByText("accountNumber must be exactly 10 digits")).toBeInTheDocument();
    expect(screen.queryByText(/errorGroup/)).not.toBeInTheDocument();
  });

  it("shows a lookup failure with a way to retry", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    useFundingLookup.mockReturnValue({
      ...lookupResult(undefined),
      isError: true,
      error: { message: "The core backend could not be reached" },
      refetch,
    });
    renderModal();

    expect(screen.getByText("The core backend could not be reached")).toBeInTheDocument();
    expect(continueButton()).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalled();
  });
});

describe("CreditDirectlyModal: details", () => {
  it("asks for an amount and a reference of at least 4 characters", async () => {
    const user = userEvent.setup();
    renderModal();
    await toDetails(user);

    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(await screen.findByText("Enter the amount received")).toBeInTheDocument();
    expect(screen.getByText("The bank reference must be at least 4 characters")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Amount received"), "10.555");
    await user.type(screen.getByLabelText("Bank reference / session ID"), "abc");
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(await screen.findByText("Amount can have at most 2 decimal places")).toBeInTheDocument();
  });

  it("shows the reference as it will be stored", async () => {
    const user = userEvent.setup();
    renderModal();
    await toDetails(user);

    await user.type(screen.getByLabelText("Bank reference / session ID"), "nip123abc");
    expect(screen.getByText("BANKFUND-NIP123ABC")).toBeInTheDocument();
  });

  it("goes back to the lookup with Change", async () => {
    const user = userEvent.setup();
    renderModal();
    await toDetails(user);

    await user.click(screen.getByRole("button", { name: "Change" }));
    expect(await screen.findByLabelText("Sender account number")).toHaveValue(ACCOUNT);
  });
});

describe("CreditDirectlyModal: review and credit", () => {
  it("summarises the credit and sends the payload with the signed-in admin as creditedBy", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);

    expect(screen.getByText("Omolade Akanbi")).toBeInTheDocument();
    expect(screen.getByText(/Paycom \(Opay\) · 7054178290/)).toBeInTheDocument();
    expect(screen.getByText(/Stored as BANKFUND-100004261006204500123456/)).toBeInTheDocument();
    expect(screen.getByText("ops@xbanka.com")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toEqual({
      fundingAccountId: lookupMatch.fundingAccountId,
      amount: 2000,
      reference: REFERENCE,
      creditedBy: "ops@xbanka.com",
    });
  });

  it("locks the review step while the request runs, so it can't be sent twice", async () => {
    const user = userEvent.setup();
    creditState.isPending = true;
    renderModal();
    await toReview(user);

    expect(screen.getByRole("button", { name: "Crediting..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled();
  });

  it("shows the receipt: new balance, transaction ID and reference", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onSuccess(creditResult);

    expect(await screen.findByText("Wallet credited")).toBeInTheDocument();
    expect(screen.getByText("₦12,000")).toBeInTheDocument();
    expect(screen.getByText(creditResult.transactionId)).toBeInTheDocument();
    expect(screen.getByText(creditResult.reference)).toBeInTheDocument();
  });

  it("treats duplicate: true as 'Already credited', not an error", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onSuccess({ ...creditResult, duplicate: true });

    expect(await screen.findByText("Already credited")).toBeInTheDocument();
    expect(screen.getByText(/No second credit was made/)).toBeInTheDocument();
    expect(screen.queryByText("Wallet credited")).not.toBeInTheDocument();
  });

  it("shows no balance row, and never NaN, when a duplicate result has no balance", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    // The backend's duplicate response omits `balance`.
    const { balance, ...withoutBalance } = creditResult;
    void balance;
    mutate.mock.calls[0][1].onSuccess({ ...withoutBalance, duplicate: true });

    expect(await screen.findByText("Already credited")).toBeInTheDocument();
    expect(screen.queryByText("New balance")).not.toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(screen.getByText(creditResult.transactionId)).toBeInTheDocument();
  });

  it("offers a safe retry with the same payload after a network error", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onError({ status: 503, message: "Network error" });

    expect(await screen.findByText(/may already have gone through/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry credit" }));

    expect(mutate).toHaveBeenCalledTimes(2);
    expect(mutate.mock.calls[1][0]).toEqual(mutate.mock.calls[0][0]);
  });

  it("after an uncertain failure, withholds Edit and Back so the reference can't be changed", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));
    mutate.mock.calls[0][1].onError({ status: 408, message: "Network timeout" });

    await screen.findByText(/may already have gone through/);
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    // The header's back arrow is the only button rendered before the close X.
    expect(document.querySelector("button svg.lucide-chevron-left")).toBeNull();
    // And staff are told how to check before crediting again.
    expect(screen.getByText(/check the customer's transactions for BANKFUND-100004261006204500123456/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry credit" })).toBeEnabled();
  });

  it("still lets staff edit after a failure that is definitely not a credit", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onError({ status: 403, message: "Customer account is suspended" });

    await screen.findByText("Customer account is suspended");
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("shows the core's sentence, not its raw JSON, for a refused credit", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onError({
      status: 409,
      message: JSON.stringify({
        message: "Reference 100004 was already used for a different credit (500 NGN)",
        details: "",
        errorGroup: "MICROSERVICE_ERROR",
      }),
    });

    expect(
      await screen.findByText("Reference 100004 was already used for a different credit (500 NGN)"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/errorGroup/)).not.toBeInTheDocument();
  });

  it("on a 409, explains and sends staff back to fix the reference instead of retrying", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onError({ status: 409, message: "Reference already used" });

    expect(await screen.findByText(/already used with a different amount or account/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Credit ₦|Retry credit/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit reference" }));
    expect(await screen.findByLabelText("Bank reference / session ID")).toHaveValue(REFERENCE);
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it("on a 404, sends staff back to redo the lookup", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onError({ status: 404, message: "Funding account not found" });

    await user.click(await screen.findByRole("button", { name: "Start over" }));
    expect(await screen.findByLabelText("Sender account number")).toBeInTheDocument();
  });

  it("shows the backend's message when the credit is refused", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));

    mutate.mock.calls[0][1].onError({ status: 403, message: "Customer account is suspended" });

    expect(await screen.findByText("Customer account is suspended")).toBeInTheDocument();
  });

  it("starts clean for 'Credit another'", async () => {
    const user = userEvent.setup();
    renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));
    mutate.mock.calls[0][1].onSuccess(creditResult);

    await user.click(await screen.findByRole("button", { name: "Credit another" }));

    expect(await screen.findByLabelText("Sender account number")).toHaveValue("");
  });

  it("closes from the receipt with Done", async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();
    await toReview(user);
    await user.click(screen.getByRole("button", { name: "Credit ₦2,000" }));
    mutate.mock.calls[0][1].onSuccess(creditResult);

    await user.click(await screen.findByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalled();
  });
});
