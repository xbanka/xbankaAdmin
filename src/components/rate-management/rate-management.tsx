"use client";

import {
  Calendar,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { CreateSpreadWizard } from "./create-spread-wizard";
import { EditSpreadModal } from "./edit-spread-modal";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DashboardLayout } from "../layout/dashboard-layout";
import { EmptySpreadSchedule } from "./empty-spread-schedule";
import { useGetAllSegments, useGetCryptoRates } from "@/lib/services/rates.service";
import { CryptoCurrencyTypes } from "@/lib/types/rates-types";
import { formatDate } from "@/lib/formatDate";

export default function RateManagement() {
  const [activeTab, setActiveTab] = useState<"schedule" | "history">(
    "schedule",
  );
  const [editRow, setEditRow] = useState<CryptoCurrencyTypes | null>(null);
  const [view, setView] = useState<"list" | "wizard">("list");
  const { data, isPending, error} = useGetCryptoRates()
  const { data: segmentData, isPending: isPendingSegment, error: errorSegment} = useGetAllSegments()
  console.log(segmentData)
  console.log("rates", data)
  const ratesData = data?.data
  console.log(ratesData)
  const emptyData: any[] = [];

  const columns = [
    {
      key: "asset",
      header: "Asset",
      render: (row: CryptoCurrencyTypes) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/50 text-[11px] font-bold flex-shrink-0"
            // style={{ background: row.color }}
          >
          </div>
          <div>
            <div className="font-semibold text-[13px] text-[#111827]">
              {row.name}
            </div>
            <div className="text-[11px] text-[#9CA3AF]">{row.currency}</div>
          </div>
        </div>
      ),
    },
    { key: "Segment", header: "Segment" },
    { key: "buyFeeValue", header: "Buy Spread" },
    { key: "sellFeeValue", header: "Sell Spread" },
    {
      key: "status",
      header: "Status",
      render: (row: CryptoCurrencyTypes) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium",
            row.isActive === true
              ? "bg-[#ECFDF5] text-[#059669]"
              : "bg-[#F3F4F6] text-[#6B7280]",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              row.isActive === true ? "bg-[#059669]" : "bg-[#9CA3AF]",
            )}
          />
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "requestedAt",
      header: "Requested Date",
      render: (row: CryptoCurrencyTypes) => (
        <div>
          <div className="text-[12px] text-[#111827]">{formatDate(row?.updatedAt)}</div>
          <div className="text-[11px] text-[#9CA3AF]">{formatDate(row?.updatedAt)}</div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (row: CryptoCurrencyTypes) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditRow(row)}
            className="flex items-center gap-1 text-[12px] text-[#0D9488] font-medium hover:opacity-70 transition-opacity"
          >
            <Pencil size={13} /> Edit
          </button>
          <span className="text-[#E5E7EB] text-[12px]">|</span>
          <button className="flex items-center gap-1 text-[12px] text-[#EF4444] font-medium hover:opacity-70 transition-opacity">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      isPending={false}
      // error={""}
      breadcrumbs={[{ label: "Rate Management" }]}
      title="Rate Management"
    >
      <div className="flex min-h-screen bg-card-primary">
        {/* Main */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}

          {/* Content */}
          {view === "list" ? (
            ratesData?.length === 0 ? (
              <EmptySpreadSchedule onClick={() => setView("wizard")} />
            ) : (
              <main className="flex-1 px-8">
                {/* Tabs */}
                <div className="flex justify-between items-center border-b border-card-border-secondary w-full mb-8">
                  <div className="flex">
                    {(["schedule", "history"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-4 py-4.5 text-[14px] font-medium border-b-2 -mb-px transition-colors cursor-pointer",
                          activeTab === tab
                            ? "text-text-primary border-[#0D9488]"
                            : "text-text-secondary border-transparent hover:text-text-primary",
                        )}
                      >
                        {tab === "schedule"
                          ? "Spread Schedule"
                          : "Spread History"}
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setView("wizard")}>Add Spread</Button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#9CA3AF] bg-white w-44">
                    <Search size={14} /> Search
                  </div>
                  <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
                    <Calendar size={14} /> Date Submitted
                  </button>
                  <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
                    <SlidersHorizontal size={14} /> Advanced filter
                  </button>
                </div>

                <DataTableLayout
                  data={ratesData}
                  columns={columns}
                  rowKey={(row) => row.id}
                  itemsPerPage={10}
                  totalCount={ratesData?.length}
                  emptyMessage="No spreads configured yet."
                />
              </main>
            )
          ) : (
            <CreateSpreadWizard onClose={() => setView("list")} />
          )}
        </div>

        {/* Edit Modal */}
        {editRow && (
          <EditSpreadModal
            asset={editRow.name}
            symbol={editRow.currency}
            // initial={editRow.initial}
            defaultBuySpread={editRow?.buyFeeValue}
            defaultSellSpread={editRow.sellFeeValue}
            onClose={() => setEditRow(null)}
            onSave={(buy, sell) => {
              console.log("Saved:", buy, sell);
              setEditRow(null);
            }}
          />
        )}

        {/* Create Wizard */}
      </div>
    </DashboardLayout>
  );
}
