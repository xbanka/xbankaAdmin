import { LucideIcon } from "lucide-react";
import { FieldError } from "react-hook-form";

export interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  error?: FieldError;
  disabled?: boolean;
}