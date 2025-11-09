"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { PayoutDetailsSidebar } from "@/components/finance/payout-details-sidebar";
import { ConfirmPayoutSidebar } from "@/components/finance/confirm-payout-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

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

export default function FinancePage() {
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payouts, setPayouts] = useState<PayoutData[]>(MOCK_PAYOUTS);

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
          className={`capitalize px-2 py-1 rounded text-xs font-medium ${
            item.status === "completed"
              ? "bg-green-100 text-green-700"
              : item.status === "declined"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    { key: "requestedDate", header: "Requested Date" },
    {
      key: "actions",
      header: "Actions",
      render: (item: PayoutData) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSelectPayout(item)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout
      isPending={false}
      // error={""}
      title="Finance Overview"
      breadcrumbs={[{ label: "Finance" }]}
    >
      <DataTableLayout
        data={payouts}
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
    </DashboardLayout>
  );
}
