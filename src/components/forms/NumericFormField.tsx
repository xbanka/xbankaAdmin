"use client";

import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import { useController, Control, FieldError } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatNumber, parseNumber } from "@/lib/utils/formatNumber";

interface NumericFormFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
  icon?: LucideIcon;
  readOnly?: boolean;
  error?: FieldError;
}

const NumericFormField = ({
  name,
  label,
  control,
  placeholder,
  icon: Icon,
  readOnly,
  error,
}: NumericFormFieldProps) => {
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });

  const [isFocused, setIsFocused] = useState(false);
  const rawValue = field.value ?? "";

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={name}>{label}</Label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        )}

        <Input
          id={name}
          placeholder={placeholder}
          readOnly={readOnly}
          value={
            isFocused || rawValue === ""
              ? rawValue
              : formatNumber(rawValue)
          }
          className={`${Icon ? "pl-10" : "px-3"} border-gray-200`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            if (readOnly) return;

            const raw = parseNumber(e.target.value);

            // Numeric(12,2)
            if (!/^\d{0,10}(\.\d{0,2})?$/.test(raw)) return;

            field.onChange(raw);
          }}
        />
      </div>

      {typeof error?.message === "string" && (
        <p className="text-[10px] text-mainRed">{error.message}</p>
      )}
    </div>
  );
};

export default NumericFormField;
