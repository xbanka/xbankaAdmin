import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

/**
 * Maps a raw status string to a sensible variant when the caller
 * doesn't already know it (e.g. "Success" -> success, "Failed" -> error).
 * Pass `variant` explicitly when you already know it to skip guessing.
 */
function inferVariant(label: string): StatusVariant {
  const normalized = label.toLowerCase();

  if (normalized.includes("success") || normalized.includes("active")) {
    return "success";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("awaiting") ||
    normalized.includes("draft")
  ) {
    return "warning";
  }

  if (
    normalized.includes("fail") ||
    normalized.includes("error") ||
    normalized.includes("declined") ||
    normalized.includes("inactive")
  ) {
    return "error";
  }

  return "neutral";
}

const VARIANT_STYLES: Record<StatusVariant, string> = {
  success: "bg-success-light text-success-text",
  warning: "bg-warning-light text-warning-text",
  error: "bg-error-light text-error-text",
  neutral: "bg-grey-light text-grey-text",
};

const DOT_STYLES: Record<StatusVariant, string> = {
  success: "bg-success-text",
  warning: "bg-warning-text",
  error: "bg-error-text",
  neutral: "bg-grey-text",
};

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? inferVariant(label);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full",
        VARIANT_STYLES[resolvedVariant],
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT_STYLES[resolvedVariant])}
      />
      {label}
    </span>
  );
}