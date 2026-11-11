import { Search } from "lucide-react";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { Input } from "../ui/input";

export function FiatTabFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  transactionTypeFilter,
  setTransactionTypeFilter,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  transactionTypeFilter: string;
  setTransactionTypeFilter: (v: string) => void;
}) {
  return (
    <div className="col-span-2 w-full md:w-auto flex flex-col md:flex-row gap-3 md:items-end justify-between">
      <div className="grid grid-cols-2 gap-3 w-full md:flex md:gap-2">
        <SelectFieldLayout
          id="statusFilter"
          options={["All", "Successful", "Pending", "Failed"]}
          placeholder="Status: All"
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full md:w-36"
          selectClassName="border border-gray-300"
        />
        <SelectFieldLayout
          id="transactionTypeFilter"
          options={["All", "Deposit", "Withdrawal"]}
          placeholder="Transaction Type"
          value={transactionTypeFilter}
          onChange={setTransactionTypeFilter}
          className="w-full md:w-44"
          selectClassName="border border-gray-300"
        />
      </div>
    </div>
  );
}