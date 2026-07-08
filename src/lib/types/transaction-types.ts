export interface TransactionCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  kycTier: number;
}

export interface TransactionTradeDetails {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  payoutAmount: number;
  grossPayout: number;
  partner: string | null;
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  deliveryStatus: string;
  attachmentUrl: string | null;
  channelOrigin: string;
}

export interface TransactionRateAndMargin {
  obiexRate: number;
  xbankaCustomerRate: number;
  spreadMargin: string;
  platformFee: number;
}

export interface TransactionRecord {
  id: string;
  reference: string;
  createdAt: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "PROCESSING" | string;
  type: string; // e.g. "WITHDRAWAL", "DEPOSIT"
  displayType: string; // e.g. "Crypto Withdrawal"
  currency: string;
  amount: number;
  note: string;
  category:
    | "CRYPTO"
    | "FIAT"
    | "GIFT_CARD"
    | "BILL_PAYMENT"
    | "MANUAL"
    | string;
  customer: TransactionCustomer;
  tradeDetails: TransactionTradeDetails;
  rateAndMargin: TransactionRateAndMargin;
}

export interface TransactionsMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface TransactionsResponse {
  items: TransactionRecord[];
  meta: TransactionsMeta;
}

export interface CreateManualTransactionPayload {
  isNewUser?: boolean;

  userId?: string;

  newUserData?: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };

  tradeDirection: string;

  customerPaysCurrency: string;
  customerPaysAmount: number;

  customerReceivesCurrency: string;
  customerReceivesAmount: number;

  partner: string;
  partnerRate: number;
  xbankaRate: number;

  partnerCost: number;
  marginPerUsdt: number;
  grossMargin: number;
  marginPercentage: number;

  // Customer Payment
  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string;
  expectedAmount: number;
  amountReceived: number;
  receivedInto: string;
  dateReceived: string;

  // Sell only
  asset?: string;
  network?: string;
  senderWalletAddress?: string;
  transactionHash?: string;

  // Delivery
  deliveryMethod: string;
  deliveryStatus: string;
  deliverySource: string;

  // Buy only
  deliveryAsset?: string;
  // network?: string;

  expectedDeliveryAmount: number;
  amountDelivered: number;

  attachmentUrl?: string;

  internalNotes?: string;
}

export type OnboardingStep =
  | "SIGNUP"
  | "EMAIL_VERIFIED"
  | "BASIC_INFO"
  | "BVN"
  | "IDENTITY"
  | "SELFIE"
  | "ADDRESS"
  | "COMPLETED";

// 2. Profile Interface
export interface CustomerUserProfileDetails {
  id: string;
  userId: string;
  avatarUrl: string;
  country: string;
  state: string;
  city?: string | null;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | string;
  phoneNumber: string;
  dateOfBirth: string; // ISO String
  createdAt: string;
  updatedAt: string;
}

// 3. User Interface
export interface CustomerUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  googleId: string | null;
  mapleradCustomerId: string | null;
  referralCode: string | null;
  referredBy: string | null;
  currentStep: OnboardingStep;
  // Kept as string since it arrives as a stringified JSON array from your DB
  completedOnboardingSteps: string;
  createdAt: string;
  updatedAt: string;
  profile: CustomerUserProfileDetails;

  // Excluded or optional sensitive/nullable backend auth fields
  password?: string;
  transactionPin?: string;
  twoFactorSecret?: string | null;
  securityOtp?: string | null;
  securityOtpExpiresAt?: string | null;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: string | null;
}

// 4. Main Transaction Root Interface
export interface TransactionDetails {
  id: string;
  userId: string;
  amount: number;
  currency: "NGN" | "USD" | string;
  reference: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | string;
  type: "MANUAL_TRADE" | string;
  note: string;
  details?: string | null;
  errorGroup?: string | null;
  createdAt: string;
  updatedAt: string;
  user: CustomerUser;
  // Kept as string since it arrives as a stringified JSON object from your DB
  metadata: string;
}
