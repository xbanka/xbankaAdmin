import { SidebarHeaderProps } from "@/lib/types";
import { X } from "lucide-react";
import React from "react";

const SidebarHeader = ({header, onClose}: SidebarHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white border-b border-[#E5E3E3] px-4 py-[18px] flex items-center justify-between">
      <h2 className="text-[18px] leading-[18px] font-semibold text-foreground">
        {header}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 p-1"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
