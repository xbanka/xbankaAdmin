// lib/schemas/crypto-transaction.schema.ts
import { z } from "zod";
import { giftCardTransactionSchema } from "./giftcard-transaction.schema";
import { billPaymentTransactionSchema } from "./bill-payment-transaction.schema";

export const cryptoTransactionSchema = z.object({
  // Step 1
  transactionType: z.string().optional(),
  tradeDirection: z.string().optional(),
  channelOrigin: z.string().optional(),
  // Step 2
  customerPays: z.string().optional(),
  customerPaysCurrency: z.string().optional(),
  customerReceives: z.string().optional(),
  customerReceivesCurrency: z.string().optional(),
  partner: z.string().optional(),
  partnerRate: z.string().optional(),
  xbankaRate: z.string().optional(),
  internalNotes: z.string().optional(),
  // Step 3
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentReference: z.string().optional(),
  xbankaAccount: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryAsset: z.string().optional(),
  deliverySource: z.string().optional(),
  deliveryStatus: z.string().optional(),
  deliveryReference: z.string().optional(),
  attachment: z.string().nullable().optional(),
});

export type CryptoTransactionFormValues = z.infer<
  typeof cryptoTransactionSchema
>;

export const transactionSchema = z.discriminatedUnion("serviceType", [
  cryptoTransactionSchema,
  giftCardTransactionSchema,
  billPaymentTransactionSchema,
]);
