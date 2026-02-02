import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./label";

type CheckboxFieldProps = {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  disabled?: boolean;
  defaultChecked?: boolean;
  isDefault?: boolean;
};

export const CheckboxField = ({
  label,
  register,
  id,
  disabled,
  defaultChecked,
  isDefault,
}: CheckboxFieldProps) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <Checkbox
        id={id}
        disabled={disabled}
        defaultChecked={defaultChecked}
        checked={isDefault ? true : undefined}
        onClick={(e) => {
          if (isDefault) e.preventDefault();
        }}
        className="cursor-pointer"
        {...register(id)}
      />
      <Label htmlFor={id} className="text-[#4B5563]">
        {label}
        {defaultChecked && (
          <span className="text-xs text-gray-400 ml-1">(default)</span>
        )}
        {disabled && !defaultChecked && (
          <span className="text-xs text-red-500 ml-1">(restricted)</span>
        )}
      </Label>
    </label>
  );
};
