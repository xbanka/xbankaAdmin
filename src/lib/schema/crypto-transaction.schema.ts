// lib/schemas/crypto-transaction.schema.ts
import { z } from "zod";
import { giftCardTransactionSchema } from "./giftcard-transaction.schema";
import { billPaymentTransactionSchema } from "./bill-payment-transaction.schema";

export const cryptoTransactionSchema = z.object({

    serviceType: z.literal("crypto"),

    transactionType: z.string().min(1, "Transaction type is required"),

    customerAmount: z.coerce.number().positive("Amount must be greater than 0"),

    vendor: z.string().min(1, "Vendor is required"),

    vendorRate: z.string().min(1, "Vendor rate is required"),

    xbankaRate: z.string().min(1, "Xbanka rate is required"),

    margin: z.string().min(1, "Margin is required"),

    expectedPayout: z.string().min(1, "Expected payout is required"),

    customerAccountWallet: z
      .string()
      .min(1, "Customer account/wallet is required"),

    xbankaAccount: z.string().min(1, "Xbanka account is required"),

    paymentDate: z.string().min(1, "Payment date is required"),
});

export type CryptoTransactionFormValues = z.infer<
  typeof cryptoTransactionSchema
>;

export const transactionSchema = z.discriminatedUnion("serviceType", [
  cryptoTransactionSchema,
  giftCardTransactionSchema,
  billPaymentTransactionSchema,
]);
