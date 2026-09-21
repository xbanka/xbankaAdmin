import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusVariant } from "./status-badge";

interface RoleChangeBadgeProps {
  from: string;
  to: string;
  /** Optional small status line shown under the change, e.g. "Pending confirmation" */
  subStatus?: string;
  subStatusVariant?: StatusVariant;
  /** Renders the change inside a bordered pill instead of plain text */
  boxed?: boolean;
  className?: string;
}

export function RoleChangeBadge({
  from,
  to,
  subStatus,
  subStatusVariant = "warning",
  boxed = false,
  className,
}: RoleChangeBadgeProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium text-text-primary-font-color w-fit",
          boxed && "rounded-md border border-border px-2 py-1 bg-card-secondary",
        )}
      >
        <span>{from}</span>
        <ArrowRight className="w-3.5 h-3.5 text-secondary-text shrink-0" />
        <span>{to}</span>
      </div>

      {subStatus && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-warning-text">
          <span className="h-1.5 w-1.5 rounded-full bg-warning-text" />
          {subStatus}
        </span>
      )}
    </div>
  );
}

/** For cases where you just want the plain "no change" placeholder cell */
export function NoRoleChange() {
  return <span className="text-secondary-text">{"—"}</span>;
}