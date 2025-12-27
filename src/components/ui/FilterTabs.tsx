"use client";

import { Button } from "@/components/ui/button";
import { FilterTabsProps } from "@/lib/types";

export function FilterTabs({
  filters,
  value,
  onChange,
  className = "",
}: FilterTabsProps) {
  return (
    <div
      className={`flex justify-center md:justify-start gap-1 ${className}`}
    >
      {filters.map((filter) => {
        const normalized = filter.toLowerCase();
        const isActive = value === normalized;

        return (
          <Button
            key={filter}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange(normalized)}
            className={
              isActive
                ? "bg-abstractCyan border border-abstractCyan text-[#111827] p-2 font-[500] text-[14px] leading-[18px]"
                : "font-[500] text-[14px] leading-[18px] text-[#111827] p-2"
            }
          >
            {filter}
          </Button>
        );
      })}
    </div>
  );
}
