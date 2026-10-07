import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleChangeCellProps {
  from: string;
  to: string;
  /** Small status line under the change, e.g. "Pending confirmation" */
  subStatus?: string;
  className?: string;
}

/**
 * Compact "Manager -> Admin" cell for tables. The labelled, boxed version
 * used in the edit role modal lives in `ui/role-change-badge`.
 */
export function RoleChangeCell({
  from,
  to,
  subStatus,
  className,
}: RoleChangeCellProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex py-1 px-2 bg-card-secondary rounded-[4px] items-center gap-2 whitespace-nowrap text-[14px] font-normal text-text-primary">
        <span>{from}</span>
        <ArrowRight
          aria-label="to"
          className="h-3.5 w-3.5 shrink-0 text-[#28282B]"
        />
        <span>{to}</span>
      </div>

      {subStatus && (
        <span className="flex px-3 rounded-[360px] items-center gap-1 whitespace-nowrap text-xs font-[500] text-warning-text">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full bg-warning-text"
          />
          {subStatus}
        </span>
      )}
    </div>
  );
}

/** Placeholder for rows with no pending role change */
export function NoRoleChangeCell() {
  return <span className="text-secondary-text">----</span>;
}
