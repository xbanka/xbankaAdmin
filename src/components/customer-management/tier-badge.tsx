export function TierBadge({ tier }: { tier: number }) {
  const colors = ["bg-gray-100 text-gray-600", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700"];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${colors[tier] ?? colors[0]}`}>
      {tier} Tier {tier}
    </span>
  );
}