"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Eye, Search } from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { FilterTabs } from "../ui/FilterTabs";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { TransactionsTableProps } from "@/lib/types/transactionTypes";
import {
  useExportTransactions,
  useGetAllTransactions,
  useTransactions,
} from "@/lib/services/transaction.service";
import Header from "../ui/Header";
import { usePermissions } from "@/hooks/usePermissions";
import { formatDate } from "@/lib/formatDate";
import { AllTabFilters } from "./all-tab-filters";
import { ManualTabFilters } from "./manual-tab-filters";
import { FiatTabFilters } from "./fiat-tab-filters";
import { CryptoTabFilters } from "./crypto-tab-filters";
import { TransactionRecord } from "@/lib/types/transaction-types";
import { TierBadge } from "./tier-badge";
import { StatusBadge } from "./badge";
import Image from "next/image";
import { tierImages } from "@/lib/utils/tier-images";
import { TransactionDetailSidebar } from "./transaction-detail-sidebar";

const TRANSACTION_TYPES = [
  "USDT-NGN",
  "NGN-ETH",
  "BTC-NGN",
  "ETH-NGN",
  "NGN-USDT",
  "NGN-BTC",
];

// Same currency set used elsewhere for manual transactions (crypto-step-two.tsx).
const TRANSACTION_CURRENCIES = ["USDT", "BTC", "ETH", "NGN"];

// UI filter labels -> backend enum values.
const STATUS_MAP: Record<string, string | undefined> = {
  All: undefined,
  Successful: "COMPLETED",
  Pending: "PENDING",
  Failed: "FAILED",
};

const TYPE_MAP: Record<string, string | undefined> = {
  All: undefined,
  Deposit: "DEPOSIT",
  Withdrawal: "WITHDRAWAL",
};

const fmtShort = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "Any";

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
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [detailTransactionId, setDetailTransactionId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const { hasPermission } = usePermissions();

  const {
    data: allTransactions,
    isPending: isPendingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
    refetch,
  } = useGetAllTransactions({
    page,
    limit: 10,
    status: STATUS_MAP[statusFilter],
    category: CATEGORY_MAP[activeFilter],
    type: TYPE_MAP[transactionTypeFilter],
    currency: currencyFilter || undefined,
    startDate: dateFrom || undefined,
    endDate: dateTo || undefined,
    search: searchQuery || undefined,
  });

  const dateLabel =
    dateFrom || dateTo
      ? `${fmtShort(dateFrom)} – ${fmtShort(dateTo)}`
      : "Date From – Date To";

  const exportTransactions = useExportTransactions();

  const transactions: TransactionRecord[] = allTransactions?.data?.items ?? [];
  const meta = allTransactions?.data?.meta;
  console.log("meta:", meta);

  console.log(allTransactions, transactions);

  const handleTabChange = (tab: string) => {
    setActiveFilter(tab.toLowerCase() as ActiveTab);
    setSearchQuery("");
    setStatusFilter("");
    setSourceFilter("");
    setTransactionTypeFilter("");
    setCurrencyFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };
  const baseColumns = [
    {
      key: "reference",
      header: "Txn ID",
      className: "md:w-[230px]",
      render: (item: TransactionRecord) => (
        <span
          className="text-text-teal font-500 text-[14px] leading-[16px] truncate block"
          title={item.reference}
        >
          {item.reference}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="font-500 text-[14px] leading-[18px] text-[#111827]">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <div className="text-text-teal text-sm font-medium leading-5 hover:underline block">
          {item?.customer?.firstName} {item?.customer?.lastName}
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
      render: (item: TransactionRecord) => {
        const tier = item.customer.kycTier ?? 0;

        return (
          <Image
            src={tierImages[tier] || "/Tier0.svg"}
            alt={`Tier ${tier}`}
            width={67}
            height={24}
          />
        );
      },
    },
    {
      key: "details",
      header: "Details",
      className: "md:w-[230px]",
      render: (item: TransactionRecord) => (
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#111827]">
            {item.displayType}
          </span>
          <span className="text-[10px] text-gray-400">{item.note}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => (
        <span className="text-[14px] font-medium text-[#111827] leading-[18px]">
          {item.currency} {moneyFmt(item.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => <StatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <div
          onClick={() => setDetailTransactionId(item.id)}
          className="text-text-teal flex items-center gap-2 font-[500] text-[14px] leading-[22px] cursor-pointer"
        >
          <Eye size={16} />
          view
        </div>
      ),
    },
  ];

  const fiatColumns = [
    ...baseColumns,
    {
      key: "type",
      header: "Type",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => (
        <span className="capitalize">{item.type?.toLowerCase()}</span>
      ),
    },
    {
      key: "direction",
      header: "Direction",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => {
        const credit = item.type === "DEPOSIT";
        return (
          <span className={`font-medium`}>{credit ? "Credit" : "Debit"}</span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs font-medium text-gray-800">
          {item.currency} {moneyFmt(item.amount)}
        </span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.deliveryMethod ?? "—"}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.partner ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => <StatusBadge status={item.status} />,
    },
    {
      key: "",
      header: "",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <div
          onClick={() => setDetailTransactionId(item.id)}
          className="text-text-teal flex items-center gap-2 font-[500] text-[14px] leading-[22px] cursor-pointer"
        >
          <Eye size={16} />
          view
        </div>
      ),
    },
  ];

  const cryptoColumns = [
    ...baseColumns,
    {
      key: "kycTier",
      header: "Tier Level",
      className: "md:w-[100px]",
      render: (item: TransactionRecord) => {
        const tier = item.customer.kycTier ?? 0;

        return (
          <Image
            src={tierImages[tier] || "/Tier0.svg"}
            alt={`Tier ${tier}`}
            width={67}
            height={24}
          />
        );
      },
    },
    {
      key: "type",
      header: "Type",
      className: "md:w-[160px]",
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
          {item.tradeDetails?.sourceCurrency}-
          {item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "customer_pays",
      header: "Customer Pays",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.sourceAmount)}{" "}
          {item.tradeDetails?.sourceCurrency}
        </span>
      ),
    },
    {
      key: "customer_receives",
      header: "Customer Receives",
      className: "md:w-[160px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.payoutAmount)}{" "}
          {item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[150px]",
      render: (item: TransactionRecord) => <StatusBadge status={item.status} />,
    },
    {
      key: "",
      header: "",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <div
          onClick={() => setDetailTransactionId(item.id)}
          className="text-text-teal flex items-center gap-2 font-[500] text-[14px] leading-[22px] cursor-pointer"
        >
          <Eye size={16} />
          view
        </div>
      ),
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
          {item.tradeDetails?.sourceCurrency}-
          {item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "customer_pays",
      header: "Customer Pays",
      className: "md:w-[130px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.sourceAmount)}{" "}
          {item.tradeDetails?.sourceCurrency}
        </span>
      ),
    },
    {
      key: "customer_receives",
      header: "Customer Receives",
      className: "md:w-[140px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-800">
          {moneyFmt(item.tradeDetails?.payoutAmount)}{" "}
          {item.tradeDetails?.targetCurrency}
        </span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.channelOrigin ?? "—"}
        </span>
      ),
    },
    {
      key: "partner",
      header: "Partner",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.channelOrigin ?? "—"}
        </span>
      ),
    },
    {
      key: "margin",
      header: "Margin",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.channelOrigin ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.channelOrigin ?? "—"}
        </span>
      ),
    },
    {
      key: "",
      header: "",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span
          onClick={() => setDetailTransactionId(item.id)}
          className="text-text-teal flex items-center gap-2 font-[500] text-[14px] leading-[22px] cursor-pointer"
        >
          <Eye size={16} />
          View
        </span>
      ),
    },
  ];

  const activeColumns =
    activeFilter === "fiat"
      ? fiatColumns
      : activeFilter === "crypto"
        ? cryptoColumns
        : activeFilter === "manual"
          ? manualColumns
          : allColumns;

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Header text="Transaction Management" />

        <div className="flex gap-3">
          {hasPermission("transactions:export") && (
            <Button
              size="sm"
              variant="outline"
              className="text-[#111827] py-2 px-3"
              onClick={() =>
                exportTransactions.mutate({
                  status: STATUS_MAP[statusFilter],
                  category: CATEGORY_MAP[activeFilter],
                  type: TYPE_MAP[transactionTypeFilter],
                  currency: currencyFilter || undefined,
                  startDate: dateFrom || undefined,
                  endDate: dateTo || undefined,
                  search: searchQuery || undefined,
                })
              }
              disabled={exportTransactions.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              {exportTransactions.isPending ? "Exporting..." : "Export"}
            </Button>
          )}
          {hasPermission("transactions:create") && (
            <Button
              size="sm"
              className="text-white py-2 px-3"
              onClick={onNewTransaction}
            >
              Log Manual Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="md:flex items-end justify-between w-full">
        <div className="flex flex-col flex-wrap gap-2 mb-6 ">
          <FilterTabs
            filters={[
              "All",
              "Fiat",
              "Crypto",
              "Manual",
              // "Gift Cards",
              // "Bill Payments",
            ]}
            value={activeFilter}
            onChange={handleTabChange}
          />
          <div className="flex items-center justify-between w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:flex-row gap-3">
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

          {/* Currency filter — applies across every tab */}
          <SelectFieldLayout
            id="currencyFilter"
            options={["All", ...TRANSACTION_CURRENCIES]}
            placeholder="Currency: All"
            value={currencyFilter || "All"}
            onChange={(v) => setCurrencyFilter(v === "All" ? "" : v)}
            className="w-36"
            selectClassName="border border-gray-300"
          />

          {/* Date range — applies across every tab */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateOpen((o) => !o)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-[14px] text-[#374151] hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              {dateLabel}
            </button>
            {dateOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDateOpen(false)}
                />
                <div className="absolute right-0 top-12 z-20 w-[260px] space-y-3 rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-lg">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">
                      From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      max={dateTo || undefined}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] px-2 py-1.5 text-sm outline-none focus:border-[#2DD4BF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">
                      To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] px-2 py-1.5 text-sm outline-none focus:border-[#2DD4BF]"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                      }}
                      className="text-[12px] text-gray-500 hover:underline"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setDateOpen(false)}
                      className="text-[12px] font-medium text-abstractCyan hover:underline"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full md:max-w-[700px] lg:min-w-[100%] xl:min-w-full min-h-screen">
        <DataTableLayout
          data={transactions}
          columns={activeColumns}
          rowKey={(item) => item.id}
          isError={isErrorTransactions}
          isLoading={isPendingTransactions}
          emptyMessage="No transactions found."
          errorMessage={errorTransactions?.message ?? "Failed to load customers"}
          totalCount={meta?.totalItems}
          itemsPerPage={meta?.itemsPerPage}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
      <TransactionDetailSidebar
        transactionId={detailTransactionId}
        onClose={() => setDetailTransactionId(null)}
      />
    </div>
  );
}
