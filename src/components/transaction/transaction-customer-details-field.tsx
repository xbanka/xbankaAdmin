import React from "react";
import { Label } from "../ui/label";

export interface TransactionCustomerDetailsFieldProps {
  label: string;
  body: string;
}

const TransactionCustomerDetailsField = ({
  label,
  body,
}: TransactionCustomerDetailsFieldProps) => {
  return (
    <div className="space-y-[8px] w-full">
      <Label className="text-[12px] text-[#111827] font-[400] leading-[16px]">
        {label}
      </Label>
      <p className="border w-full border-[#E5E7EB] rounded-[8px] px-[12px] py-[10px] font-semibold text-[#111827] text-[14px] leading-[20px] ">
        {body}
      </p>
    </div>
  );
};

export default TransactionCustomerDetailsField;
