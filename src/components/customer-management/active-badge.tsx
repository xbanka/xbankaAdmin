export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex border items-center gap-1 text-xs font-medium px-3 py-2 rounded-[360px] ${
      active ? "bg-[var(--success-light)] border-[var(--success-border)] text-[var(--success-text)]" : "bg-[#F9F9F9] border-[#DADDE2] text-[#374151]"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[var(--success-text)]" : "bg-[#374151]"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}