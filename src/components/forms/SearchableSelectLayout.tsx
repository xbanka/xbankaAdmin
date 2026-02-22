import { useState } from "react";
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
import { Input } from "../ui/input";

interface SearchSelectFieldLayoutProps {
  id: string;
  label?: string;
  icon?: LucideIcon;
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: FieldError;
  selectClassName?: string;
  value?: string | null;
}

export const SearchSelectFieldLayout = ({
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
}: SearchSelectFieldLayoutProps) => {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative w-full">
        {Icon && (
          <Icon className="absolute left-3 top-4 h-4 w-4 text-gray-400 z-10" />
        )}

        <Select
          value={value ?? ""}
          onValueChange={(val) => {
            onChange?.(val);
            setSearch("");
          }}
        >
          <SelectTrigger
            className={cn(
              `${Icon ? "pl-10 pr-6" : "px-6"} py-2 h-12 w-full border-[#E5E7EB] focus:border-[var(--abstractCyan)] focus:ring-[var(--abstractCyan)]`,
              selectClassName
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {/* Search input */}
            <div className="p-2 border-b border-gray-200">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              )}
            </div>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <p className="text-[10px] text-mainRed">{error.message}</p>
      )}
    </div>
  );
};
