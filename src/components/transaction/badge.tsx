export function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cls =
    s === "successful" || s === "completed"
      ? "bg-[#D1FAE5] text-[#037508]"
      : s === "failed"
        ? "bg-[#FCE6E6] text-[#EF4444]"
        : s === "pending"
          ? "bg-[#FFF8D8] text-[#B29504]"
          : s === "processing"
            ? "bg-[#E0F2FE] text-[#0369A1]"
            : "bg-gray-100 text-gray-600";
  return (
    <span
      className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}