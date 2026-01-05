"use client";

import { Button } from "@/components/ui/button";
import FinanceDetailsHeader from "../layout/Finance/FinanceDetailsHeader";
import LoaderSpinner from "../ui/loaderSpinner";
import SidebarHeader from "../Sidebar/sidebar-header";
import { PayoutData } from "@/lib/types";

interface ConfirmPayoutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutData;
  onConfirm: () => void;
  loading: boolean;
  error: string;
}

const filterOptions = ["GTB - Xbanka (0123456789)"];

export function ConfirmPayoutSidebar({
  isOpen,
  onClose,
  payout,
  onConfirm,
  loading,
  error,
}: ConfirmPayoutSidebarProps) {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="w-full flex-1 overflow-y-auto">
            <SidebarHeader header="Request Details" onClose={onClose} />
            {/* <div className="sticky top-0 bg-white border-b border-[#E5E3E3] px-4 py-[18px] flex items-center justify-between">
              <h2 className="text-[18px] leading-[18px] font-semibold text-foreground">
                Request Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div> */}

            {/* LOADING STATE */}
            {loading && (
              <div className="flex flex-1 items-center w-full mt-[50px] justify-center">
                <LoaderSpinner />
              </div>
            )}

            {/* ERROR STATE */}
            {error && !loading && (
              <div className="flex flex-1 items-center justify-center w-full mt-[50px] text-red-600 font-medium">
                Failed to load payout details.
                <br />
                {error}
              </div>
            )}

            {/* Content */}
            
              <div className="py-[16px] px-[24px] bg-[#F5F5F5] space-y-6">
                {/* Payment Details Summary */}
                <h1 className="font-[500] text-[14px] leading-[20px]">
                  Payment Details
                </h1>
                <div className="bg-white rounded-[8px] space-y-4 p-3">
                  {" "}
                  <div className="space-y-[8px]">
                    <div className="flex items-center justify-between">
                      <FinanceDetailsHeader
                        title="Amount"
                        content={
                          <div className="font-[500] text-[14px] leading-[18px]">
                            {payout.amount}
                          </div>
                        }
                      />
                      <FinanceDetailsHeader
                        title="Payment Method"
                        content={
                          <div className="font-[500] text-[14px] leading-[18px]">
                            Bank Transfer
                          </div>
                        }
                      />
                      <FinanceDetailsHeader
                        title="Bank Details"
                        content={
                          <div className="font-[500] text-[14px] leading-[18px]">
                            {payout.affiliate.account_no}
                          </div>
                        }
                      />
                    </div>
                  </div>
                  {/* {payout.note && (
                  <div className="bg-[#F5F5F5] space-y-1 p-3 rounded-[12px]">
                    <h3 className="text-[12px] font-[400] leading-[16px] text-[#606368]">
                      Note
                    </h3>
                    <p className="text-sm text-[#585859] font-[500] leading-[18px]">
                      {payout.note}
                    </p>
                  </div>
                )} */}
                </div>
              </div>
            
            {/* Form Fields */}

            {/* Attachments */}
          </div>

          {/* Footer - Action buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
            >
              Confirm Payout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

