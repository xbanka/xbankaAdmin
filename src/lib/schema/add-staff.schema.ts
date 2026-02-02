import z from "zod";
import { Role } from "../enum/roles&permission.enum";

export const StepOneStaffSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
  })

export type stepOneFormData = z.infer<typeof StepOneStaffSchema>;

export const StepTwoStaffSchema = z
  .object({
    role: z.nativeEnum(Role),
  })
  .passthrough(); 

export type stepTwoFormData = z.infer<typeof StepTwoStaffSchema>;

export const StepThreeStaffSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type stepThreeFormData = z.infer<typeof StepThreeStaffSchema>;
