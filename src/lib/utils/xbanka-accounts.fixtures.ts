import type { XbankaAccount } from "../types/xbanka-account-types";

// Copied from the backend's sample for GET /funding/xbanka-accounts (2026-10-19).
export const gtb: XbankaAccount = {
  id: "a164a5c5-5353-4fcf-b96b-fef0adaa6057",
  bankName: "Guaranty Trust Bank",
  bankCode: "058",
  accountNumber: "0123456789",
  accountName: "XBANKA TECHNOLOGIES LTD",
  isActive: true,
  isPrimary: true,
  createdAt: "2026-10-19T07:33:21.298Z",
  updatedAt: "2026-10-19T07:33:21.298Z",
  updatedBy: "migration",
};

export const access: XbankaAccount = {
  id: "a48c1a83-63a5-4f2a-8e01-18386ebe021f",
  bankName: "Access Bank",
  bankCode: "044",
  accountNumber: "0987654321",
  accountName: "XBANKA TECHNOLOGIES LTD",
  isActive: true,
  isPrimary: false,
  createdAt: "2026-10-19T07:33:21.325Z",
  updatedAt: "2026-10-19T07:33:21.325Z",
  updatedBy: "ops@xbanka.com",
};

export const accountsResponse = {
  message: "Request successful",
  details: "",
  errorGroup: "",
  data: { items: [gtb, access] },
};

export const banksResponse = {
  message: "Request successful",
  details: "",
  errorGroup: "",
  data: [
    { name: "Access Bank", code: "044" },
    { name: "Guaranty Trust Bank", code: "058" },
    { name: "OPay", code: "100004" },
  ],
};

export const lookupResponse = {
  message: "Request successful",
  details: "",
  errorGroup: "",
  data: [
    { account_number: "9082455489", account_name: "JOHN DOE", bank_code: "999992", bank_name: "OPay" },
  ],
};
