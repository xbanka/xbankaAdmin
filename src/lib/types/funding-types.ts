/**
 * Funding intents: a customer taps "I have sent the money" in the web app
 * (POST /wallet/funding-accounts/declare-intent), which records a PENDING
 * intent. Staff match it to the bank statement and complete or reject it.
 */

export type FundingIntentStatus = "PENDING" | "COMPLETED" | "FAILED";

/** A sender account the customer registered in the web app. */
export interface RegisteredFundingAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

/** One item from GET /api/transactions/funding/intents. */
export interface FundingIntent {
  transactionId: string;
  reference: string;
  intentReference: string;
  status: FundingIntentStatus | string;
  /** What the customer says they sent. */
  declaredAmount: number;
  /** What was actually credited; equals declaredAmount unless overridden. */
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    userId: string;
    xbId: string;
    email: string;
    isActive: boolean;
    name: string;
  };
  registeredFundingAccounts: RegisteredFundingAccount[];
  bankReference: string | null;
  creditedBy: string | null;
  fundingAccountId: string | null;
  attachmentUrls: string[];
  overrideReason: string | null;
  rejectedBy: string | null;
  rejectReason: string | null;
}

export interface FundingIntentsMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface FundingIntentsPage {
  items: FundingIntent[];
  meta: FundingIntentsMeta;
}

/**
 * Body of POST /intents/{transactionId}/complete. Optional fields are
 * omitted, never null. `amount` is only sent when the bank received a
 * different figure from the declaration, and then `overrideReason` is
 * required (the backend 422s on one without the other).
 */
export interface CompleteFundingIntentPayload {
  bankReference: string;
  creditedBy: string;
  amount?: number;
  overrideReason?: string;
  fundingAccountId?: string;
  attachmentUrls?: string[];
}

/** Body of POST /intents/{transactionId}/reject. */
export interface RejectFundingIntentPayload {
  rejectedBy: string;
  reason: string;
}

/** complete/reject both report `duplicate: true` on a safe retry. */
export interface SettleFundingIntentResult {
  duplicate: boolean;
  transactionId: string;
  [key: string]: unknown;
}

/**
 * "Credit directly": money arrived but the customer never declared it, so
 * there is no intent. Staff find the customer by the sending account
 * (GET /funding/lookup), then credit their NGN wallet (POST /funding/credit).
 */

/** One item of GET /funding/lookup (an array: one number can exist at several banks). */
export interface FundingLookupMatch {
  /** Goes into the credit request. */
  fundingAccountId: string;
  bank: string;
  accountName: string;
  customer: {
    userId: string;
    xbId: string;
    email: string;
    isActive: boolean;
    name: string;
  };
  /** null when the customer has no NGN wallet yet. */
  wallet: { currency: string } | null;
}

/** Body of POST /funding/credit. Optional fields are omitted, never null. */
export interface DirectCreditPayload {
  fundingAccountId: string;
  amount: number;
  /** The bank's reference. The core backend trims it and stores BANKFUND-<REF>. */
  reference: string;
  /** The signed-in admin's email; the server does not verify it. */
  creditedBy: string;
  attachmentUrls?: string[];
}

export interface DirectCreditResult {
  /** true when this reference was already credited with the same details. */
  duplicate: boolean;
  transactionId: string;
  reference: string;
  amount: number;
  balance: number;
  creditedAt: string;
}
