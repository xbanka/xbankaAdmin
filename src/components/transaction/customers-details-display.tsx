import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActiveCustomer, Customer } from "./types";
import FinanceDetailsHeader from "../layout/Finance/FinanceDetailsHeader";
import CustomDetailsName from "../finance/CustomDetailsName";

interface CustomerDetailsDisplayProps {
  customer: ActiveCustomer;
  displayTitle?: string;
}

export function CustomerDetailsDisplay({
  customer,
  displayTitle,
}: CustomerDetailsDisplayProps) {
  return (
    <div className="py-[16px] px-[24px] bg-[#F5F5F5] space-y-2">
      {/* Payment Details Summary */}
      <h1 className="font-[500] text-[14px] leading-[20px]">{displayTitle}</h1>
      <div className="space-y-[8px]">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-[8px] p-3">
          <CustomDetailsName title="Name" body={customer.name} />
          <CustomDetailsName title="Username" body={customer.name} />
          <CustomDetailsName title="Email" body={customer.email} />
          <CustomDetailsName
            title="Total Transactions"
            body={`₦${customer.phone}%`}
          />
          <CustomDetailsName
            title="Affiliate"
            body={customer.phone}
          />
          <CustomDetailsName
            title="Joined"
            body={customer.phone}
          />
        </div>
      </div>
    </div>
  );
}
