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
    <div className="flex flex-col md:flex-row gap-3 mb-6 items-start md:items-center justify-between">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <SelectFieldLayout
          id="statusFilter"
          options={["All", "Successful", "Pending", "Failed", "Processing"]}
          placeholder="Status: All"
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-36"
          selectClassName="border border-gray-300"
        />
        <SelectFieldLayout
          id="sourceFilter"
          options={["All", "Web App", "WhatsApp", "Manual"]}
          placeholder="Source: All"
          value={sourceFilter}
          onChange={setSourceFilter}
          className="w-36"
          selectClassName="border border-gray-300"
        />
        <button className="text-xs text-gray-500 border border-gray-200 rounded px-3 py-2 hover:bg-gray-50">
          More filter
        </button>
      </div>
    </div>
  );
}