import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Asset, Segment, SegmentSpread } from "./types";

export function StepReview({
  segments,
  spreads,
  assets,
}: {
  segments: Segment[];
  spreads: SegmentSpread[];
  assets: Asset[];
}) {
  const selectedSegments = segments.filter((s) => s.selected);
  return (
    <div className="max-w-[600px]">
      <h3 className="text-[16px] font-bold mb-1">Review & Activate</h3>
      <p className="text-[13px] text-[#6B7280] mb-5">
        Review your configuration before activating. Changes will apply immediately to all customer-facing rates.
      </p>
 
      <div className="space-y-3">
        {selectedSegments.map((seg) => {
          const spread = spreads.find((s) => s.id === seg.id);
          const segAssets = assets.filter((a) => a.assignedSegment === seg.name && a.checked);
          return (
            <div key={seg.id} className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[14px] font-semibold">{seg.name}</div>
                <span className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full font-medium",
                  spread?.enabled ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F3F4F6] text-[#6B7280]"
                )}>
                  {spread?.enabled ? "Active" : "Disabled"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px] mb-3">
                <div className="bg-[#F9FAFB] rounded-lg p-2.5">
                  <div className="text-[#9CA3AF] mb-0.5">Buy Spread</div>
                  <div className="font-semibold text-[#0D9488]">{spread?.buySpread.toFixed(2)}%</div>
                </div>
                <div className="bg-[#F9FAFB] rounded-lg p-2.5">
                  <div className="text-[#9CA3AF] mb-0.5">Sell Spread</div>
                  <div className="font-semibold text-[#0D9488]">{spread?.sellSpread.toFixed(2)}%</div>
                </div>
              </div>
              {segAssets.length > 0 && (
                <div className="text-[11px] text-[#6B7280]">
                  Assets: {segAssets.map((a) => a.symbol).join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
 
      <div className="flex items-start gap-2 mt-4 bg-[#FEF9EC] rounded-xl p-3">
        <AlertTriangle size={15} className="text-[#D97706] flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#92400E]">
          Activating will immediately update spread rules for all assigned assets. Customer-facing rates will reflect changes as Oblex refreshes.
        </p>
      </div>
    </div>
  );
}