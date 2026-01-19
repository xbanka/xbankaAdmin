import { LucideIcon } from "lucide-react";
import React from "react";
import { FieldError, FieldErrors, FieldErrorsImpl, Merge } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  // register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | FieldErrors | undefined;
  readOnly?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  readOnly,
  icon: Icon,
  register,
  inputProps,
  error,
  onChange,
  value
}: FormFieldProps) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${
            Icon ? "pl-10" : "px-3"
          } border-gray-200 focus:border-[var(--abstractCyan)]`}
          readOnly={readOnly}
          onChange={onChange}
          value={value}
          {...(register ? register(id) : {})}
          {...inputProps}
        />
      </div>
      {/* {error && <p className="text-[10px] text-mainRed">{error.message}</p>} */}
      {typeof error?.message === "string" && (
        <p className="text-[10px] text-mainRed">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;
