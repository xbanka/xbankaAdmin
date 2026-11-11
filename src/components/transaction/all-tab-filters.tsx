import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";

export function AllTabFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
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
        {/* <SelectFieldLayout
          id="sourceFilter"
          options={["All", "Web App", "WhatsApp", "Manual"]}
          placeholder="Source: All"
          value={sourceFilter}
          onChange={setSourceFilter}
          className="w-full md:w-36"
          selectClassName="border border-gray-300"
        /> */}
      </div>
    </div>
  );
}