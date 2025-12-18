import { z } from "zod"
import { cryptoTransactionSchema } from "./crypto-transaction.schema"
import { giftCardTransactionSchema } from "./giftcard-transaction.schema"

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  affiliateAttribution: z.string().optional(),
  assignedRep: z.string().optional(),
})

export const transactionSchema = z.object({
  customer: customerSchema,

  serviceType: z.enum(["crypto", "gift-card", "bill-payments"]),

  details: z.discriminatedUnion("serviceType", [
    cryptoTransactionSchema,
    giftCardTransactionSchema,
    // billPaymentTransactionSchema later
  ]),
})

export type TransactionFormValues = z.infer<
  typeof transactionSchema
>
