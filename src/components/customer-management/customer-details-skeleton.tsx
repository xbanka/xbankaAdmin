import { Skeleton } from "@/components/ui/skeleton";
import { TABS } from "./data";

/** Placeholder that mirrors the customer sidebar layout: header, tabs, and the Profile tab card. */
export function CustomerDetailsSkeleton({ onClose }: { onClose?: () => void }) {
  return (
    <div data-testid="customer-details-skeleton" aria-busy="true">
      {/* Header */}
      <div className="py-4 px-4 sm:px-6 flex justify-between gap-3 items-start">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32 sm:h-7 sm:w-44" />
              <Skeleton className="h-6 w-[67px] rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close">
            <Skeleton className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-default)] px-2 sm:px-6 overflow-hidden">
        {TABS.map((tab) => (
          <div key={tab.key} className="py-3 px-4">
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Profile card */}
      <div className="bg-card-secondary h-screen p-4 sm:p-6">
        <div className="py-3 px-5 rounded-t-[12px] border border-card-border-secondary bg-card-secondary">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="rounded-b-[12px] py-4 px-5 bg-card-primary border-x border-b border-card-border-secondary flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[var(--border-default)] flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
