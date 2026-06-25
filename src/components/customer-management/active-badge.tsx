export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      active ? "bg-[var(--success-light)] text-[var(--success-text)]" : "bg-gray-100 text-gray-500"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[var(--success-text)]" : "bg-gray-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}