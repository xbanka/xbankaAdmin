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
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled || isDefault}
            // Default permissions are locked (can't be unchecked), not
            // degraded — the base disabled state shouldn't wash out its color.
            className={isDefault ? "disabled:opacity-100" : undefined}
          />
          <Label className="text-[#4B5563] font-normal text-[12px] peer-disabled:opacity-100">
            <span className="whitespace-nowrap">{label}</span>
            {/* {isDefault && (
              <span className="font-normal text-[12px] text-gray-400">(default)</span>
            )} */}
          </Label>
        </label>
      )}
    />
  );
};
