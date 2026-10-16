import { z } from "zod";
import { isAmountOverridden } from "../utils/funding";

/**
 * The declared amount isn't part of the form, so the schema is built per
 * intent: changing the amount makes the override reason mandatory, exactly
 * as the backend does (it 422s on `amount` without `overrideReason`).
 */
export const completeIntentSchema = (declaredAmount: number) =>
  z
    .object({
      bankReference: z.string().trim().min(1, "Enter the bank reference or session ID"),
      // AmountField stores the raw numeric string with commas stripped.
      amount: z
        .string()
        .min(1, "Enter the amount received")
        .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, {
          message: "Amount must be greater than 0",
        }),
      overrideReason: z.string(),
      fundingAccountId: z.string(),
    })
    .refine(
      (v) => !isAmountOverridden(v.amount, declaredAmount) || v.overrideReason.trim().length > 0,
      {
        message: "Explain why the amount differs from what the customer declared",
        path: ["overrideReason"],
      },
    );

export type CompleteIntentForm = z.infer<ReturnType<typeof completeIntentSchema>>;

export const rejectIntentSchema = z.object({
  reason: z.string().trim().min(1, "Give a reason for rejecting"),
});

export type RejectIntentForm = z.infer<typeof rejectIntentSchema>;
