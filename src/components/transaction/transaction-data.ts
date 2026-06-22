export interface TransactionRecord {
  id: string;

  affiliate_source: string;

  amount_in: string; // "2000.00"
  amount_out: string; // "40000.00"

  currency_in: string; // "Dollar (USD)"
  currency_out: string; // "NGN"

  attachment_url: string;

  service_type: "gift_card" | "crypto" | "bill_payments";

  status: string | "pending" | "completed" | "failed";

  vendor: string;

  created_at: string; // ISO date string

  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone_no: string;
  };

  txn_id: string;

  vendor_rate: number;
  xbanka_rate: number;
}

export type CryptoTransactionPayload = {
  service_type: "crypto";
  customer_id: string;
  amount_in: number;
  vendor?: string;
  customer_account?: string;
  xbanka_account?: string;
  crypto_pair?: string;
  vendor_rate: number;
  xbanka_rate: number;
  affiliate_source?: string;
};

export type GiftCardTransactionPayload = {
  service_type: "gift_card";
  customer_id: string;
  amount_in: number;
  vendor?: string;
  customer_account?: string;
  gift_card_type?: string;
  gift_card_code?: string;
  currency?: string;
  quantity?: string;
  vendor_rate: number;
  xbanka_rate: number;
  affiliate_source?: string;
};

export type CreateTransactionPayload =
  | CryptoTransactionPayload
  | GiftCardTransactionPayload;

export type SidebarView = "search" | "new-user";

export interface RawUserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string; // Kept as string to preserve leading '0'
}

export interface RawUserData {
  id: string;
  email: string;
  createdAt: string; // ISO 8601 Date String
  profile: RawUserProfile;
}

export interface UserSummaryItem {
  id: string;
  email: string;
  name: string;
  phone: string;
  raw: RawUserData;
}