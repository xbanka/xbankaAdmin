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
                      <div className="w-8 h-8 border border-teal-border rounded-[8px] p-2 bg-teal-light flex items-center justify-center text-[#0F766E]">
                        <Icon size={16} />
                      </div>
                      {seg.selected && (
                        <div className="w-5 h-5 rounded bg-[#0D9488] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
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
                    <div className="text-[12px] font-normal text-[#5C544A]">
                      Example Assets
                    </div>
                    <div className="text-[12px] text-[#374151] mt-1 flex items-center gap-2">
                      {seg.examples?.map((item) => (
                        <div
                          key={item}
                          className="rounded-[4px] border px-2 bg-card-secondary border-card-border-secondary"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border min-h-[242px] max-w-[300px] border-card-border-secondary bg-card-primary rounded-[12px] px-5 pt-6 pb-[34px] space-y-2 h-fit">
            <div className="text-[16px] font-medium text-text-primary">
              Setup summary
            </div>
            <div>
              <div className="flex justify-between text-[13px] py-3 border-b border-card-border-secondary">
                <span className="font-normal text-[12px] text-text-secondary">Selected segment</span>
                <span className="font-medium text-[14px] text-text-primary">{selectedCount}</span>
              </div>
              <div className="flex justify-between text-[13px] py-3">
                <span className="font-normal text-[12px] text-text-secondary">Estimated assets</span>
                <span className="font-medium text-[14px] text-text-primary">{estimatedAssets}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 bg-teal-light rounded-[8px] py-1 px-2">
              <AlertTriangle
                size={16}
                className="text-teal-text flex-shrink-0 mt-0.5"
              />
              <p className="text-[12px] text-teal-text font-normal">
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
