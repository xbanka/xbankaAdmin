import { SpreadInput } from "./spread-input";
import { Toggle } from "./toggle";
import { Segment, SegmentSpread } from "./types";

export function StepSetSpread({
  segments,
  spreads,
  onUpdateSpread,
  onToggleSpread,
  setupNote,
  onSetupNote,
}: {
  segments: Segment[];
  spreads: SegmentSpread[];
  onUpdateSpread: (id: string, field: "buySpread" | "sellSpread", val: number) => void;
  onToggleSpread: (id: string) => void;
  setupNote: string;
  onSetupNote: (v: string) => void;
}) {
  return (
    <div className="max-w-[600px] mx-auto bg-card-primary rounded-[12px] p-5 border border-card-border-secondary">
      <h3 className="text-[16px] font-medium text-primary mb-4">Set Segment Spreads</h3>
      <div className="space-y-3">
        {segments.map((seg) => {
          const spread = spreads.find((s) => s.id === seg.id)!;
          if (!spread) return null;
          return (
            <div key={seg.id} className="border border-[#E5E7EB] rounded-xl p-4 bg-card-secondary">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="text-[14px] font-medium text-text-primary">{seg.name}</div>
                  <div className="text-[12px] text-[#9CA3AF]">{seg.description}</div>
                </div>
                <Toggle on={spread.enabled} onToggle={() => onToggleSpread(seg.id)} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <SpreadInput
                  label="Buy Spread"
                  value={spread.buySpread}
                  onChange={(v) => onUpdateSpread(seg.id, "buySpread", v)}
                />
                <SpreadInput
                  label="Sell Spread"
                  value={spread.sellSpread}
                  onChange={(v) => onUpdateSpread(seg.id, "sellSpread", v)}
                />
              </div>
            </div>
          );
        })}
 
        {/* Setup note */}
        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-card-secondary">
          <div className="text-[14px] font-semibold mb-2">Set-up note</div>
          <textarea
            value={setupNote}
            onChange={(e) => onSetupNote(e.target.value)}
            placeholder="Add context for audit logs..."
            className="w-full border border-card-border-secondary bg-card-primary rounded-lg p-3 text-[13px] h-20 resize-none outline-none focus:border-[#0D9488] focus:ring-[3px] focus:ring-[#0D9488]/10 transition-all"
          />
        </div>
      </div>
    </div>
  );
}