export function VerificationStatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <span className="text-xs text-gray-400">—</span>;
  const isVerified = status === "APPROVED" || status === "Verified" || status === "Active";
  const isPending = status === "PENDING" || status === "Pending Review";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      isVerified
        ? "bg-[var(--success-light)] text-[var(--success-text)]"
        : isPending
        ? "bg-[#FFF8D8] text-[#B29504]"
        : "bg-[#FCE6E6] text-[#EF4444]"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        isVerified ? "bg-[var(--success-text)]" : isPending ? "bg-[#B29504]" : "bg-[#EF4444]"
      }`} />
      {status}
    </span>
  );
}