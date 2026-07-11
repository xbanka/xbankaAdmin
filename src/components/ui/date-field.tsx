"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

interface DateFieldProps {
  id: string;
  label?: string;
  value?: Date;
  placeholder?: string;
  onChange?: (date?: Date) => void;
  className?: string;
  buttonClassName?: string;
  error?: FieldError;
  disabled?: boolean;
}

export function DateField({
  id,
  label,
  value,
  onChange,
  placeholder = "Select date",
  className,
  buttonClassName,
  error,
  disabled,
}: DateFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "border-input flex justify-between h-9 w-full min-w-0 rounded-[0.5rem] border bg-transparent px-3 py-[10px] text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-[#2DD4BF] focus-visible:ring-[#2DD4BF]/50 focus-visible:ring-[3px] not-placeholder-shown:border-[#2DD4BF] px-4 border-[#2DD4BF] hover:border-[#2DD4BF] font-normal",
              !value && "text-muted-foreground",
              buttonClassName,
            )}
          >
            {value ? format(value, "dd MMM yyyy") : placeholder}

            <CalendarIcon className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            // initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-[10px] text-mainRed">{error.message}</p>}
    </div>
  );
}
