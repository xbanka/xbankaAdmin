import type {
  CompleteFundingIntentPayload,
  DirectCreditPayload,
  FundingIntentStatus,
  FundingIntentsPage,
  FundingLookupMatch,
} from "../types/funding-types";

export const FUNDING_INTENT_STATUSES: FundingIntentStatus[] = ["PENDING", "COMPLETED", "FAILED"];

/** Only a full 10-digit NUBAN is sent; anything else is a 422 from the backend. */
export const isAccountNumber = (value: string) => /^\d{10}$/.test(value.trim());

export interface FundingIntentQuery {
  status?: string;
  accountNumber?: string;
  page?: number;
  limit?: number;
}

/**
 * Query params for GET /intents. A partial account number is dropped rather
 * than sent, and the status is upper-cased so the UI's "pending" tab value
 * matches the backend enum.
 */
export function buildIntentParams({ status, accountNumber, page, limit }: FundingIntentQuery) {
  const account = accountNumber?.trim() ?? "";
  return {
    status: status?.trim() ? status.trim().toUpperCase() : undefined,
    accountNumber: isAccountNumber(account) ? account : undefined,
    page,
    limit,
  };
}

/**
 * The ERP route is a pass-through to the core backend, which returns
 * `{ items, meta }`. Accept that same body wrapped in `{ data }` too, and
 * fall back to an empty page so a malformed body can't crash the table.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractIntentsPage(body: any, limit = 10): FundingIntentsPage {
  const source = Array.isArray(body?.items) ? body : body?.data;
  const items = Array.isArray(source?.items) ? source.items : [];
  const meta = source?.meta ?? {};
  return {
    items,
    meta: {
      totalItems: Number(meta.totalItems ?? items.length),
      itemCount: Number(meta.itemCount ?? items.length),
      itemsPerPage: Number(meta.itemsPerPage ?? limit),
      totalPages: Number(meta.totalPages ?? 1),
      currentPage: Number(meta.currentPage ?? 1),
    },
  };
}

/** complete/reject results, unwrapped from an optional `{ data }` envelope. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unwrapSettleResult(body: any) {
  return body && typeof body.duplicate === "boolean" ? body : body?.data ?? body;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDuplicateResult = (body: any) => unwrapSettleResult(body)?.duplicate === true;

/**
 * The attachment upload's response key isn't pinned down in the backend docs
 * ("confirm the exact key against a real response"), so check the likely
 * spots. Returns null when no URL is present, which the UI treats as failed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractAttachmentUrl(body: any): string | null {
  const candidates = [
    body?.url,
    body?.data?.url,
    body?.fileUrl,
    body?.data?.fileUrl,
    body?.attachmentUrl,
    body?.data?.attachmentUrl,
    typeof body?.data === "string" ? body.data : undefined,
  ];
  const url = candidates.find((v) => typeof v === "string" && v.length > 0);
  return url ?? null;
}

export interface CompleteIntentFormValues {
  bankReference: string;
  /** Raw numeric string from AmountField, commas already stripped. */
  amount: string;
  overrideReason: string;
  fundingAccountId: string;
}

/** True when staff entered a different figure from what the customer declared. */
export function isAmountOverridden(amount: string, declaredAmount: number) {
  const value = Number(amount);
  return amount.trim() !== "" && Number.isFinite(value) && value !== Number(declaredAmount);
}

/**
 * Form values to the complete request. Per the backend contract:
 * - `amount` + `overrideReason` only go out when the amount was changed;
 *   otherwise the backend credits the declared amount
 * - optional fields are omitted, never sent as null or ""
 * - the bank reference is trimmed, since it can only be used once
 */
export function buildCompletePayload(
  values: CompleteIntentFormValues,
  {
    declaredAmount,
    creditedBy,
    attachmentUrls = [],
  }: { declaredAmount: number; creditedBy: string; attachmentUrls?: string[] },
): CompleteFundingIntentPayload {
  const payload: CompleteFundingIntentPayload = {
    bankReference: values.bankReference.trim(),
    creditedBy,
  };

  if (isAmountOverridden(values.amount, declaredAmount)) {
    payload.amount = Number(values.amount);
    payload.overrideReason = values.overrideReason.trim();
  }
  if (values.fundingAccountId) payload.fundingAccountId = values.fundingAccountId;
  if (attachmentUrls.length > 0) payload.attachmentUrls = attachmentUrls;

  return payload;
}

/**
 * Text copied from a bank statement or portal often carries a trailing
 * newline or tab. Collapse those and trim the ends; the reference itself is
 * left as-is (no case or punctuation changes), since it must match the bank.
 */
export function cleanBankReference(raw: string) {
  return raw.replace(/[\r\n\t]+/g, " ").trim();
}

/** Most proof files a credit request accepts. */
export const MAX_PROOF_FILES = 5;

/**
 * GET /funding/lookup answers with an array. Accept it bare or wrapped in
 * `{ data }` like the other routes, and fall back to no matches so a
 * malformed body can't crash the step.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractLookupMatches(body: any): FundingLookupMatch[] {
  const list = Array.isArray(body) ? body : body?.data;
  return Array.isArray(list) ? list : [];
}

export type MatchBlocker = "suspended" | "no-wallet";

/**
 * Why a matched customer can't be credited, or null when they can. A
 * suspended account is refused by the backend (403); no NGN wallet means
 * there is nothing to credit, so both are blocked up front.
 */
export function getMatchBlocker(match: FundingLookupMatch): MatchBlocker | null {
  if (!match.customer?.isActive) return "suspended";
  if (!match.wallet) return "no-wallet";
  return null;
}

export const MATCH_BLOCKER_MESSAGE: Record<MatchBlocker, string> = {
  suspended: "Account suspended. It cannot be credited.",
  "no-wallet": "No NGN wallet yet. It cannot be credited.",
};

/** The reference the core backend stores: it trims and uppercases, then prefixes. */
export const storedReference = (reference: string) =>
  `BANKFUND-${reference.trim().toUpperCase()}`;

/** At most two decimal places, as the credit endpoint requires. */
export const hasAtMostTwoDecimals = (value: string) => /^\d*(\.\d{0,2})?$/.test(value.trim());

export interface DirectCreditFormValues {
  bankReference: string;
  /** Raw numeric string from AmountField, commas already stripped. */
  amount: string;
}

/**
 * Form values to the credit request. The reference is trimmed (it can only
 * be used once, so stray whitespace must not make a different one), and
 * `attachmentUrls` is omitted when empty rather than sent as [].
 */
export function buildDirectCreditPayload(
  values: DirectCreditFormValues,
  {
    fundingAccountId,
    creditedBy,
    attachmentUrls = [],
  }: { fundingAccountId: string; creditedBy: string; attachmentUrls?: string[] },
): DirectCreditPayload {
  const payload: DirectCreditPayload = {
    fundingAccountId,
    amount: Number(values.amount),
    reference: values.bankReference.trim(),
    creditedBy,
  };
  if (attachmentUrls.length > 0) payload.attachmentUrls = attachmentUrls;
  return payload;
}

export type CreditFailure = "retry" | "reference-conflict" | "not-found" | "rejected";

/**
 * How the credit modal reacts to a failed request. Network trouble and 502
 * are safe to retry (the bank reference prevents a double credit); a 409
 * must not be retried; a 404 means the lookup is stale.
 */
export function classifyCreditError(error: unknown): CreditFailure {
  const status = (error as { status?: number })?.status;
  if (status === 409) return "reference-conflict";
  if (status === 404) return "not-found";
  // Timeouts, dropped connections and 5xx all leave it unknown whether the
  // credit landed; resending the same reference is safe either way.
  if (status === undefined || status === 408 || status >= 500) return "retry";
  return "rejected";
}

export function formatNaira(amount: number, currency = "NGN") {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${Number(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export function statusLabel(status: string) {
  if (!status) return "-";
  return status.charAt(0) + status.slice(1).toLowerCase();
}
