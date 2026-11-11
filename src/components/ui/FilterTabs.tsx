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
    <div className={`flex justify-start gap-1 overflow-x-auto md:overflow-visible md:shrink-0 ${className}`}>
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
                ? "bg-[#DDFFFB] border border-[#68F4E3] text-[#111827] p-2 font-[500] text-[14px] leading-[18px]"
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
