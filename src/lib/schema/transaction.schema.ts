import { z } from "zod";
import { cryptoTransactionSchema } from "./crypto-transaction.schema";
import { giftCardTransactionSchema } from "./giftcard-transaction.schema";
import { billPaymentTransactionSchema } from "./bill-payment-transaction.schema";

export const customerBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  affiliateAttribution: z.string().optional(),
  assignedRep: z.string(), // ✅ REQUIRED HERE
});

export const transactionSchema = z.object({
  customer: customerBaseSchema.partial().optional(), // ✅ relaxed
  serviceType: z.enum(["crypto", "gift-card", "bill-payments"]).optional(),
  details: z.object({}).passthrough().optional(),
});


export type TransactionFormValues = z.infer<typeof transactionSchema>;

export const submitTransactionSchema = z.object({
  customer: customerBaseSchema, // ✅ required
  serviceType: z.enum(["crypto", "gift-card", "bill-payments"]),
  details: z.discriminatedUnion("serviceType", [
    cryptoTransactionSchema,
    giftCardTransactionSchema,
    billPaymentTransactionSchema,
  ]),
});