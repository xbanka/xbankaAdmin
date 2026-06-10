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
    <div className="">
      <div className="space-y-8">
        <div className="space-y-1">
          <h3 className="text-[14px] font-medium leading-5 mb-1 text-text-primary">
            Select Asset Segments
          </h3>
          <p className="text-[12px] font-normal text-text-secondary mb-4">
            Choose the asset groups you want to configure. Each segment will
            have its own default buy and sell spread.
          </p>
        </div>
        <div className="flex items-center justify-between gap-8">
          <div className="flex gap-4 items-center">
            {segments.map((seg) => {
              const Icon = seg.icon;
              return (
                <div
                  key={seg.id}
                  onClick={() => onToggle(seg.id)}
                  className={cn(
                    "flex flex-col justify-between border rounded-[12px] min-h-[242px] p-5 max-w-[288px] space-y-4 cursor-pointer relative transition-all",
                    seg.selected
                      ? "border-input-border-focus"
                      : "border-[#E5E7EB]",
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-[8px] p-2 bg-text-teal-light flex items-center justify-center text-[#0D9488]">
                        <Icon size={16} />
                      </div>
                      {seg.selected && (
                        <div className=" w-5 h-5 rounded bg-[#0D9488] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      {/* {seg.selected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded bg-[#0D9488] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )} */}
                    </div>
                    <div>
                      <h4 className="text-[14px] leading-5.5 font-medium text-[#1F1F1F]">
                        {seg.name}
                      </h4>
                      <p className="text-[11px] text-[#5C544A]">
                        {seg.description}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border-default">
                    <div className="text-[11px] text-[#9CA3AF]">
                      Example Assets
                    </div>
                    <div className="text-[12px] text-[#374151] mt-0.5">
                      {seg.examples.join(" ")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border min-h-[242px] max-w-[300px] border-[#E5E7EB] rounded-xl p-4 bg-[#FAFAFA] h-fit">
            <div className="text-[12px] font-semibold text-[#374151] mb-3">
              Setup summary
            </div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-[#6B7280]">Selected segment</span>
              <span className="font-semibold">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-[13px] mb-3">
              <span className="text-[#6B7280]">Estimated assets</span>
              <span className="font-semibold">{estimatedAssets}</span>
            </div>
            <div className="flex items-start gap-1.5 bg-[#FEF9EC] rounded-lg p-2.5">
              <AlertTriangle
                size={14}
                className="text-[#D97706] flex-shrink-0 mt-0.5"
              />
              <p className="text-[11px] text-[#92400E]">
                Saving this change will update the active spread rule for
                Bitcoin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
