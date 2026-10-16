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

/** Body of POST /intents/{transactionId}/complete. Optional fields are omitted, never null. */
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
