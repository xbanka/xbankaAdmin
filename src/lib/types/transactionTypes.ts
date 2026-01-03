import { TransactionRecord } from "@/components/transaction/transaction-data";

export type TransactionType = "crypto" | "gift-card" | "bill-payments";
export type ServiceType = "crypto" | "gift-card" | "bill-payments"


export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  note: string;
  affiliateAttribution?: string;
  assignedRep?: string;
}

export interface ActiveCustomer {
  email: string;
  id: string;
  name: string;
  phone: string;
}

export interface CryptoTransaction {
  serviceType: string;
  transactionType: string;
  customerAmount: string;
  vendor: string;
  vendorRate: string;
  xibakaRate: string;
  margin: string;
  expectedPayout: string;
  customerAccountWallet: string;
  xibakaAccount: string;
  paymentDate: string;
  meterNumber?: string;
  meterType?: string;
}

export interface GiftCardTransaction {
  serviceType: string;
  cardType: string;
  cardFaceValue: string;
  currency: string;
  quantity: string;
  rayah: string;
  vendor: string;
  xibakaRate: string;
  margin: string;
  expectedPayout: string;
  giftCardCode: string;
  customerAccountWallet: string;
  paymentDate: string;
}

export interface BillPaymentTransaction {
  serviceType: string;
  transactionType: string;
  billCategory: string;
  customerAmount: string;
  vendor: string;
  vendorRate: string;
  xibakaRate: string;
  margin: string;
  meterNumber: string;
  meterType: string;
  prepaid: string;
  transactionFee: string;
  receivingAccountWallet: string;
  paymentDate: string;
}

export interface TransactionsTableProps {
  data: TransactionRecord[];
  onNewTransaction: () => void;
  onCustomerDetailsOpen?: (customer: TransactionRecord) => void
}

export type TransactionData =
  | CryptoTransaction
  | GiftCardTransaction
  | BillPaymentTransaction;
