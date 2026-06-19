"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { FilterTabs } from "../ui/FilterTabs";
import { TransactionsTableProps } from "@/lib/types/transactionTypes";
import { CustomerInfoPopup } from "./customer-info-popup";
import {
  useGetAllTransactions,
  useTransactions,
} from "@/lib/services/transaction.service";
import Header from "../ui/Header";
import { SERVICE_TYPE_FILTER_MAP } from "@/lib/enum/transaction.enum";
import { useUserStore } from "@/store/userStore";
import {
  hasPermission,
  normalizePermissionsFromApi,
} from "@/lib/rolePermissions";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { formatDate } from "@/lib/formatDate";
import { useAllColumns } from "./use-all-colums";
import { useFiatColumns } from "./use-fiat-colums";
import { useCryptoColumns } from "./use-crypto-columns";
import { useManualColumns } from "./use-manual-columns";
import { AllTabFilters } from "./all-tab-filters";
import { ManualTabFilters } from "./manual-tab-filters";
import { FiatTabFilters } from "./fiat-tab-filters";
import { CryptoTabFilters } from "./crypto-tab-filters";
import { TransactionRecord } from "@/lib/types/transaction-types";

const TRANSACTION_TYPES = [
  "USDT-NGN",
  "NGN-ETH",
  "BTC-NGN",
  "ETH-NGN",
  "NGN-USDT",
  "NGN-BTC",
];

export type ActiveTab =
  | "all"
  | "fiat"
  | "crypto"
  | "manual"
  | "gift cards"
  | "bill payments";

export const CATEGORY_MAP: Record<ActiveTab, string | undefined> = {
  all: undefined,
  fiat: "FIAT",
  crypto: "CRYPTO",
  manual: "MANUAL",
  "gift cards": "GIFT_CARD",
  "bill payments": "BILL_PAYMENT",
};

const moneyFmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(n ?? 0);

export function TransactionsTable({
  onNewTransaction,
  onCustomerDetailsOpen,
}: TransactionsTableProps) {
  const [activeFilter, setActiveFilter] = useState<ActiveTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<TransactionRecord | null>(null);
  const [page, setPage] = useState(1);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const user = useUserStore((state) => state.user);
  const apiPermissionSet = normalizePermissionsFromApi(
    user?.role.allowed_permissions ?? [],
  );
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");

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

  const {
    data: allTransactions,
    isPending: isPendingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
    refetch,
  } = useGetAllTransactions({
    page,
    limit: 10,
    status: statusFilter || undefined,
    category: CATEGORY_MAP[activeFilter],
    search: searchQuery || undefined,
  });

  const SERVICE_TYPE_MAP: Record<ActiveTab, string | null> = {
    all: null,
    fiat: "FIAT",
    crypto: "CRYPTO",
    manual: "MANUAL",
    "gift cards": "GIFT_CARD",
    "bill payments": "BILL_PAYMENT",
  };

  const transactions = transactionData?.data?.data ?? [];
  const transactionsBody = transactionData?.data;
  // const transactions: TransactionRecord[] = data?.items ?? [];
  // const meta = data?.meta;
  const filteredData = transactions.filter((item: TransactionRecord) => {
    const serviceTypeMatch =
      !SERVICE_TYPE_MAP[activeFilter] ||
      item.service_type === SERVICE_TYPE_MAP[activeFilter];
    const searchMatch =
      !searchQuery ||
      `${item.customer?.first_name} ${item.customer?.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.txn_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      !statusFilter ||
      statusFilter === "All" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    const sourceMatch =
      !sourceFilter ||
      sourceFilter === "All" ||
      item.source?.toLowerCase() === sourceFilter.toLowerCase();

    const typeMatch =
      !transactionTypeFilter ||
      transactionTypeFilter === "All" ||
      item.transaction_type?.toLowerCase() ===
        transactionTypeFilter.toLowerCase();

    return (
      serviceTypeMatch && searchMatch && statusMatch && sourceMatch && typeMatch
    );
  });

  // const allColumns = useAllColumns(handleCustomerClick);
  // const fiatColumns = useFiatColumns(handleCustomerClick);
  // const cryptoColumns = useCryptoColumns(handleCustomerClick);
  // const manualColumns = useManualColumns(handleCustomerClick);

  // const activeColumns =
  //   activeFilter === "fiat"
  //     ? fiatColumns
  //     : activeFilter === "crypto"
  //       ? cryptoColumns
  //       : activeFilter === "manual"
  //         ? manualColumns
  //         : allColumns;

  const handleTabChange = (tab: string) => {
    setActiveFilter(tab.toLowerCase() as ActiveTab);
    setSearchQuery("");
    setStatusFilter("");
    setSourceFilter("");
    setTransactionTypeFilter("");
    setPage(1);
  };

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

  // const columns = [
  //   {
  //     key: "txn_id",
  //     header: "Transaction ID",
  //     className: "md:w-[140px]",
  //     render: (item: TransactionRecord) => (
  //       <span
  //         className="block text-abstractCyan truncate max-w-full"
  //         title={item.txn_id}
  //       >
  //         {item.txn_id}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "affiliate_source",
  //     header: "Customer",
  //     className: "md:w-[140px]",
  //     render: (item: TransactionRecord) => (
  //       <div
  //         onClick={(e) => handleCustomerClick(item, e)}
  //         className="relative flex flex-col cursor-pointer hover:text-teal-600 transition"
  //       >
  //         <span className="font-medium text-teal-600 hover:underline">
  //           {item.customer.first_name} {item.customer.last_name}
  //         </span>
  //         <span className="text-xs text-gray-500">{item.customer.email}</span>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "service_type",
  //     header: "Service Type",
  //     className: "md:w-[140px]",
  //   },
  //   {
  //     key: "transaction_type",
  //     header: "Transaction Type",
  //     className: "md:w-[140px]",
  //   },
  //   {
  //     key: "amount_in",
  //     header: "Amount In",
  //     className: "md:w-[140px]",
  //   },
  //   {
  //     key: "amount_out",
  //     header: "Amount Out",
  //     className: "md:w-[140px]",
  //   },
  //   {
  //     key: "vendor_rate",
  //     header: "Vendor Rate",
  //     className: "md:w-[140px]",
  //   },
  //   {
  //     key: "xbanka_rate",
  //     header: "Xbanka Rate",
  //     className: "md:w-[140px]",
  //   },
  //   {
  //     key: "margin",
  //     header: "Margin",
  //     className: "md:w-[140px]",
  //   },
  //   // {
  //   //   key: "status",
  //   //   header: "Status",
  //   //   render: (item: TransactionRecord) => (
  //   //     <span
  //   //       className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
  //   //         item.status === "completed"
  //   //           ? "bg-[#D1FAE5] text-[#37703F]"
  //   //           : item.status === "failed"
  //   //           ? "bg-[#FCE6E6] text-[#EF4444]"
  //   //           : "bg-[#FFF8D8] text-[#B29504]"
  //   //       }`}
  //   //     >
  //   //       {item.status}
  //   //     </span>
  //   //   ),
  //   // },
  //   { key: "vendor", header: "Vendor", className: "md:w-[140px]" },

  //   { key: "assignedRep", header: "Assigned Rep", className: "md:w-[140px]" },

  //   {
  //     key: "created_at",
  //     header: "Date",
  //     className: "md:w-[140px]",
  //     render: (item: TransactionRecord) => formatDate(item.created_at),
  //   },
  // ];

  const baseColumns = [
    {
      key: "reference",
      header: "Txn ID",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span className="text-[var(--text-teal)] text-xs truncate block" title={item.reference}>
          {item.reference}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <div onClick={(e) => handleCustomerClick(item, e)} className="cursor-pointer">
          <span className="text-[var(--text-teal)] text-sm font-medium hover:underline block">
            {item.customer?.firstName} {item.customer?.lastName}
          </span>
          <span className="text-xs text-gray-500">{item.customer?.email}</span>
        </div>
      ),
    },
  ];

  const allColumns = [
    ...baseColumns,
    {
      key: "kycTier",
      header: "Tier Level",
      className: "md:w-[100px]",
      render: (item: TransactionRecord) => <TierBadge tier={item.customer?.kycTier} />,
    },
    {
      key: "details",
      header: "Details",
      className: "md:w-[200px]",
      render: (item: TransactionRecord) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-800">{item.displayType}</span>
          <span className="text-[10px] text-gray-400">{item.note}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-800">
          {item.currency} {moneyFmt(item.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => <StatusBadge status={item.status} />,
    },
  ];

  const fiatColumns = [
    ...baseColumns,
    {
      key: "type",
      header: "Type",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-700 capitalize">{item.type?.toLowerCase()}</span>
      ),
    },
    {
      key: "direction",
      header: "Direction",
      className: "md:w-[90px]",
      render: (item: TransactionRecord) => {
        const credit = item.type === "DEPOSIT";
        return (
          <span className={`text-xs font-medium ${credit ? "text-[var(--success-text)]" : "text-[var(--mainRed)]"}`}>
            {credit ? "Credit" : "Debit"}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-800">
          {item.currency} {moneyFmt(item.amount)}
        </span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">{item.tradeDetails?.deliveryMethod ?? "—"}</span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">{item.tradeDetails?.partner ?? "—"}</span>
      ),
    },
  ];

  const cryptoColumns = [
    ...baseColumns,
    {
      key: "kycTier",
      header: "Tier Level",
      className: "md:w-[100px]",
      render: (item: TransactionRecord) => <TierBadge tier={item.customer?.kycTier} />,
    },
    {
      key: "type",
      header: "Type",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-700">{item.displayType}</span>
      ),
    },
    {
      key: "asset",
      header: "Asset",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-700">
          {item.tradeDetails?.sourceCurrency}-{item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "customer_pays",
      header: "Customer Pays",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.sourceAmount)} {item.tradeDetails?.sourceCurrency}
        </span>
      ),
    },
    {
      key: "customer_receives",
      header: "Customer Receives",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.payoutAmount)} {item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => <StatusBadge status={item.status} />,
    },
  ];

  const manualColumns = [
    ...baseColumns,
    {
      key: "type",
      header: "Type",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-700">{item.displayType}</span>
      ),
    },
    {
      key: "asset",
      header: "Asset",
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-700">
          {item.tradeDetails?.sourceCurrency}-{item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "customer_pays",
      header: "Customer Pays",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.sourceAmount)} {item.tradeDetails?.sourceCurrency}
        </span>
      ),
    },
    {
      key: "customer_receives",
      header: "Customer Receives",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.payoutAmount)} {item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">{item.tradeDetails?.channelOrigin ?? "—"}</span>
      ),
    },
  ];

  const activeColumns =
    activeFilter === "fiat" ? fiatColumns :
    activeFilter === "crypto" ? cryptoColumns :
    activeFilter === "manual" ? manualColumns :
    allColumns;

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
            filters={[
              "All",
              "Fiat",
              "Crypto",
              "Manual",
              "Gift Cards",
              "Bill Payments",
            ]}
            value={activeFilter}
            onChange={handleTabChange}
          />
        </div>

        <div>
          {/* Per-tab filter bar */}
          {activeFilter === "all" && (
            <AllTabFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
            />
          )}
          {activeFilter === "fiat" && (
            <FiatTabFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              transactionTypeFilter={transactionTypeFilter}
              setTransactionTypeFilter={setTransactionTypeFilter}
            />
          )}
          {activeFilter === "crypto" && (
            <CryptoTabFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
            />
          )}
          {activeFilter === "manual" && (
            <ManualTabFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
            />
          )}
          {(activeFilter === "gift cards" ||
            activeFilter === "bill payments") && (
            <AllTabFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
            />
          )}
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
          columns={activeColumns}
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

      {/* <CustomerInfoPopup
        customer={selectedCustomer}
        popupPosition={popupPosition}
        onClose={() => setSelectedCustomer(null)}
        onViewDetails={() => {
          if (selectedCustomer && onCustomerDetailsOpen) {
            onCustomerDetailsOpen(selectedCustomer);
            setSelectedCustomer(null);
          }
        }}
      /> */}
    </div>
  );
}
