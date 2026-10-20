import { z } from "zod";

// Mirrors XbankaAccountCreateRequest, so a bad form is caught before the
// backend's 422.
export const xbankaAccountSchema = z.object({
  bankCode: z.string().min(1, "Pick the bank"),
  bankName: z.string().trim().min(1, "Pick the bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  accountName: z.string().trim().min(1, "Enter the account name"),
  isPrimary: z.boolean(),
});

export type XbankaAccountForm = z.infer<typeof xbankaAccountSchema>;
