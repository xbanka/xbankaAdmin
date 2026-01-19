"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TransactionRecord } from "./transaction-data";

interface CustomerInfoPopupProps {
  customer: TransactionRecord | null;
  popupPosition: { top: number; left: number };
  onClose: () => void;
  onViewDetails: () => void;
}

export function CustomerInfoPopup({
  customer,
  popupPosition,
  onClose,
  onViewDetails,
}: CustomerInfoPopupProps) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="fixed bg-white rounded-lg shadow-lg p-3 w-full max-w-[292px] flex flex-col gap-1"
        style={{
          top: `${popupPosition.top}px`,
          left: `${popupPosition.left}px`,
          transform: "translateX(-50%)", // Center horizontally
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Customer Info */}
        <h1 className="font-[500] text-[14px] leading-[20px] text-[#111827]">
          {customer.customer.first_name} {customer.customer.last_name}
        </h1>

        <div className="font-[400] text-[14px] leading-[24px] text-[#4B5563] flex items-center gap-[14px]">
          <h1>{customer.txn_id}</h1>
          <span className="h-[6px] w-[6px] bg-[#4B5563] rounded-full"></span>
          <p>{customer.customer.email}</p>
        </div>

        <div className="flex items-center gap-[10px]">
          <span className="font-[400] text-[14px] leading-[24px] text-[#4B5563]">
            Referred by
          </span>{" "}
          <span className="font-[400] text-[14px] leading-[24px] text-[#4B5563] gap-[5px]">{customer.affiliate_source}</span>
        </div>

        {/* Transactions Summary */}
        {/* <h1 className="">
          4 transactions done
        </h1> */}

        {/* View Customer Info Button */}
        <Button
        size="sm"
          onClick={onViewDetails}
        >
          View Customer Info
        </Button>
      </div>
    </div>
  );
}
