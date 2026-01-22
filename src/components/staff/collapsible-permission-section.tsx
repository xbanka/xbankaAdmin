"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import SidebarDetailedHeader from "../ui/SidebarDetailedHeader";

interface CollapsiblePermissionSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CollapsiblePermissionSection({
  title,
  children,
}: CollapsiblePermissionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [checkedCount, setCheckedCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const updateCount = () => {
      const count =
        contentRef.current?.querySelectorAll(
          '[role="checkbox"][data-state="checked"]'
        ).length ?? 0;

      setCheckedCount(count);
    };

    updateCount();

    const observer = new MutationObserver(updateCount);

    observer.observe(contentRef.current, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3 py-2 flex items-center rounded-t-[8px] justify-between hover:bg-gray-50 transition-colors bg-[#F9F9F9] border border-[#E9EBEE] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <SidebarDetailedHeader text={title} />
          <span className="border py-1 px-2 border-[#B7DBFF] bg-[#F0F7FF] text-[#004C99] text-xs rounded-full font-medium">
            {checkedCount} selected
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div
          ref={contentRef}
          className="px-3 py-2 rounded-b-[8px] border-x border-b border-[#E9EBEE]"
        >
          {children}
        </div>
      )}
    </div>
  );
}
