export function TierBadge({ tier }: { tier?: string | number }) {
  if (tier == null) return <span className="text-gray-400 text-xs">—</span>;
  return (
    <span className="flex items-center gap-1">
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
        {String(tier).replace(/tier\s*/i, "")}
      </span>
      <span className="text-xs text-gray-500">Tier {String(tier).replace(/tier\s*/i, "")}</span>
    </span>
  );
}