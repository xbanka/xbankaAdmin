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

export const transactionSchema = z
  .object({
    customer: customerBaseSchema.partial().optional(), // ✅ relaxed
    serviceType: z.enum(["crypto", "gift-card", "bill-payments"]).optional(),
    details: z.object({
      /* ---- CRYPTO ---- */
      transactionType: z.string().optional(),
      customerAmount: z.coerce.number().optional(),
      vendor: z.string().optional(),
      vendorRate: z.string().optional(),
      xbankaRate: z.string().optional(),
      margin: z.string().optional(),
      expectedPayout: z.string().optional(),
      customerAccountWallet: z.string().optional(),
      xbankaAccount: z.string().optional(),
      paymentDate: z.string().optional(),

      /* ---- GIFT CARD ---- */
      cardType: z.string().optional(),
      cardFaceValue: z.string().optional(),
      currency: z.string().optional(),
      quantity: z.string().optional(),
      giftCardCode: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "crypto") {
      const requiredCryptoFields = [
        "transactionType",
        "customerAmount",
        "vendor",
        "vendorRate",
        "xbankaRate",
        "expectedPayout",
        "customerAccountWallet",
        "xbankaAccount",
        "paymentDate",
      ] as const;

      requiredCryptoFields.forEach((field) => {
        if (!data.details?.[field]) {
          ctx.addIssue({
            path: ["details", field],
            message: "This field is required",
            code: z.ZodIssueCode.custom,
          });
        }
      });
    }

    if (data.serviceType === "gift-card") {
      const requiredGiftCardFields = [
        "cardType",
        "cardFaceValue",
        "currency",
        "quantity",
        "giftCardCode",
        "vendor",
        "vendorRate",
        "xbankaRate",
        "expectedPayout",
        "customerAccountWallet",
        "paymentDate",
      ] as const;

      requiredGiftCardFields.forEach((field) => {
        if (!data.details?.[field]) {
          ctx.addIssue({
            path: ["details", field],
            message: "This field is required",
            code: z.ZodIssueCode.custom,
          });
        }
      });
    }
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
