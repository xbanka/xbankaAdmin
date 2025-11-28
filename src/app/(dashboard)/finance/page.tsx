"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { PayoutDetailsSidebar } from "@/components/finance/payout-details-sidebar";
import { ConfirmPayoutSidebar } from "@/components/finance/confirm-payout-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Filter, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SelectFieldLayout } from "@/components/layout/SelectFieldLayout";
import { useQuery } from "@tanstack/react-query";
import { getPayouts } from "@/lib/actions/notificationsActions";
import { useIndividualPayout, useProcessPayout } from "@/hooks/usePayout";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { DialogLayout } from "@/components/layout/modalLayout";

export interface PayoutData {
  id: string;
  amount: string;
  status: string;
  payment_ref: string;
  paid_at: string;
  affiliate: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_no: string;
    bank: string;
    account_no: string;
    ref_code: string;
    custom_refcode: string;
    created_at: string;
  };
}

const filterOptions = ["all", "Date Submitted"];

export default function FinancePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openModal, setOpenModal] = useState(false);

  const {
    isDetailsOpen,
    payout,
    isConfirmOpen,
    openDetailsSidebar,
    openConfirmSidebar,
    closeDetailsSidebar,
    closeConfirmSidebar,
    selectedPayoutId,
  } = usePayoutSidebarStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["payouts", page, activeFilter],
    queryFn: () =>
      getPayouts({
        page,
        limit: 10,
        status: activeFilter === "all" ? undefined : activeFilter,
      }),
  });

  const {
    data: individualPayout,
    isPending: individualPayoutPending,
    error: individualPayoutError,
  } = useIndividualPayout(selectedPayoutId ?? null);
  const { mutate: processPayoutMutation, isPending: processingPayout } =
    useProcessPayout();

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

  const handleSelectPayout = (payout: PayoutData) => {
    openDetailsSidebar(payout);
  };

  const handleDeclinePayout = () => {
    closeDetailsSidebar();
  };

  const handleProcessPayout = () => {
    closeDetailsSidebar();
    if (payout) {
      openConfirmSidebar(payout);
    }
  };

  const handleConfirmPayout = () => {
    setOpenModal(true);
  };

  const handlePayout = () => {
    console.log("clicked", payout);
    if (!payout) return;

    processPayoutMutation(payout.id, {
      onSuccess: () => {
        setOpenModal(false);
        closeConfirmSidebar();
        closeDetailsSidebar();
      },
    });
  };

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
          className={`capitalize px-3 py-2 rounded-[36px] text-xs font-medium ${
            item.status === "paid"
              ? "bg-[#D1FAE5] text-[#37703F]"
              : item.status === "declined"
              ? "bg-[#FCE6E6] text-[#EF4444]"
              : "bg-[#FFF8D8] text-[#B29504]"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "requestedDate",
      header: "Requested Date",
      render: (item: PayoutData) => (
        <span>{new Date(item.paid_at).toLocaleDateString()}</span>
      ),
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
      title="Finance"
      breadcrumbs={[{ label: "Finance" }]}
    >
      <div>
        <div className="flex items-center justify-between mb-[24px]">
          <h1 className="text-[18px] font-[600] leading-[22px] text-[#111827]">
            Finance Overview
          </h1>
          <Button size="sm" variant={"outline"}>
            <Upload />
            Export
          </Button>
        </div>

        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between mb-[24px]">
          <div className="flex justify-center md:justify-start gap-1">
            {["All", "Pending", "Paid", "Declined"].map((filter) => (
              <Button
                key={filter}
                variant={
                  activeFilter === filter.toLowerCase() ? "default" : "ghost"
                }
                size="sm"
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={
                  activeFilter === filter.toLowerCase()
                    ? "bg-abstractCyan border border-abstractCyan text-[#111827] p-2 font-[500] text-[14px] leading-[18px]"
                    : "font-[500] text-[14px] leading-[18px] text-[#111827] p-2"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row w-full md:justify-end items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-[10px] px-[12px] pl-10 w-full md:w-64"
              />
            </div>

            {/* <SelectFieldLayout
              id="date"
              selectClassName="h-10 py-[8px]"
              options={filterOptions}
              placeholder="Transaction Type"
              onChange={setTransactionTypeFilter}
            /> */}

            {/* <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced filter
            </Button> */}
          </div>
        </div>
        <DataTableLayout
          data={filteredData}
          columns={columns}
          isError={isError}
          isLoading={isPending}
          errorMessage={error?.message}
          rowKey={(item) => item.id}
          itemsPerPage={5}
          emptyMessage="No payout requests available."
        />

        {payout && (
          <PayoutDetailsSidebar
            isOpen={isDetailsOpen}
            onClose={closeDetailsSidebar}
            payout={payout}
            onDecline={handleDeclinePayout}
            onProcess={handleProcessPayout}
            loading={individualPayoutPending}
            error={individualPayoutError?.message || ""}
          />
        )}

        {payout && (
          <ConfirmPayoutSidebar
            isOpen={isConfirmOpen}
            onClose={closeConfirmSidebar}
            payout={payout}
            onConfirm={handleConfirmPayout}
            loading={false}
            error={""}
          />
        )}

        <DialogLayout
          open={openModal}
          onClose={() => setOpenModal(!openModal)}
          title="Process Payout"
          footer={
            <div className="mt-[15px] flex gap-[20px]">
                <Button onClick={() => setOpenModal(!openModal)} variant="outline">Cancel</Button>

              <Button variant="default" onClick={handlePayout}>
                {processingPayout ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          }
        >
            <h1>Are you sure you want to confirm payout</h1>
        </DialogLayout>
      </div>
    </DashboardLayout>
  );
}
