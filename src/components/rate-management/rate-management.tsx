"use client";

import {
  Calendar,
  Edit,
  Eye,
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
import {
  useGetCryptoRates,
  UseGetRateLogDetails,
  UseGetRateLogs,
  UseGetRateProposals,
  useUpdateBuyAndSpreadRates,
} from "@/lib/services/rates.service";
import { CryptoCurrencyTypes } from "@/lib/types/rates-types";
import { formatDate } from "@/lib/formatDate";
import { Input } from "../ui/input";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { SEGMENT_TYPES } from "./mock";
import { Badge } from "./badge";
import { AuditLogItem, SPREAD_HISTORY_MOCK, SpreadHistoryEntry } from "./types";
import { AffectedAssetsBadge, ScopeBadge } from "./scope-badge";
import { SpreadChangeDetailsDrawer } from "./spread-change-details-change-drawer";
import { usePermissions } from "@/hooks/usePermissions";
import { fmt } from "@/lib/utils/formatNumber";
import { getXBankaRates } from "@/lib/utils/rates";

export default function RateManagement() {
  const [activeTab, setActiveTab] = useState<"schedule" | "history">(
    "schedule",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editRow, setEditRow] = useState<CryptoCurrencyTypes | null>(null);
  const [view, setView] = useState<"list" | "wizard">("list");
  const { hasPermission } = usePermissions();
  const canEditSpread =
    hasPermission("rates:propose_changes") ||
    hasPermission("rates:approve_changes") ||
    hasPermission("rates:change_override");
  const { data, isPending, error } = useGetCryptoRates();

  const {
    data: ratesLogData,
    isPending: ratesLogisPending,
    error: ratesLogError,
  } = UseGetRateLogs();
  const {
    data: rateProposalData,
    isPending: rateProposalIsPending,
    error: rateProposalError,
  } = UseGetRateProposals();
  const { mutate: updateCryptoRate } = useUpdateBuyAndSpreadRates();
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("");
  const [selectedHistoryEntry, setSelectedHistoryEntry] =
    useState<AuditLogItem | null>(null);
  const { data: rateLogDetails, isPending: rateLogDetailsPending } =
    UseGetRateLogDetails(selectedHistoryEntry?.id);
  console.log("Rate Log Details", rateLogDetails?.log);
  const historyData = ratesLogData?.logs;
  const ratesData = data?.data;

  const columns = [
    {
      key: "asset",
      header: "Asset",
      render: (row: CryptoCurrencyTypes) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/50 text-[11px] font-bold flex-shrink-0"
            // style={{ background: row.color }}
          ></div>
          <div>
            <div className="font-semibold text-[13px] text-[#111827]">
              {row.name}
            </div>
            <div className="text-[11px] text-[#9CA3AF]">{row.currency}</div>
          </div>
        </div>
      ),
    },
    {
      key: "Segment",
      header: "Segment",
      render: (row: CryptoCurrencyTypes) => (
        <div className="">{row.segment?.name}</div>
      ),
    },
    {
      key: "obiexRate",
      header: "Obiex Rate",
      render: (row: CryptoCurrencyTypes) => (
        <div className="">{fmt(row.obiexRate ?? 0)}</div>
      ),
    },
    {
      key: "buySpread",
      header: "Buy Spread",
      render: (row: CryptoCurrencyTypes) => (
        <div className="">{row.segment?.buySpread ?? 0}%</div>
      ),
    },
    {
      key: "sellSpread",
      header: "Sell Spread",
      render: (row: CryptoCurrencyTypes) => (
        <div className="">{row.segment?.sellSpread ?? 0}%</div>
      ),
    },
    {
      key: "xbankaRate",
      header: "XBanka's Rate",
      render: (row: CryptoCurrencyTypes) => {
        const { buy, sell } = getXBankaRates(row);
        return (
          <div>
            <div className="text-[12px] text-[#111827]">Buy: {fmt(buy)}</div>
            <div className="text-[11px] text-[#9CA3AF]">Sell: {fmt(sell)}</div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: CryptoCurrencyTypes) => (
        // <span
        //   className={cn(
        //     "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium",
        //     row.isActive === true
        //       ? "bg-[#ECFDF5] text-[#059669]"
        //       : "bg-[#F3F4F6] text-[#6B7280]",
        //   )}
        // >
        //   <span
        //     className={cn(
        //       "w-1.5 h-1.5 rounded-full",
        //       row.isActive === true ? "bg-[#059669]" : "bg-[#9CA3AF]",
        //     )}
        //   />
        //   {row.isActive ? "Active" : "Inactive"}
        // </span>
        <Badge
          active={row.isActive}
          text={row.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "requestedAt",
      header: "Requested Date",
      render: (row: CryptoCurrencyTypes) => (
        <div>
          <div className="text-[12px] text-[#111827]">
            {formatDate(row?.updatedAt)}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">
            {formatDate(row?.updatedAt)}
          </div>
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
            className="flex items-center gap-1 leading-[22px] text-[14px] text-text-primary-font-color font-medium hover:opacity-70 transition-opacity"
          >
            <Edit size={16} className="text-[#004C99]" /> Edit
          </button>
          {/* <span className="text-[#E5E7EB] text-[12px]">|</span>
          <button className="flex items-center gap-1 text-[12px] text-[#EF4444] font-medium hover:opacity-70 transition-opacity">
            <Trash2 size={13} /> Delete
          </button> */}
        </div>
      ),
    },
    {
      key: "toggle",
      header: "",
      render: (row: CryptoCurrencyTypes) => (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();

              updateCryptoRate({
                rateId: row.id,
                payload: {
                  isActive: !row.isActive,
                },
              });
            }}
            className={cn(
              "w-10 h-[22px] rounded-full relative transition-colors flex-shrink-0",
              row.isActive ? "bg-[#0D9488]" : "bg-[#D1D5DB]",
            )}
            role="switch"
            aria-checked={row.isActive}
          >
            <span
              className={cn(
                "absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all",
                row.isActive ? "right-[3px]" : "left-[3px]",
              )}
            />
          </button>
        </div>
      ),
    },
  ].filter((column) => {
    const restrictedColumns = ["actions", "toggle"];

    if (restrictedColumns.includes(column.key)) {
      return canEditSpread;
    }

    return true;
  });

  const historyColumns = [
    {
      key: "dateTime",
      header: "Date & Time",
      render: (row: AuditLogItem) => {
        const d = new Date(row.created_at);
        return (
          <div>
            <div className="text-[14px] font-medium leading-5 text-text-primary">
              {formatDate(row.created_at)}
            </div>
            <div className="text-[12px] font-normal leading-[18px] text-[#9CA3AF]">
              {d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    // {
    //   key: "scope",
    //   header: "Scope",
    //   className: "w-[150px]",
    //   render: (row: AuditLogItem) => <ScopeBadge scope={row.scope} />,
    // },
    {
      key: "target",
      header: "Target",
      className: "w-[130px]",
      render: (row: AuditLogItem) => (
        <div>
          <div className="text-[13px] font-medium text-[#111827]">
            {row.target}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">
            {row.target_currency}
          </div>
        </div>
      ),
    },
    {
      key: "changeType",
      header: "Change Type",
      className: "w-[150px]",
      render: (row: AuditLogItem) => (
        <div className="text-[13px] text-[#111827]">{row.change_type}</div>
      ),
    },
    {
      key: "previousConfig",
      header: "Previous Configuration",
      render: (row: AuditLogItem) => (
        <div className="text-[13px] text-[#111827]">
          Buy:{" "}
          {Number(
            row.previous_configuration
              ?.find((c: string) => c.startsWith("Buy:"))
              ?.replace("Buy:", "")
              ?.replace("%", "")
              ?.trim(),
          ) || 0}
          <br />
          Sell:{" "}
          {Number(
            row.previous_configuration
              ?.find((c: string) => c.startsWith("Sell:"))
              ?.replace("Sell:", "")
              ?.replace("%", "")
              ?.trim(),
          ) || 0}
        </div>
      ),
    },
    {
      key: "newConfig",
      header: "New Configuration",
      render: (row: AuditLogItem) => (
        <div className="text-[13px] text-[#111827]">
          Buy:{" "}
          {Number(
            row.new_configuration
              ?.find((c: string) => c.startsWith("Buy:"))
              ?.replace("Buy:", "")
              ?.replace("%", "")
              ?.trim(),
          ) || 0}
          <br />
          Sell:{" "}
          {Number(
            row.new_configuration
              ?.find((c: string) => c.startsWith("Sell:"))
              ?.replace("Sell:", "")
              ?.replace("%", "")
              ?.trim(),
          ) || 0}
        </div>
      ),
    },
    {
      key: "affectedAssetsCount",
      header: "Affected Asset",
      className: "w-[150px]",
      render: (row: AuditLogItem) => (
        <AffectedAssetsBadge count={row.affected_assets} />
      ),
    },
    {
      key: "updatedBy",
      header: "Update by",
      render: (row: AuditLogItem) => (
        <div>
          <div className="text-[12px] text-[#111827]">
            {row.requested_by.first_name + " " + row.requested_by.last_name}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">
            {row.requested_by.role}
          </div>
        </div>
      ),
    },
    {
      key: "",
      header: "",
      render: (row: AuditLogItem) => (
        <button
          onClick={() => setSelectedHistoryEntry(row)}
          className="flex items-center gap-1 text-[13px] text-[#0D9488] font-medium hover:opacity-70 transition-opacity curso"
        >
          <Eye size={14} /> View
        </button>
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
                  {canEditSpread && (
                    <Button onClick={() => setView("wizard")}>
                      <Edit />
                      Edit Spread
                    </Button>
                  )}
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="relative max-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <SelectFieldLayout
                    id="transactionType"
                    options={SEGMENT_TYPES}
                    placeholder="All segment"
                    value={selectedTransactionType}
                    onChange={setSelectedTransactionType}
                    className="w-full md:w-[180px]"
                    selectClassName="border border-gray-300"
                  />
                  <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#6B7280] bg-white">
                    <SlidersHorizontal size={14} /> Advanced filter
                  </button>
                </div>

                {activeTab === "schedule" ? (
                  <DataTableLayout
                    data={ratesData}
                    columns={columns}
                    rowKey={(row) => row.id}
                    itemsPerPage={10}
                    totalCount={ratesData?.length}
                    emptyMessage="No spreads configured yet."
                    isLoading={isPending}
                  />
                ) : (
                  <DataTableLayout
                    data={historyData}
                    columns={historyColumns}
                    rowKey={(row) => row.id}
                    itemsPerPage={10}
                    totalCount={historyData?.length}
                    emptyMessage="No spread history recorded yet."
                    isLoading={ratesLogisPending}
                    isError={!!ratesLogError}
                    errorMessage={
                      ratesLogError?.message || "Failed to load spread history."
                    }
                  />
                )}
              </main>
            )
          ) : (
            <CreateSpreadWizard onClose={() => setView("list")} />
          )}
        </div>

        {/* Edit Modal */}
        {editRow && (
          <EditSpreadModal
            spreadData={editRow}
            onClose={() => setEditRow(null)}
            onSave={(buy, sell) => {
              console.log("Saved:", buy, sell);
              setEditRow(null);
            }}
          />
        )}
        <SpreadChangeDetailsDrawer
          entry={rateLogDetails?.log}
          // isLoading={rateLogDetailsPending}
          onClose={() => setSelectedHistoryEntry(null)}
        />

        {/* Create Wizard */}
      </div>
    </DashboardLayout>
  );
}
