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
  category: "CRYPTO" | "FIAT" | "GIFT_CARD" | "BILL_PAYMENT" | "MANUAL" | string;
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
  isNewUser: boolean;

  customerId?: string;

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

  marginPerUsdt: number;
  totalMargin: number;
  marginPercentage: string;

  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string;
  receivedInto: string;

  deliveryMethod: string;
  deliveryAsset: string;
  deliverySource: string;
  deliveryStatus: string;
  deliveryReference: string;

  internalNotes?: string;
  attachmentUrl?: string;
}