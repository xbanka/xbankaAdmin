"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import type { TransactionRecord } from "./transaction-data";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { FilterTabs } from "../ui/FilterTabs";

interface TransactionsTableProps {
  data: TransactionRecord[];
  onNewTransaction: () => void;
}

export function TransactionsTable({
  data,
  onNewTransaction,
}: TransactionsTableProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      activeFilter === "all" ||
      item.serviceType.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  const columns = [
    { key: "transactionId", header: "Tan ID" },
    {
      key: "customerName",
      header: "Customer",
      render: (item: TransactionRecord) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.customerName}</span>
          <span className="text-xs text-gray-500">{item.customerId}</span>
        </div>
      ),
    },
    {
      key: "serviceType",
      header: "Service Type",
    },
    {
      key: "transactionType",
      header: "Transaction Type",
    },
    {
      key: "amountIn",
      header: "Amount In",
    },
    {
      key: "amountOut",
      header: "Amount Out",
    },
    {
      key: "vendorRate",
      header: "Vendor Rate",
    },
    {
      key: "xiibakaRate",
      header: "Xibaka Rate",
    },
    {
      key: "margin",
      header: "Margin",
    },
    {
      key: "status",
      header: "Status",
      render: (item: TransactionRecord) => (
        <span
          className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
            item.status === "completed"
              ? "bg-[#D1FAE5] text-[#37703F]"
              : item.status === "failed"
              ? "bg-[#FCE6E6] text-[#EF4444]"
              : "bg-[#FFF8D8] text-[#B29504]"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    { key: "vendor", header: "Vendor" },

    { key: "assignedRep", header: "Assigned Rep" },

    { key: "dateCreated", header: "Date" },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-[#111827]">
          Transaction Management
        </h1>
        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="" onClick={onNewTransaction}>
            + New Transaction
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2 mb-6 ">
          <FilterTabs
            filters={["All", "Crypto", "Gift Cards", "Bill Payments"]}
            value={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customer name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTableLayout
        data={filteredData}
        columns={columns}
        rowKey={(item) => item.id}
        itemsPerPage={10}
        emptyMessage="No transactions found."
      />
    </div>
  );
}
