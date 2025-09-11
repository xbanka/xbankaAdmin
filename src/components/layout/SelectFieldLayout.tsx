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

interface SelectFieldProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  className: string
  error?: FieldError;
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
}: SelectFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative w-full">
        {Icon && (
          <Icon className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
        )}
        <Select onValueChange={onChange}>
          <SelectTrigger className="pl-10 pr-3 h-12 w-full border-gray-200 focus:border-[var(--abstractCyan)] focus:ring-[var(--abstractCyan)]">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-[10px] text-mainRed">{error.message}</p>}
    </div>
  );
}
