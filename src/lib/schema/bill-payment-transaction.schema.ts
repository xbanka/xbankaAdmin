// lib/schemas/bill-payment-transaction.schema.ts
import { z } from "zod"

export const billPaymentTransactionSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  transactionType: z.string().min(1, "Transaction type is required"),
  billCategory: z.string().min(1, "Bill category is required"),
  customerAmount: z.string().min(1, "Customer amount is required"),
  vendor: z.string().min(1, "Vendor is required"),
  vendorRate: z.string().min(1, "Vendor rate is required"),
  xibakaRate: z.string().min(1, "Xibaka rate is required"),
  margin: z.string().min(1, "Margin is required"),
  meterNumber: z.string().min(1, "Meter number is required"),
  meterType: z.string().min(1, "Meter type is required"),
  prepaid: z.string().min(1, "Prepaid selection is required"),
  transactionFee: z.string().min(1, "Transaction fee is required"),
  receivingAccountWallet: z
    .string()
    .min(1, "Receiving account is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
})

export type BillPaymentTransactionFormValues = z.infer<
  typeof billPaymentTransactionSchema
>
