"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { PayoutDetailsSidebar } from "@/components/finance/payout-details-sidebar";
import { ConfirmPayoutSidebar } from "@/components/finance/confirm-payout-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Filter, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SelectFieldLayout } from "@/components/layout/SelectFieldLayout";

export interface PayoutData {
  id: string;
  requestId: string;
  affiliate: string;
  affiliateHandle: string;
  amount: number;
  designatedBank: string;
  status: "pending" | "completed" | "declined";
  requestedDate: string;
  reviewer: string;
  commissionRate: number;
  walletBalance: number;
  paymentMethod: string;
  bankDetails: string;
  note?: string;
}

// Mock data - replace with real API calls
const MOCK_PAYOUTS: PayoutData[] = [
  {
    id: "1",
    requestId: "PAYT-0122",
    affiliate: "Joseph Eyebiakin",
    affiliateHandle: "@AilenRoar",
    amount: 450000,
    designatedBank: "GTBank",
    status: "pending",
    requestedDate: "21 Sep 2025",
    reviewer: "Accountant Name",
    commissionRate: 2.5,
    walletBalance: 500000,
    paymentMethod: "Bank Transfer",
    bankDetails: "DTB - 0122223445",
    note: "Need urgent processing for client payment due tomorrow",
  },
  {
    id: "2",
    requestId: "PAYT-0123",
    affiliate: "Amarachi",
    affiliateHandle: "@SolanArksy",
    amount: 155000,
    designatedBank: "Kuda",
    status: "pending",
    requestedDate: "21 Sep 2025",
    reviewer: "Accountant Name",
    commissionRate: 2.5,
    walletBalance: 500000,
    paymentMethod: "Bank Transfer",
    bankDetails: "DTB - 0122223445",
  },
  {
    id: "3",
    requestId: "PAYT-0124",
    affiliate: "TaylorGuest",
    affiliateHandle: "@TaylorGuest",
    amount: 160000,
    designatedBank: "Kuda",
    status: "pending",
    requestedDate: "21 Sep 2025",
    reviewer: "Accountant Name",
    commissionRate: 2.5,
    walletBalance: 500000,
    paymentMethod: "Bank Transfer",
    bankDetails: "DTB - 0122223445",
  },
  {
    id: "4",
    requestId: "PAYT-0125",
    affiliate: "OrganBlaze",
    affiliateHandle: "@OrganBlaze",
    amount: 165000,
    designatedBank: "GTBank",
    status: "declined",
    requestedDate: "23 Sep 2025",
    reviewer: "Accountant Name",
    commissionRate: 2.5,
    walletBalance: 500000,
    paymentMethod: "Bank Transfer",
    bankDetails: "DTB - 0122223445",
  },
];

const filterOptions = ["all", "Date Submitted"];

export default function FinancePage() {
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payouts, setPayouts] = useState<PayoutData[]>(MOCK_PAYOUTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const filteredData = payouts.filter((item: PayoutData) => {
    const matchesSearch =
      item.affiliate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.affiliateHandle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeFilter === "all" ||
      item.status?.toLowerCase() === activeFilter.toLowerCase();

    const matchesTransactionType =
      transactionTypeFilter === "all" ||
      item.requestedDate?.toLowerCase() === transactionTypeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesTransactionType;
  });

  const handleSelectPayout = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setIsDetailsOpen(true);
  };

  const handleDeclinePayout = () => {
    if (selectedPayout) {
      setPayouts(
        payouts.map((p) =>
          p.id === selectedPayout.id ? { ...p, status: "declined" as const } : p
        )
      );
      setIsDetailsOpen(false);
      setSelectedPayout(null);
    }
  };

  const handleProcessPayout = () => {
    setIsDetailsOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmPayout = () => {
    if (selectedPayout) {
      setPayouts(
        payouts.map((p) =>
          p.id === selectedPayout.id
            ? { ...p, status: "completed" as const }
            : p
        )
      );
      setIsConfirmOpen(false);
      setSelectedPayout(null);
    }
  };

  const columns = [
    { key: "requestId", header: "Request ID" },
    { key: "affiliate", header: "Affiliate" },
    // { key: "affiliateHandle", header: "Handle" },
    {
      key: "amount",
      header: "Amount (₦)",
      render: (item: PayoutData) => (
        <span className="font-medium text-gray-700">
          ₦{item.amount.toLocaleString()}
        </span>
      ),
    },
    { key: "designatedBank", header: "Bank" },
    {
      key: "status",
      header: "Status",
      render: (item: PayoutData) => (
        <span
          className={`capitalize px-3 py-2 rounded-[36px] text-xs font-medium ${
            item.status === "completed"
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
    { key: "requestedDate", header: "Requested Date" },
    { key: "requestedDate", header: "Reviewer" },
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
          <Button size="sm" variant={"outline"}><Upload />Export</Button>
        </div>

        <div className="flex items-center justify-between mb-[24px]">
          <div className="flex gap-1">
            {["All", "Pending", "Completed", "Declined"].map((filter) => (
              <Button
                key={filter}
                variant={
                  activeFilter === filter.toLowerCase() ? "default" : "ghost"
                }
                size="sm"
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={
                  activeFilter === filter.toLowerCase()
                    ? "bg-[#68F4E3] border border-[#68F4E3] text-[#111827] p-2 font-[500] text-[14px] leading-[18px]"
                    : "font-[500] text-[14px] leading-[18px] text-[#111827] p-2"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-[10px] px-[12px] pl-10 w-64"
              />
            </div>

            <SelectFieldLayout
              id="date"
              selectClassName="h-10 py-[8px]"
              options={filterOptions}
              placeholder="Transaction Type"
              onChange={setTransactionTypeFilter}
            />

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced filter
            </Button>
          </div>
        </div>
        <DataTableLayout
          data={filteredData}
          columns={columns}
          rowKey={(item) => item.id}
          itemsPerPage={5}
          emptyMessage="No payout requests available."
        />

        {selectedPayout && (
          <PayoutDetailsSidebar
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            payout={selectedPayout}
            onDecline={handleDeclinePayout}
            onProcess={handleProcessPayout}
          />
        )}

        {selectedPayout && (
          <ConfirmPayoutSidebar
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            payout={selectedPayout}
            onConfirm={handleConfirmPayout}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
