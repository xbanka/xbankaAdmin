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
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { formatDate } from "@/lib/formatDate";

const TRANSACTION_TYPES = [
  "USDT-NGN",
  "NGN-ETH",
  "BTC-NGN",
  "ETH-NGN",
  "NGN-USDT",
  "NGN-BTC",
];

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
    user?.role.allowed_permissions ?? [],
  );
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");

  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const normalizedFilter = activeFilter.toLowerCase();
  const apiServiceType = SERVICE_TYPE_FILTER_MAP[normalizedFilter];

  const handleCustomerClick = (
    item: TransactionRecord,
    e: React.MouseEvent,
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

  // Get unique formatted dates for date filter (deduplicated by formatted label)
  const uniqueDates = Array.from(
    new Set(
      filteredData.map((item: TransactionRecord) =>
        formatDate(item.created_at),
      ),
    ),
  )
    .sort()
    .reverse();

  // Calculate date range label
  const getDateRangeLabel = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return `Today (${dateStr})`;
    if (isYesterday) return `Yesterday (${dateStr})`;
    return dateStr;
  };

  const columns = [
    {
      key: "txn_id",
      header: "Transaction ID",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span
          className="block text-abstractCyan truncate max-w-full"
          title={item.txn_id}
        >
          {item.txn_id}
        </span>
      ),
    },
    {
      key: "affiliate_source",
      header: "Customer",
      className: "md:w-[140px]",
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
      className: "md:w-[140px]",
    },
    {
      key: "transaction_type",
      header: "Transaction Type",
      className: "md:w-[140px]",
    },
    {
      key: "amount_in",
      header: "Amount In",
      className: "md:w-[140px]",
    },
    {
      key: "amount_out",
      header: "Amount Out",
      className: "md:w-[140px]",
    },
    {
      key: "vendor_rate",
      header: "Vendor Rate",
      className: "md:w-[140px]",
    },
    {
      key: "xbanka_rate",
      header: "Xbanka Rate",
      className: "md:w-[140px]",
    },
    {
      key: "margin",
      header: "Margin",
      className: "md:w-[140px]",
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
    { key: "vendor", header: "Vendor", className: "md:w-[140px]" },

    { key: "assignedRep", header: "Assigned Rep", className: "md:w-[140px]" },

    {
      key: "created_at",
      header: "Date",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => formatDate(item.created_at),
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Header text="Transaction Management" />

        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            className="text-[#111827] py-2 px-3"
          >
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>
          {hasPermission(apiPermissionSet, "transactions:create") && (
            <Button
              size="sm"
              className="text-white py-2 px-3"
              onClick={onNewTransaction}
            >
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
          <SelectFieldLayout
            id="transactionType"
            options={TRANSACTION_TYPES}
            placeholder="Select transaction type"
            value={selectedTransactionType}
            onChange={setSelectedTransactionType}
            className="w-full md:w-64"
            selectClassName="border border-gray-300"
          />

          <SelectFieldLayout
            id="dateCreated"
            // eslint-ignore-next-line react-hooks/rules-of-hooks
            options={uniqueDates as string[]}
            placeholder="Select date"
            value={selectedDateRange}
            onChange={setSelectedDateRange}
            className="w-full md:w-48"
            selectClassName="border border-gray-300"
          />
        </div>
      </div>
      <div className="w-full md:max-w-[700px] lg:min-w-[100%] xl:min-w-full min-h-screen">
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
