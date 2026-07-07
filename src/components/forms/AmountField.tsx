"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatAmountInput, parseNumber } from "@/lib/utils/formatNumber";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AmountFieldProps {
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  icon?: LucideIcon;
  currency?: string;
  currencySymbol?: string;
  inputClassName?: string;
}

/**
 * Amount input that shows thousands separators (e.g. 125,555) as the user types
 * while storing the raw numeric string (no commas) in the form, so downstream
 * parseFloat/Number math keeps working.
 */
export function AmountField({
  id,
  label,
  placeholder,
  className,
  icon: Icon,
  currency,
  currencySymbol,
  inputClassName,
}: AmountFieldProps) {
  const { watch, setValue } = useFormContext();
  const raw = watch(id) ?? "";

  return (
    <div className={`space-y-2 w-full ${className ?? ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
        )}
        {currencySymbol && (
          <p className="absolute left-3 top-1/2 flex items-center -translate-y-1/2 h-4 w-4 text-foreground">
            {currencySymbol}
          </p>
        )}
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          className={cn("px-3 focus:border-[var(--abstractCyan)]", inputClassName)}
          value={formatAmountInput(raw)}
          onChange={(e) =>
            setValue(id, parseNumber(e.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
        {
          currency && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)]">
              {currency}
            </span>
          ) 
        }
      </div>
    </div>
  );
}
