// components/rate-management/spread-change-details-drawer.tsx
"use client";

import { X } from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";

import { formatDate } from "@/lib/formatDate";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { AffectedAsset, SpreadHistoryEntry } from "../rate-management/types";
import { Button } from "../ui/button";
import { ScopeBadge, UpdatedStatusBadge } from "../rate-management/scope-badge";

interface Props {
  entry: SpreadHistoryEntry | null;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-b-0">
      <span className="text-[13px] text-[#6B7280]">{label}</span>
      <span className="text-[13px] font-medium text-[#111827]">{value}</span>
    </div>
  );
}

export function SpreadApprovalDrawer({ entry, onClose }: Props) {
  useBodyScrollLock(!!entry);

  if (!entry) return null;

  const affectedAssetColumns = [
    {
      key: "asset",
      header: "Asset",
      render: (row: AffectedAsset) => (
        <div>
          <div className="text-[13px] font-medium text-[#111827]">
            {row.name}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">{row.ticker}</div>
        </div>
      ),
    },
    {
      key: "previousSpread",
      header: "Previous Spread",
      render: (row: AffectedAsset) => (
        <div className="text-[13px] text-[#111827]">
          Buy: {row.previousSpread.buy.toFixed(2)}%
          <br />
          Sell: {row.previousSpread.sell.toFixed(2)}%
        </div>
      ),
    },
    {
      key: "newSpread",
      header: "New Spread",
      render: (row: AffectedAsset) => (
        <div className="text-[13px] text-[#111827]">
          Buy: {row.newSpread.buy.toFixed(2)}%
          <br />
          Sell: {row.newSpread.sell.toFixed(2)}%
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: AffectedAsset) => (
        <UpdatedStatusBadge status={row.status} />
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full md:w-[602px] bg-white shadow-lg flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E5E7EB] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-[#111827]">
                Spread Change Details
              </h2>
              <ScopeBadge scope={entry.scope} />
            </div>
            <p className="text-[13px] text-[#9CA3AF]">
              {formatDate(entry.dateTime)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Change Summary */}
          <div className="space-y-1 py-4 px-5">
            <h3 className="text-sm font-normal text-text-secondary">
              Change Summary
            </h3>
            <p className="text-[14px] font-medium leading-5 text-text-secondary">
              {entry.changeSummary}
            </p>
          </div>

          {/* Target Information */}
          <div>
            <h3 className="text-sm font-medium leading-5 text-text-primary py-3 px-5 border border-card-border-secondary bg-card-secondary rounded-tl-[20px] rounded-tr-[20px]">
              Target Information
            </h3>
            <div className="bg-[#F9FAFB] rounded-lg py-4 px-5">
              <InfoRow
                label="Scope"
                value={entry.scope === "segment" ? "Segment" : "Asset"}
              />
              <InfoRow label="Target" value={entry.targetName} />
              <InfoRow
                label="Affected Assets"
                value={`${entry.affectedAssetsCount} Assets`}
              />
              <InfoRow
                label="Previous Configuration"
                value={`Buy: ${entry.previousConfig.buy.toFixed(2)}% · Sell: ${entry.previousConfig.sell.toFixed(2)}%`}
              />
              <InfoRow
                label="New Configuration"
                value={`Buy: ${entry.newConfig.buy.toFixed(2)}% · Sell: ${entry.newConfig.sell.toFixed(2)}%`}
              />
              <InfoRow label="Effective Until" value={entry.effectiveUntil} />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={
                      entry.status === "Active"
                        ? "text-[#059669]"
                        : "text-[#6B7280]"
                    }
                  >
                    {entry.status}
                  </span>
                }
              />
            </div>
          </div>

          {/* Affected Assets */}
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2">
              Affected Assets
            </h3>
            <DataTableLayout
              data={entry.affectedAssets}
              columns={affectedAssetColumns}
              rowKey={(row) => row.id}
              itemsPerPage={entry.affectedAssets.length || 1}
              totalCount={entry.affectedAssets.length}
              emptyMessage="No assets affected."
            />
          </div>

          {/* Changed by */}
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2">
              Changed by
            </h3>
            <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-lg p-3">
              <div className="w-9 h-9 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[12px] font-semibold text-[#374151]">
                {entry.updatedBy.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="text-[13px] font-medium text-[#111827]">
                  {entry.updatedBy.name}
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {entry.updatedBy.role} · {formatDate(entry.dateTime)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 border-t p-6">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button variant="outline" className="text-red-600">
              Decline
            </Button>

            <Button>Approve</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
