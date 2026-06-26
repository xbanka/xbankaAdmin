"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatAmountInput, parseNumber } from "@/lib/utils/formatNumber";

interface AmountFieldProps {
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
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
}: AmountFieldProps) {
  const { watch, setValue } = useFormContext();
  const raw = watch(id) ?? "";

  return (
    <div className={`space-y-2 w-full ${className ?? ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        className="px-3 focus:border-[var(--abstractCyan)]"
        value={formatAmountInput(raw)}
        onChange={(e) =>
          setValue(id, parseNumber(e.target.value), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
    </div>
  );
}
