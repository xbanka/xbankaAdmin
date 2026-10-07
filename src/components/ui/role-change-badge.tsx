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
          "flex items-center gap-10 text-sm font-medium text-text-primary-font-color",
          boxed && "rounded-[8px] border border-[#E9EBEE] p-3 bg-card-primary",
        )}
      >
        <div className="space-y-1 w-full">
          <div className="font-normal text-[12px] text-[#606368]">Current Role</div>
          <span className="font-medium text-[14px] text-[#111827]">{from}</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-secondary-text shrink-0" />
        <div className="space-y-1 w-full">
          <div className="font-normal text-[12px] text-[#606368]">New Role</div>
          <span className="font-medium text-[14px] text-[#111827]">{to}</span>
        </div>
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
