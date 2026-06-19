import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { FieldError } from "react-hook-form";

type SelectOption =
  | string
  | {
      label: string;
      value: string;
    };

interface SelectFieldProps {
  id: string;
  label?: string;
  icon?: LucideIcon;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: FieldError;
  selectClassName?: string;
  value?: string | null;
}

export const SelectFieldLayout = ({
  id,
  label,
  icon: Icon,
  options,
  placeholder = "Select an option",
  onChange,
  className,
  error,
  selectClassName,
  value,
}: SelectFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative w-full">
        {Icon && (
          <Icon className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
        )}
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              `${Icon ? "pl-10 pr-6" : "px-6"} py-2 h-12 w-full border-[#2DD4BF] data-[placeholder]:border-border focus-visible:border-[#2DD4BF] focus-visible:ring-[#2DD4BF]/50`,
              selectClassName,
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => {
              const value = typeof option === "string" ? option : option.value;

              const label = typeof option === "string" ? option : option.label;
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-[10px] text-mainRed">{error.message}</p>}
    </div>
  );
};
