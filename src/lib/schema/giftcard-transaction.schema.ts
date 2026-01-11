// lib/schemas/gift-card-transaction.schema.ts
import { z } from "zod";

export const giftCardTransactionSchema = z.object({

    serviceType: z.literal("gift-card"),
    cardType: z.string().min(1, "Card type is required"),
    cardFaceValue: z.string().min(1, "Card face value is required"),
    currency: z.string().min(1, "Currency is required"),
    quantity: z.string().min(1, "Quantity is required"),
    vendor: z.string().min(1, "Vendor is required"),
    xbankaRate: z.string().min(1, "Xbanka rate is required"),
    margin: z.string().min(1, "Margin is required"),
    expectedPayout: z.string().min(1, "Expected payout is required"),
    giftCardCode: z.string().min(1, "Gift card code is required"),
    customerAccountWallet: z.string().min(1, "Customer account is required"),
    paymentDate: z.string().min(1, "Payment date is required"),
});

export type GiftCardTransactionFormValues = z.infer<
  typeof giftCardTransactionSchema
>;
