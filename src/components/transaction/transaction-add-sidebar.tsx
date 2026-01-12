"use client";

import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoTransactionForm } from "./transaction-form-crypto";
import { GiftCardTransactionForm } from "./transaction-form-gift-card";
import { BillPaymentTransactionForm } from "./transaction-form-bill-payment";
import { ActiveCustomer } from "../../lib/types/transactionTypes";
import { CustomerDetailsDisplay } from "./customers-details-display";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { useFormContext } from "react-hook-form";

type TransactionType = "crypto" | "gift-card" | "bill-payments" | null;

interface TransactionAddSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  customer: ActiveCustomer | null;
  onBack: () => void;
}

export function TransactionAddSidebar({
  isOpen,
  onClose,
  customer,
  onBack,
}: TransactionAddSidebarProps) {

  const { watch, setValue } = useFormContext();

  const serviceType = watch("serviceType");

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="w-[40%] bg-white shadow-lg flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          {serviceType && (
            <button
              onClick={() => setValue("serviceType", undefined)}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-[#111827] flex-1">
            {serviceType
              ? `Add ${
                  serviceType === "gift-card"
                    ? "Gift Card"
                    : serviceType === "bill-payments"
                    ? "Bill Payment"
                    : "Crypto"
                } Transaction`
              : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <CustomerDetailsDisplay
          displayTitle="Customer info"
          customer={customer}
        />
        <div className="flex-1 p-6">
          {!serviceType ? (
            <div className="space-y-6">
              {/* Customer Info */}

              {/* Transaction Type Selector */}
              <div>
                <h3 className="text-sm font-semibold text-[#111827] mb-3">
                  Transaction Information
                </h3>
                <SelectFieldLayout
                  id="serviceType"
                  label="Service Type"
                  options={["crypto", "gift-card"]}
                  placeholder="Select type"
                  value={serviceType}
                  onChange={(value) => {
                    setValue("serviceType", value as TransactionType); // ✅ CHANGE
                  }}
                />
              </div>
            </div>
          ) : serviceType === "crypto" ? (
            <CryptoTransactionForm handleClose={onClose} />
          ) : serviceType === "gift-card" ? (
            <GiftCardTransactionForm handleClose={onClose} />
          ) : (
            <BillPaymentTransactionForm />
          )}
        </div>

        {/* Footer - Close Button */}
        {!serviceType && (
          <div className="p-6 border-t border-[#E5E7EB]">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full bg-transparent"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
