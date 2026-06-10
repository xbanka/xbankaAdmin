import { cn } from "@/lib/utils";

export function PreviewRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[12px] text-[#6B7280]">{label}</span>
      <span className={cn("text-[13px] font-semibold text-[#111827]", valueClass)}>
        {value}
      </span>
    </div>
  );
}