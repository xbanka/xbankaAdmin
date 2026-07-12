// components/rate-management/scope-badge.tsx
"use client";

import { Layers, Coins, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpreadScope } from "./types";

export function ScopeBadge({ scope }: { scope: SpreadScope }) {
  const isSegment = scope === "segment";
  const Icon = isSegment ? Layers : Coins;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        isSegment ? "bg-[#EEF2FF] text-[#4F46E5]" : "bg-[#FFFBEB] text-[#B45309]",
      )}
    >
      <Icon size={12} />
      {isSegment ? "Segment" : "Asset"}
    </span>
  );
}

export function AffectedAssetsBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-[#374151]">
      <Boxes size={12} />
      {count} {count === 1 ? "Asset" : "Assets"}
    </span>
  );
}

export function UpdatedStatusBadge({
  status,
}: {
  status: "Updated" | "Unchanged" | "Deactivated";
}) {
  const styles: Record<typeof status, string> = {
    Updated: "bg-[#ECFDF5] text-[#059669]",
    Unchanged: "bg-[#F3F4F6] text-[#6B7280]",
    Deactivated: "bg-[#FEF2F2] text-[#DC2626]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium",
        styles[status],
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}