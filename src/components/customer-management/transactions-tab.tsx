import { ArrowLeftRight, Clock10, Clock5, X } from "lucide-react";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";
import { CustomerWalletData } from "@/lib/types/customer";

export interface TransactionsTabProps {
  transactions: any;
  wallet: CustomerWalletData;
}

export function TransactionsTab({ transactions, wallet }: TransactionsTabProps) {
  // Placeholder — no transaction data from UserProfileData
  return (
    <div className="p-6 flex flex-col">
      <SectionTitle>Transaction Summary</SectionTitle>
      <SectionCard>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col items-center gap-2">
            <div className="p-2.5 h-10 rounded-full bg-success-light flex items-center justify-center">
              <ArrowLeftRight size={20} className="text-[#0F766E]" />
            </div>
            <p className="text-xs font-normal leading-[18px] text-text-secondary text-center">
              Total Transactions
            </p>
            <p className="text-[16px] font-medium leading-6">{wallet?.totalTransactions || 0}</p>
          </div>
          <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col items-center gap-2">
            <div className="p-2.5 h-10 rounded-full bg-warning-light flex items-center justify-center">
              <Clock5 size={20} className="text-warning-text" />
            </div>
            <p className="text-xs font-normal leading-[18px] text-text-secondary text-center">
              Pending Transactions
            </p>
            <p className="text-[16px] font-medium leading-6">{wallet?.pendingTransactions || 0}</p>
          </div>
          <div className="bg-[var(--grey-light)] rounded-xl p-4 flex flex-col items-center gap-2">
            <div className="p-2.5 h-10 rounded-full bg-error-light flex items-center justify-center">
              <X size={20} className="text-error-text" />
            </div>
            <p className="text-xs font-normal leading-[18px] text-text-secondary text-center">
              Failed Transaction
            </p>
            <p className="text-[16px] font-medium leading-6">{wallet?.failedTransactions || 0}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
