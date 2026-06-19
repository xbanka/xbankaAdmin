import { cn } from "@/lib/utils";
import React from "react";

export const Badge = ({ active, text }: { active: boolean, text: string }) => {
  return (
    <div
      className={cn(
        "rounded-[360px] py-2 px-3 border flex items-center gap-1 w-fit",
        active === true
          ? "bg-success-light border-success-border text-success-text"
          : "bg-grey-light border-grey-border text-grey-text",
      )}
    >
      <span className="w-2 h-2 bg-success-text rounded-full"></span>
      <span className="font-medium text-[12px] leading-4">
        {text}
      </span>
    </div>
  );
};
