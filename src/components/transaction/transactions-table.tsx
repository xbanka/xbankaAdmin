"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Search, Upload } from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { FilterTabs } from "../ui/FilterTabs";
import { TransactionsTableProps } from "@/lib/types/transactionTypes";
import {
  useGetAllTransactions,
  useTransactions,
} from "@/lib/services/transaction.service";
import Header from "../ui/Header";
import {
  hasPermission,
  normalizePermissionsFromApi,
} from "@/lib/rolePermissions";
import { formatDate } from "@/lib/formatDate";
import { AllTabFilters } from "./all-tab-filters";
import { ManualTabFilters } from "./manual-tab-filters";
import { FiatTabFilters } from "./fiat-tab-filters";
import { CryptoTabFilters } from "./crypto-tab-filters";
import { TransactionRecord } from "@/lib/types/transaction-types";
import { TierBadge } from "./tier-badge";
import { StatusBadge } from "./badge";
import { useProfile } from "@/lib/services/profile.service";
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
  const [searchInput, setSearchInput] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("");
  const [detailTransactionId, setDetailTransactionId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const {
    data: userData,
    isPending: isPendingData,
    error: errorData,
  } = useProfile();
  const apiPermissionSet = normalizePermissionsFromApi(
    userData?.data.role.allowed_permissions ?? [],
  );

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

  // const transactions = transactionData?.data?.data ?? [];
  const transactionsBody = transactionData?.data;
  const transactions: TransactionRecord[] = allTransactions?.data?.items ?? [];
  const meta = allTransactions?.meta;
  console.log(allTransactions, transactions);

  const handleTabChange = (tab: string) => {
    setActiveFilter(tab.toLowerCase() as ActiveTab);
    setSearchQuery("");
    setStatusFilter("");
    setSourceFilter("");
    setTransactionTypeFilter("");
    setPage(1);
  };
  const baseColumns = [
    {
      key: "reference",
      header: "Txn ID",
      className: "md:w-[140px]",
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
      className: "md:w-[110px]",
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
        // <div className="cursor-pointer">
        //   <span className="text-[var(--text-teal)] text-sm font-medium hover:underline block">
        //     {item.customer?.firstName} {item.customer?.lastName}
        //   </span>
        //   <span className="text-xs text-gray-500">{item.customer?.email}</span>
        // </div>
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
      className: "md:w-[200px]",
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
      className: "md:w-[120px]",
      render: (item: TransactionRecord) => (
        <span className="text-[14px] font-medium text-[#111827] leading-[18px]">
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
    {
      key: "action",
      header: "",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <div
          onClick={() => setDetailTransactionId(item.id)}
          className="text-text-teal flex items-center gap-2 font-[500] text-[14px] leading-[22px] cursor-pointer"
        >
          <Eye size={16} />
          view more
        </div>
      ),
    },
  ];

  const fiatColumns = [
    ...baseColumns,
    {
      key: "type",
      header: "Type",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="capitalize">{item.type?.toLowerCase()}</span>
      ),
    },
    {
      key: "direction",
      header: "Direction",
      className: "md:w-[90px]",
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
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.deliveryMethod ?? "—"}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      className: "md:w-[110px]",
      render: (item: TransactionRecord) => (
        <span className="text-xs text-gray-600">
          {item.tradeDetails?.partner ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "md:w-[110px]",
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
          view more
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
      key: "status",
      header: "Status",
      className: "md:w-[110px]",
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
          view more
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
          View more
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
      <div className="md:flex items-end justify-between w-full">
        <div className="flex flex-col flex-wrap gap-2 mb-6 ">
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
        <div className="flex flex-col items-center md:flex-row gap-3">
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
          {/* <SelectFieldLayout
                id="statusFilter"
                options={["COMPLETED", "PENDING", "FAILED", "PROCESSING"]}
                placeholder="Status: All"
                value={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
                className="w-40"
                selectClassName="border border-gray-300"
              /> */}
        </div>
      </div>
      <div className="w-full md:max-w-[700px] lg:min-w-[100%] xl:min-w-full min-h-screen">
        <DataTableLayout
          data={transactions}
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
      <TransactionDetailSidebar
        transactionId={detailTransactionId}
        onClose={() => setDetailTransactionId(null)}
      />
    </div>
  );
}
