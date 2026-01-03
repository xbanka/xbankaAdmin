"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TransactionRecord } from "./transaction-data";

interface CustomerInfoPopupProps {
  customer: TransactionRecord | null;
   popupPosition: { top: number; left: number }
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
        <h1>{customer.customerName}</h1>

        <div>
            <h1>{customer.id}</h1>
            <p>{customer.status}</p>
        </div>

        <div>
            <p>Referred by</p> <h1>{customer.createdAt}</h1>
        </div>

        {/* Transactions Summary */}
        <h1 className="">
          4 transactions done
        </h1>

        {/* View Customer Info Button */}
        <Button
          onClick={onViewDetails}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm"
        >
          View Customer Info
        </Button>
      </div>
    </div>
  );
}
