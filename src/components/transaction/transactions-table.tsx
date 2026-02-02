"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import type { TransactionRecord } from "./transaction-data";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { FilterTabs } from "../ui/FilterTabs";
import { TransactionsTableProps } from "@/lib/types/transactionTypes";
import { CustomerInfoPopup } from "./customer-info-popup";
import { useTransactions } from "@/lib/services/transaction.service";
import Header from "../ui/Header";
import { SERVICE_TYPE_FILTER_MAP } from "@/lib/enum/transaction.enum";
import { useUserStore } from "@/store/userStore";
import {
  hasPermission,
  normalizePermissionsFromApi,
} from "@/lib/rolePermissions";

export function TransactionsTable({
  onNewTransaction,
  onCustomerDetailsOpen,
}: TransactionsTableProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<TransactionRecord | null>(null);
  const [page, setPage] = useState(1);
  const user = useUserStore((state) => state.user);
  const apiPermissionSet = normalizePermissionsFromApi(
    user?.role.permissions ?? []
  );

  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const normalizedFilter = activeFilter.toLowerCase();
  const apiServiceType = SERVICE_TYPE_FILTER_MAP[normalizedFilter];

  const handleCustomerClick = (
    item: TransactionRecord,
    e: React.MouseEvent
  ) => {
    setSelectedCustomer(item);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + 8, // Position 8px below the customer cell
      left: rect.left + rect.width / 2, // Center with the customer name column
    });
  };

  const {
    data: transactionData,
    isPending,
    isError,
    error,
  } = useTransactions(page, 10);

  const transactions = transactionData?.data?.data ?? [];
  const transactionsBody = transactionData?.data;
  const filteredData = transactions.filter((item: TransactionRecord) => {
    const matchesSearch =
      item?.customer.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !apiServiceType || item.service_type === apiServiceType;

    return matchesSearch && matchesType;
  });

  const columns = [
    {
      key: "txn_id",
      header: "Transaction ID",
      width: "15%",
      render: (item: TransactionRecord) => (
        <span className="block truncate max-w-full" title={item.txn_id}>
          {item.txn_id}
        </span>
      ),
    },
    {
      key: "affiliate_source",
      header: "Customer",
      render: (item: TransactionRecord) => (
        <div
          onClick={(e) => handleCustomerClick(item, e)}
          className="relative flex flex-col cursor-pointer hover:text-teal-600 transition"
        >
          <span className="font-medium text-teal-600 hover:underline">
            {item.customer.first_name} {item.customer.last_name}
          </span>
          <span className="text-xs text-gray-500">{item.customer.email}</span>
        </div>
      ),
    },
    {
      key: "service_type",
      header: "Service Type",
    },
    {
      key: "transaction_type",
      header: "Transaction Type",
    },
    {
      key: "amount_in",
      header: "Amount In",
    },
    {
      key: "amount_out",
      header: "Amount Out",
    },
    {
      key: "vendor_rate",
      header: "Vendor Rate",
    },
    {
      key: "xbanka_rate",
      header: "Xbanka Rate",
    },
    {
      key: "margin",
      header: "Margin",
    },
    // {
    //   key: "status",
    //   header: "Status",
    //   render: (item: TransactionRecord) => (
    //     <span
    //       className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
    //         item.status === "completed"
    //           ? "bg-[#D1FAE5] text-[#37703F]"
    //           : item.status === "failed"
    //           ? "bg-[#FCE6E6] text-[#EF4444]"
    //           : "bg-[#FFF8D8] text-[#B29504]"
    //       }`}
    //     >
    //       {item.status}
    //     </span>
    //   ),
    // },
    { key: "vendor", header: "Vendor" },

    { key: "assignedRep", header: "Assigned Rep" },

    {
      key: "created_at",
      header: "Date",
      render: (item: TransactionRecord) =>
        new Date(item.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Header text="Transactions" />

        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>
          {hasPermission(apiPermissionSet, "transactions:create") && (
            <Button size="sm" className="" onClick={onNewTransaction}>
              + New Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="md:flex items-center justify-between">
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
      <div className="lg:max-w-[1060px] xl:min-w-full min-h-screen">
        <DataTableLayout
          data={filteredData}
          columns={columns}
          rowKey={(item) => item.id}
          isError={isError}
          isLoading={isPending}
          errorMessage={error?.message}
          itemsPerPage={10}
          emptyMessage="No transactions found."
          totalCount={transactionsBody?.total}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      <CustomerInfoPopup
        customer={selectedCustomer}
        popupPosition={popupPosition}
        onClose={() => setSelectedCustomer(null)}
        onViewDetails={() => {
          if (selectedCustomer && onCustomerDetailsOpen) {
            onCustomerDetailsOpen(selectedCustomer);
            setSelectedCustomer(null);
          }
        }}
      />
    </div>
  );
}
