import { cn } from "@/lib/utils";
import { AlertTriangle, Check } from "lucide-react";
import { Segment } from "./types";

export function StepSegment({
  segments,
  onToggle,
  selectedCount,
  estimatedAssets,
}: {
  segments: Segment[];
  onToggle: (id: string) => void;
  selectedCount: number;
  estimatedAssets: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_200px] gap-4">
      <div>
        <h3 className="text-[16px] font-bold mb-1">Select Asset Segments</h3>
        <p className="text-[13px] text-[#6B7280] mb-4">
          Choose the asset groups you want to configure. Each segment will have its own default buy and sell spread.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.id}
                onClick={() => onToggle(seg.id)}
                className={cn(
                  "border rounded-xl p-3.5 cursor-pointer relative transition-all",
                  seg.selected ? "border-[#0D9488] border-[1.5px]" : "border-[#E5E7EB]"
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-[#E6F7F5] flex items-center justify-center text-[#0D9488]">
                  <Icon size={16} />
                </div>
                {seg.selected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded bg-[#0D9488] flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <h4 className="text-[13px] font-semibold mt-2 mb-1">{seg.name}</h4>
                <p className="text-[11px] text-[#6B7280] mb-2">{seg.description}</p>
                <div className="text-[11px] text-[#9CA3AF]">Example Assets</div>
                <div className="text-[12px] text-[#374151] mt-0.5">{seg.examples.join(" ")}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#FAFAFA] h-fit">
        <div className="text-[12px] font-semibold text-[#374151] mb-3">Setup summary</div>
        <div className="flex justify-between text-[13px] mb-2">
          <span className="text-[#6B7280]">Selected segment</span>
          <span className="font-semibold">{selectedCount}</span>
        </div>
        <div className="flex justify-between text-[13px] mb-3">
          <span className="text-[#6B7280]">Estimated assets</span>
          <span className="font-semibold">{estimatedAssets}</span>
        </div>
        <div className="flex items-start gap-1.5 bg-[#FEF9EC] rounded-lg p-2.5">
          <AlertTriangle size={14} className="text-[#D97706] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#92400E]">
            Saving this change will update the active spread rule for Bitcoin.
          </p>
        </div>
      </div>
    </div>
  );
}