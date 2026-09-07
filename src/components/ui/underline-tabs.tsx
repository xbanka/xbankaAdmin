"use client";

import { cn } from "@/lib/utils";

interface UnderlineTabsProps {
  tabs: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Simple underline tab bar, e.g. "Role Changes" / "Logins" on Audit Log.
 * Not tied to any routing - purely controlled via value/onChange.
 */
export function UnderlineTabs({ tabs, value, onChange, className }: UnderlineTabsProps) {
  return (
    <div className={cn("flex items-center gap-6 border-b border-border", className)}>
      {tabs.map((tab) => {
        const isActive = tab === value;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              isActive
                ? "text-text-teal"
                : "text-secondary-text hover:text-text-primary",
            )}
          >
            {tab}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-text-teal rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}