// lib/schemas/crypto-transaction.schema.ts
import { z } from "zod"

export const cryptoTransactionSchema = z.object({
  serviceType: z
    .string()
    .min(1, "Service type is required"),

  transactionType: z
    .string()
    .min(1, "Transaction type is required"),

  customerAmount: z
    .string()
    .min(1, "Customer amount is required"),

  vendor: z
    .string()
    .min(1, "Vendor is required"),

  vendorRate: z
    .string()
    .min(1, "Vendor rate is required"),

  xbankaRate: z
    .string()
    .min(1, "Xbanka rate is required"),

  margin: z
    .string()
    .min(1, "Margin is required"),

  expectedPayout: z
    .string()
    .min(1, "Expected payout is required"),

  customerAccountWallet: z
    .string()
    .min(1, "Customer account/wallet is required"),

  xbankaAccount: z
    .string()
    .min(1, "Xbanka account is required"),

  paymentDate: z
    .string()
    .min(1, "Payment date is required"),
})

export type CryptoTransactionFormValues = z.infer<
  typeof cryptoTransactionSchema
>
