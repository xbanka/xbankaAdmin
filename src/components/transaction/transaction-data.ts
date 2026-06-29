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

export interface TradeMetadata {
  isManual: boolean;
  tradeDirection: string; // e.g., "Buy Crypto"
  sourceCurrency: string; // e.g., "NGN"
  targetCurrency: string; // e.g., "USDT"
  sourceAmount: number;
  grossPayout: number;
  partner: string;
  partnerRate: number;
  xbankaRate: number;
  marginPerUsdt: number;
  totalMargin: number;
  marginPercentage: string; // e.g., "-6.67%"
  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string;
  receivedInto: string;
  deliveryMethod: string;
  deliveryAsset: string;
  deliverySource: string;
  deliveryStatus: string;
  deliveryReference: string;
  attachmentUrl: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string; // From parent context, nested fields vary
  avatarUrl: string;
  country: string;
  state: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO String
  createdAt: string;
  updatedAt: string;
}

export interface TradeUser {
  id: string;
  email: string;
  googleId: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  mapleradCustomerId: string;
  currentStep: string;
  completedOnboardingSteps: string; // Note: Received as a stringified JSON array in payload
  profile: UserProfile;
  referralCode: string;
  referredBy: string | null;
  securityOtp: string | null;
  securityOtpExpiresAt: string | null;
  twoFactorSecret: string | null;
  verificationToken: string | null;
  verificationTokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ManualTradeTransaction {
  id: string;
  userId: string;
  type: 'MANUAL_TRADE' | string;
  status: 'COMPLETED' | string;
  amount: number;
  currency: string;
  reference: string;
  note: string;
  metadata: string; // Parse this into the `TradeMetadata` interface
  user: TradeUser;
  createdAt: string;
  updatedAt: string;
}