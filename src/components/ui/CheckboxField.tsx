import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./label";

type CheckboxFieldProps = {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
};

const CheckboxField = ({ label, register, id }: CheckboxFieldProps) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <Checkbox id={id} className="cursor-pointer" {...register(id)} />
      <Label htmlFor={id} className="text-[#4B5563] cursor-pointer">{label}</Label>
    </label>
  );
};

export default CheckboxField;
