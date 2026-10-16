import type { ReactNode } from "react";

export function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-secondary-text">{label}</span>
      <span className="text-right font-medium text-text-primary break-all">{value}</span>
    </div>
  );
}
