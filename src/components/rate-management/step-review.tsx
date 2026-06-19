import { AlertTriangle } from "lucide-react";
import { Asset, Segment, SegmentSpread } from "./types";

export function StepReview({
  segments,
  spreads,
}: {
  segments: Segment[];
  spreads: SegmentSpread[];
}) {
  return (
    <div className="max-w-[600px]">
      <h3 className="text-[16px] font-bold mb-1">Review & Activate</h3>
      <p className="text-[13px] text-[#6B7280] mb-5">
        Review your configuration before activating. Changes will apply immediately to all customer-facing rates.
      </p>
 
      <div className="space-y-3">

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