export type TransactionType = "crypto" | "gift-card" | "bill-payments"

export interface Customer {
  id: string
  name: string
  username: string
  email: string
  phone: string
  affiliateAttribution: string
  assignedRep: string
  totalTransactions: number
  lastTransactionDate: string
}

export interface CryptoTransaction {
  serviceType: string
  transactionType: string
  customerAmount: string
  vendor: string
  vendorRate: string
  xibakaRate: string
  margin: string
  expectedPayout: string
  customerAccountWallet: string
  xibakaAccount: string
  paymentDate: string
  meterNumber?: string
  meterType?: string
}

export interface GiftCardTransaction {
  serviceType: string
  cardType: string
  cardFaceValue: string
  currency: string
  quantity: string
  rayah: string
  vendor: string
  xibakaRate: string
  margin: string
  expectedPayout: string
  giftCardCode: string
  customerAccountWallet: string
  paymentDate: string
}

export interface BillPaymentTransaction {
  serviceType: string
  transactionType: string
  billCategory: string
  customerAmount: string
  vendor: string
  vendorRate: string
  xibakaRate: string
  margin: string
  meterNumber: string
  meterType: string
  prepaid: string
  transactionFee: string
  receivingAccountWallet: string
  paymentDate: string
}

export type TransactionData = CryptoTransaction | GiftCardTransaction | BillPaymentTransaction
