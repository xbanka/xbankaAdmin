import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./label";
import { Controller } from "react-hook-form";

type CheckboxFieldProps = {
  id: string;
  label: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  isDefault?: boolean;
};

export const CheckboxField = ({
  label,
  id,
  control,
  disabled,
  isDefault,
}: CheckboxFieldProps) => {
  return (
    <Controller
      name={id}
      control={control}
      render={({ field }) => (
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled || isDefault}
          />
          <Label className="text-[#4B5563]">
            {label}
            {isDefault && (
              <span className="text-xs text-gray-400 ml-1">(default)</span>
            )}
          </Label>
        </label>
      )}
    />
  );
};
