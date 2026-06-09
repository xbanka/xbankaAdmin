"use client";

import { Bell, Calendar, ChevronDown, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";
import { CreateSpreadWizard } from "./create-spread-wizard";
import { EditSpreadModal } from "./edit-spread-modal";
import { Button } from "../ui/button";
import { MOCK_DATA, NAV_ITEMS } from "./mock";
import { cn } from "@/lib/utils";
import { SpreadRow } from "./types";
import { useState } from "react";

export default function RateManagement() {
  const [activeTab, setActiveTab] = useState<"schedule" | "history">("schedule");
  const [editRow, setEditRow] = useState<SpreadRow | null>(null);
  const [showWizard, setShowWizard] = useState(false);
 
  const columns = [
    {
      key: "asset",
      header: "Asset",
      render: (row: SpreadRow) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: row.color }}
          >
            {row.initial}
          </div>
          <div>
            <div className="font-semibold text-[13px] text-[#111827]">{row.asset}</div>
            <div className="text-[11px] text-[#9CA3AF]">{row.symbol}</div>
          </div>
        </div>
      ),
    },
    { key: "buySpread", header: "Buy Spread" },
    { key: "sellSpread", header: "Sell Spread" },
    {
      key: "status",
      header: "Status",
      render: (row: SpreadRow) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium",
            row.status === "Active" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F3F4F6] text-[#6B7280]"
          )}
        >
          <span
            className={cn("w-1.5 h-1.5 rounded-full", row.status === "Active" ? "bg-[#059669]" : "bg-[#9CA3AF]")}
          />
          {row.status}
        </span>
      ),
    },
    {
      key: "requestedAt",
      header: "Requested Date",
      render: (row: SpreadRow) => (
        <div>
          <div className="text-[12px] text-[#111827]">{row.requestedBy}</div>
          <div className="text-[11px] text-[#9CA3AF]">{row.requestedAt}</div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (row: SpreadRow) => (
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
    <div className="flex min-h-screen bg-[#F9FAFB]">
    
      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#E5E7EB]">
          <h1 className="text-[16px] font-semibold text-[#111827]">Rate Management</h1>
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-[#6B7280]" />
            <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-[12px] font-semibold">
              JE
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#111827]">Joseph Eyebiokin</div>
              <div className="text-[11px] text-[#9CA3AF]">Admin</div>
            </div>
            <ChevronDown size={16} className="text-[#9CA3AF]" />
          </div>
        </header>
 
        {/* Content */}
        <main className="flex-1 px-6 py-5">
          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] mb-5">
            {(["schedule", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors",
                  activeTab === tab
                    ? "text-[#0D9488] border-[#0D9488]"
                    : "text-[#6B7280] border-transparent hover:text-[#111827]"
                )}
              >
                {tab === "schedule" ? "Spread Schedule" : "Spread History"}
              </button>
            ))}
          </div>
 
          {/* Toolbar */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#9CA3AF] bg-white w-44">
              <Search size={14} /> Search
            </div>
            <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
              <Calendar size={14} /> Date Submitted
            </button>
            <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
              <SlidersHorizontal size={14} /> Advanced filter
            </button>
            <Button className="ml-auto" onClick={() => setShowWizard(true)}>
              <Plus size={14} /> Add Spread
            </Button>
          </div>
 
          <DataTableLayout
            data={MOCK_DATA}
            columns={columns}
            rowKey={(row) => row.id}
            itemsPerPage={10}
            totalCount={300}
            emptyMessage="No spreads configured yet."
          />
        </main>
      </div>
 
      {/* Edit Modal */}
      {editRow && (
        <EditSpreadModal
          asset={editRow.asset}
          symbol={editRow.symbol}
          color={editRow.color}
          initial={editRow.initial}
          defaultBuySpread={parseFloat(editRow.buySpread) || 2.5}
          defaultSellSpread={parseFloat(editRow.sellSpread) || 1.5}
          onClose={() => setEditRow(null)}
          onSave={(buy, sell) => {
            console.log("Saved:", buy, sell);
            setEditRow(null);
          }}
        />
      )}
 
      {/* Create Wizard */}
      {showWizard && <CreateSpreadWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}