export function VerificationStatusBadge({ status }: { status: boolean }) {
  if (!status) return <span className="text-xs text-gray-400">—</span>;
  const isVerified = status === true;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full ${
        isVerified
          ? "bg-success-light border border-success-border text-success-text"
          : "bg-error-light border border-error-border text-error-text"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isVerified ? "bg-success-text" : "bg-error-text"
        }`}
      />
      {status ? "Active" : "InActive"}
    </span>
  );
}

export function VerificationRequirementsBadge({ status }: { status: boolean | string | null }) {
  const isVerified = status === true;
  console.log("isVerified:", isVerified)
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full ${
        isVerified
          ? "bg-success-light border border-success-border text-success-text"
          : "bg-error-light border border-error-border text-error-text"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isVerified ? "bg-success-text" : "bg-error-text"
        }`}
      />
      {isVerified ? "Verified" : "Not submitted"}
    </span>
  );
}