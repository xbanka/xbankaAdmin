"use client";

import { X } from "lucide-react";
import { DataTableLayout } from "../DataTableLayout/DataTableLayout";

import { formatDate } from "@/lib/formatDate";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Button } from "../ui/button";
import { ScopeBadge, UpdatedStatusBadge } from "../rate-management/scope-badge";
import type {
  AffectedAssetDetail,
  RateLogDetails,
} from "../rate-management/spread-change-details-change-drawer";
import { NameInfo } from "./name-info";

interface Props {
  entry: RateLogDetails | null;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
  isApproving?: boolean;
  isDeclining?: boolean;
}

function getConfigValue(configList: string[] = [], prefix: string): string {
  const match = configList.find((item) =>
    item.toLowerCase().startsWith(prefix.toLowerCase()),
  );
  return match ? match.split(":")[1]?.trim() ?? "-" : "-";
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-b-0">
      <span className="text-[13px] text-[#6B7280]">{label}</span>
      <span className="text-[13px] font-medium text-[#111827]">{value}</span>
    </div>
  );
}

export function SpreadApprovalDrawer({
  entry,
  onClose,
  onApprove,
  onDecline,
  isApproving,
  isDeclining,
}: Props) {
  useBodyScrollLock(!!entry);

  if (!entry) return null;

  const isPending = entry.status === "PENDING";
  const affectedAssetsList = entry.affected_assets_detail ?? [];

  const affectedAssetColumns = [
    {
      key: "asset",
      header: "Asset",
      render: (row: AffectedAssetDetail) => (
        <div>
          <div className="text-[13px] font-medium text-[#111827]">
            {row.name}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">{row.currency}</div>
        </div>
      ),
    },
    {
      key: "previousSpread",
      header: "Previous Spread",
      render: (row: AffectedAssetDetail) => (
        <div className="text-[13px] text-[#111827]">
          Buy: {getConfigValue(row.previous_configuration, "Buy")}
          <br />
          Sell: {getConfigValue(row.previous_configuration, "Sell")}
        </div>
      ),
    },
    {
      key: "newSpread",
      header: "New Spread",
      render: (row: AffectedAssetDetail) => (
        <div className="text-[13px] text-[#111827]">
          Buy: {getConfigValue(row.new_configuration, "Buy")}
          <br />
          Sell: {getConfigValue(row.new_configuration, "Sell")}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: AffectedAssetDetail) => (
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
        <div className="flex items-start justify-between py-4 px-6 bg-[#FFFFFF] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[24px] font-semibold text-text-primary">
                Spread Change Details
              </h2>
              <ScopeBadge
                scope={
                  entry.change_type.includes("SEGMENT") ? "segment" : "asset"
                }
              />
            </div>
            <p className="text-[13px] text-[#9CA3AF]">
              {/* {formatDate(entry.created_at)} */}
              Review the proposed configuration changes before approving or declining.
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

          {/* Target Information */}
          <div>
            <h3 className="text-sm font-medium leading-5 text-text-primary py-3 px-5 border border-card-border-secondary bg-card-secondary rounded-tl-[20px] rounded-tr-[20px]">
              Request Information
            </h3>
            <div className="bg-[#FFFFFF] py-4 px-5 border-x border-b grid grid-cols-2 rounded-bl-[20px] rounded-br-[20px]">
              <NameInfo title="Submitted by" value={"John doe"} />
              <NameInfo title="Role" value={"Operation Manager"} />
              <NameInfo title="Submitted on" value={"24 Jul 2026 • 09:42 AM"} />
              <NameInfo title="Submitted on" value={"24 Jul 2026 • 09:42 AM"} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium leading-5 text-text-primary py-3 px-5 border border-card-border-secondary bg-card-secondary rounded-tl-[20px] rounded-tr-[20px]">
              Request Information
            </h3>
            <div className="bg-[#FFFFFF] py-4 px-5 border-x border-b rounded-bl-[20px] rounded-br-[20px]">
              <InfoRow
                label="Scope"
                value={
                  entry.change_type.includes("SEGMENT") ? "Segment" : "Asset"
                }
              />
              <InfoRow label="Target" value={entry.target} />
              <InfoRow
                label="Affected Assets"
                value={`${entry.affected_assets} Assets`}
              />
              <InfoRow
                label="Previous Configuration"
                value={
                  <div className="text-right">
                    {entry.previous_configuration.length
                      ? entry.previous_configuration.map((item) => (
                          <div key={item}>{item}</div>
                        ))
                      : "-"}
                  </div>
                }
              />
              <InfoRow
                label="New Configuration"
                value={
                  <div className="text-right">
                    {entry.new_configuration.length
                      ? entry.new_configuration.map((item) => (
                          <div key={item}>{item}</div>
                        ))
                      : "-"}
                  </div>
                }
              />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={
                      entry.status === "APPROVED"
                        ? "text-[#059669]"
                        : entry.status === "REJECTED"
                          ? "text-red-600"
                          : "text-orange-600"
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
              data={affectedAssetsList}
              columns={affectedAssetColumns}
              rowKey={(row) => row.id}
              itemsPerPage={affectedAssetsList.length || 1}
              totalCount={affectedAssetsList.length}
              emptyMessage="No assets affected."
            />
          </div>
        </div>

        {isPending && (
          <div className="flex justify-between border-t py-4 px-8 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="text-text-primary"
                onClick={onDecline}
                disabled={isApproving || isDeclining}
              >
                {isDeclining ? "Declining..." : "Decline"}
              </Button>

              <Button
                onClick={onApprove}
                disabled={isApproving || isDeclining}
              >
                {isApproving ? "Approving..." : "Approve"}
              </Button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
