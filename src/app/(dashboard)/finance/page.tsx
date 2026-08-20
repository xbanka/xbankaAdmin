"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getPayouts } from "@/lib/actions/notificationsActions";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { PayoutData } from "@/lib/types";
import Header from "@/components/ui/Header";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { getStatusStyles } from "@/lib/utils/statusStyles";
import { SelectFieldLayout } from "@/components/forms/SelectFieldLayout";
import { formatDate } from "@/lib/formatDate";
import { usePermissions } from "@/hooks/usePermissions";

export default function FinancePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedDateRange, setSelectedDateRange] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["payouts", page, activeFilter],
    queryFn: () =>
      getPayouts({
        page,
        limit: 10,
        status: activeFilter === "all" ? undefined : activeFilter,
      }),
  });

  const { openDetailsSidebar } = usePayoutSidebarStore();
  const { hasPermission } = usePermissions();

  const uniqueDates = Array.from(
    new Set(
      (data?.data || []).map((item: PayoutData) => formatDate(item.paid_at)),
    ),
  );

  const handleSelectPayout = (payout: PayoutData) => {
    openDetailsSidebar(payout.id);
  };

  const filteredData =
    data?.data?.filter((item: PayoutData) => {
      const matchesSearch =
        item?.affiliate?.username?.includes(searchQuery.toLowerCase()) ||
        item?.affiliate?.bank
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeFilter === "all" ||
        item.status?.toLowerCase() === activeFilter.toLowerCase();

      const matchesTransactionType =
        transactionTypeFilter === "all" ||
        item.status?.toLowerCase() === transactionTypeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesTransactionType;
    }) || [];

  const columns = [
    { key: "payment_ref", header: "Request ID" },
    {
      key: "affiliate",
      header: "Affiliate",
      render: (item: PayoutData) => (
        <span className="font-medium">{item.affiliate.username}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount (₦)",
      render: (item: PayoutData) => (
        <span className="font-medium text-gray-700">
          ₦{Number(item.amount).toLocaleString()}
        </span>
      ),
    },
    {
      key: "bank",
      header: "Designated Bank",
      render: (item: PayoutData) => <span>{item.affiliate.bank}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item: PayoutData) => (
        <span
          className={`capitalize px-3 py-2 rounded-[36px] text-xs font-medium ${getStatusStyles(
            item.status,
          )}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "requestedDate",
      header: "Requested Date",
      render: (item: PayoutData) => <span>{formatDate(item.paid_at)}</span>,
    },
    // { key: "requestedDate", header: "Reviewer" },
    {
      key: "actions",
      header: "Actions",
      render: (item: PayoutData) => (
        <div
          className="underline cursor-pointer"
          onClick={() => handleSelectPayout(item)}
        >
          View Details
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      isPending={false}
      // error={""}
      breadcrumbs={[{ label: "Finance" }]}
    >
      <div className="w-full p-4 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-[24px]">
          <Header text="Finance Overview" />
          {hasPermission("finance:export_reports") && (
            <Button className="text-[#111827]" size="sm" variant={"outline"}>
              <Upload />
              Export
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between mb-[24px]">
          <FilterTabs
            filters={["All", "Pending", "Paid", "Rejected"]}
            value={activeFilter}
            onChange={setActiveFilter}
          />
          <div className="flex flex-col md:flex-row w-full items.center md:justify-end items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-[10px] px-[12px] pl-10 w-full md:w-64"
              />
            </div>
            <SelectFieldLayout
              id="dateCreated"
              options={uniqueDates as string[]}
              placeholder="Select date"
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              className="w-full md:w-48"
              selectClassName="border border-gray-300"
            />
          </div>
        </div>
        <DataTableLayout
          data={filteredData}
          columns={columns}
          isError={isError}
          isLoading={isPending}
          errorMessage={error?.message}
          rowKey={(item) => item.id}
          itemsPerPage={10}
          totalCount={data?.total}
          currentPage={page}
          onPageChange={setPage}
          emptyMessage="No payout requests available."
        />
      </div>
    </DashboardLayout>
  );
}
