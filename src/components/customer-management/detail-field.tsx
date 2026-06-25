export function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-medium">{value ?? "—"}</p>
    </div>
  );
}