export function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-normal leading-[18px] text-text-secondary">{label}</p>
      <p className="text-base font-medium text-[#111827]">{value ?? "—"}</p>
    </div>
  );
}