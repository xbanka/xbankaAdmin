import { z } from "zod";

export const newCustomerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required"),

  lastName: z
    .string()
    .min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required"),

  note: z
    .string()
    .optional(),

  username: z
    .string().optional(),
});

export type NewCustomerFormValues = z.infer<typeof newCustomerSchema>;