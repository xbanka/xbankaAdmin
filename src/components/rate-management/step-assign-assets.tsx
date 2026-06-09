import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";
import { Asset, Segment } from "./types";

export function StepAssignAssets({
  assets,
  segments,
  onToggleAsset,
  onUpdateSegment,
}: {
  assets: Asset[];
  segments: Segment[];
  onToggleAsset: (id: string) => void;
  onUpdateSegment: (id: string, seg: string) => void;
}) {
  const segOptions = segments.map((s) => s.name);
  const selectedCount = assets.filter((a) => a.checked).length;
 
  return (
    <div>
      <h3 className="text-[16px] font-bold mb-1">Assign Assets to Segments</h3>
      <p className="text-[13px] text-[#6B7280] mb-4">
        Assign each supported asset to a spread segment. Assets will inherit the segment's buy and sell spreads unless a custom override is added later.
      </p>
 
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#9CA3AF] bg-white w-36">
          <Search size={13} /> Search asset
        </div>
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] bg-white">
          <option>Major coins</option>
          {segOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] bg-white">
          <option>Status: All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[12px] text-[#6B7280]">{selectedCount} asset selected</span>
          <select className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] bg-white">
            <option>Assigned selected to</option>
            {segOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center text-white">
            <Check size={15} />
          </button>
        </div>
      </div>
 
      <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className="w-8 p-3"><input type="checkbox" /></th>
              <th className="text-left p-3 font-medium text-[#6B7280]">Asset</th>
              <th className="text-left p-3 font-medium text-[#6B7280]">Current Segment</th>
              <th className="text-left p-3 font-medium text-[#6B7280]">Buy Rate</th>
              <th className="text-left p-3 font-medium text-[#6B7280]">Sell Rate</th>
              <th className="text-left p-3 font-medium text-[#6B7280]">Status</th>
              <th className="text-left p-3 font-medium text-[#6B7280]">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-t border-[#F3F4F6] hover:bg-[#FAFAFA]">
                <td className="p-3">
                  <input type="checkbox" checked={asset.checked} onChange={() => onToggleAsset(asset.id)} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: asset.color }}
                    >
                      {asset.initial}
                    </div>
                    <div>
                      <div className="font-semibold text-[12px]">{asset.name}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full",
                    asset.currentSegment.includes("Major") ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#EFF6FF] text-[#3B82F6]"
                  )}>
                    {asset.currentSegment}
                  </span>
                </td>
                <td className="p-3">₦{asset.buyRate.toLocaleString()}</td>
                <td className="p-3">₦{asset.sellRate.toLocaleString()}</td>
                <td className="p-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                    asset.status === "Active" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F3F4F6] text-[#6B7280]"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", asset.status === "Active" ? "bg-[#059669]" : "bg-[#9CA3AF]")} />
                    {asset.status}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={asset.assignedSegment}
                    onChange={(e) => onUpdateSegment(asset.id, e.target.value)}
                    className="border border-[#E5E7EB] rounded-lg px-2 py-1 text-[11px] text-[#6B7280] bg-white"
                  >
                    {segOptions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}