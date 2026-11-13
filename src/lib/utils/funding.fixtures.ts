import type { DirectCreditResult, FundingIntent, FundingLookupMatch } from "../types/funding-types";

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

// Shaped like a real GET /funding/lookup item (checked against staging), which
// differs from the API doc's sample: `bankName`, not `bank`, and the wallet
// carries its id and balance.
export const lookupMatch: FundingLookupMatch = {
  fundingAccountId: "7c0c1d2e-5b4a-4c53-9d57-0f3f0f4a1b11",
  bankName: "Paycom (Opay)",
  bankCode: "305",
  accountNumber: "7054178290",
  accountName: "OMOLADE OLUWASEGUN AKANBI",
  customer: {
    userId: "991fbf45-8c5a-4840-9f4f-8af81c586922",
    xbId: "XB123",
    email: "customer@example.com",
    isActive: true,
    name: "Omolade Akanbi",
  },
  wallet: { id: "4147cfeb-a6a5-4fc5-a647-79e8744090ca", balance: 1200, currency: "NGN" },
};

export const secondLookupMatch: FundingLookupMatch = {
  ...lookupMatch,
  fundingAccountId: "2a9f4c6e-7d10-4b7a-8c11-5e3d9a0b6f22",
  bankName: "Access Bank",
  bankCode: "044",
  accountName: "OMOLADE O AKANBI",
  customer: { ...lookupMatch.customer, userId: "u-2", xbId: "XB456", email: "other@example.com", name: "Omolade Akinbi" },
};

export const creditResult: DirectCreditResult = {
  duplicate: false,
  transactionId: "0d9a1b5e-3c42-4e8f-9a17-6b2f8c4d1e55",
  reference: "BANKFUND-100004261006204500123456",
  amount: 2000,
  balance: 12000,
  creditedAt: "2026-11-12T10:15:30.000Z",
};

export const intentsResponse = {
  items: [pendingIntent],
  meta: { totalItems: 1, itemCount: 1, itemsPerPage: 20, totalPages: 1, currentPage: 1 },
};
