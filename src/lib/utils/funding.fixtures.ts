import type { FundingIntent } from "../types/funding-types";

// Copied from the backend's sample for GET /funding/intents (2026-10-16).
export const pendingIntent: FundingIntent = {
  transactionId: "3f6c1d52-8a41-4b7e-9c0d-2e5a7b1f4c90",
  reference: "MANUAL-1760549712345-K3J9X2A",
  intentReference: "MANUAL-1760549712345-K3J9X2A",
  status: "PENDING",
  declaredAmount: 5000,
  amount: 5000,
  currency: "NGN",
  createdAt: "2026-10-15T17:35:12.345Z",
  updatedAt: "2026-10-15T17:35:12.345Z",
  customer: {
    userId: "944f0150-9c71-42ab-ac45-109c95f5dff2",
    xbId: "944f0150",
    email: "e2e-funding@example.com",
    isActive: true,
    name: "Ada Tester",
  },
  registeredFundingAccounts: [
    {
      id: "b7d2a9e1-5c33-4f0a-8a6e-1d9f3c7e2b44",
      bankName: "Guaranty Trust Bank",
      accountNumber: "0000000001",
      accountName: "ADA TESTER",
    },
  ],
  bankReference: null,
  creditedBy: null,
  fundingAccountId: null,
  attachmentUrls: [],
  overrideReason: null,
  rejectedBy: null,
  rejectReason: null,
};

export const intentsResponse = {
  items: [pendingIntent],
  meta: { totalItems: 1, itemCount: 1, itemsPerPage: 20, totalPages: 1, currentPage: 1 },
};
