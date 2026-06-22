export function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cls =
    s === "successful" || s === "completed"
      ? "bg-[#D1FAE5] text-[#37703F] border border-[#B8FFC2]"
      : s === "failed"
        ? "bg-[#FCE6E6] text-[#EF4444]"
        : s === "pending"
          ? "bg-[#FFF8D8] text-[#B29504]"
          : s === "processing"
            ? "bg-[#F0F7FF] text-[#004C99]"
            : "bg-gray-100 text-gray-600";
  return (
    <span
      className={`capitalize px-3 py-[8px] rounded-full text-xs font-medium leading-[16px] ${cls}`}
    >
      {status}
    </span>
  );
}