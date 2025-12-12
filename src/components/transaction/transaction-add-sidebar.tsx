"use client";

import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoTransactionForm } from "./transaction-form-crypto";
import { GiftCardTransactionForm } from "./transaction-form-gift-card";
import { BillPaymentTransactionForm } from "./transaction-form-bill-payment";
import { Customer } from "./types";
import { CustomerDetailsDisplay } from "./customers-details-display";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";

type TransactionType = "crypto" | "gift-card" | "bill-payments" | null;

interface TransactionAddSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onBack: () => void;
}

export function TransactionAddSidebar({
  isOpen,
  onClose,
  customer,
  onBack,
}: TransactionAddSidebarProps) {
  const [selectedType, setSelectedType] = useState<TransactionType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleSelectChange = (type: TransactionType) => {
    setSelectedType(type);
  }

  const handleFormSubmit = (data: Record<string, string>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Transaction submitted:", {
        customer,
        type: selectedType,
        ...data,
      });
      setIsSubmitting(false);
      setSelectedType(null);
      onClose();
    }, 1500);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="max-w-[470px] bg-white shadow-lg flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          {selectedType && (
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-[#111827] flex-1">
            {selectedType
              ? `Add ${
                  selectedType === "bill-payments"
                    ? "Bill Payment"
                    : selectedType === "gift-card"
                    ? "Gift Card"
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
        <CustomerDetailsDisplay displayTitle="Customer info" customer={customer} />
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedType ? (
            <div className="space-y-6">
              {/* Customer Info */}

              {/* Transaction Type Selector */}
              <div>
                <h3 className="text-sm font-semibold text-[#111827] mb-3">
                  Transaction Information
                </h3>
                <SelectFieldLayout
                  id="transactionType"
                  label="Service Type"
                  options={["crypto", "gift-card", "bill-payments"]}
                  placeholder="Select type"
                  onChange={(value) =>
                    handleSelectChange(value)
                  }
                />
              </div>
            </div>
          ) : selectedType === "crypto" ? (
            <CryptoTransactionForm
              onSubmit={handleFormSubmit}
              isLoading={isSubmitting}
            />
          ) : selectedType === "gift-card" ? (
            <GiftCardTransactionForm
              onSubmit={handleFormSubmit}
              isLoading={isSubmitting}
            />
          ) : (
            <BillPaymentTransactionForm
              onSubmit={handleFormSubmit}
              isLoading={isSubmitting}
            />
          )}
        </div>

        {/* Footer - Close Button */}
        {!selectedType && (
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
