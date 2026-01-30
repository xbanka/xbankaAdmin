"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CustomDetailsName from "./CustomDetailsName";
import FinanceDetailsHeader from "../layout/Finance/FinanceDetailsHeader";
import LoaderSpinner from "../ui/loaderSpinner";
import { PayoutDetailsSidebarProps } from "@/lib/types";

export function PayoutDetailsSidebar({
  isOpen,
  onClose,
  payout,
  onDecline,
  onProcess,
  loading,
  error,
}: PayoutDetailsSidebarProps) {
  if (!isOpen) return null;

  const showContent = !loading && !error;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 overflow-hidden transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar - slides from right */}
      <div
        className={`fixed bg-white right-0 top-0 h-screen w-full overflow-x-hidden max-w-[470px] shadow-lg z-50 transform flex flex-col justify-between items-start transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full w-full">
          <div className="w-full flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#E5E3E3] px-4 py-[18px] flex items-center justify-between">
              <h2 className="text-[18px] leading-[18px] font-semibold text-foreground">
                Request Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
            {showContent && (
              <div className="py-[16px] px-[24px] space-y-6 bg-[#F5F5F5]">
                {/* Affiliate Info */}
                <div>
                  <h3 className="text-[14px] leading-[20px] font-[500] text-[#585859] mb-2">
                    Affiliate Info
                  </h3>
                  <div className="grid grid-cols-3 gap-4 bg-white rounded-[8px] p-3">
                    <CustomDetailsName
                      title="Name"
                      body={payout.affiliate.first_name}
                    />
                    <CustomDetailsName
                      title="Username"
                      body={payout.affiliate.username}
                    />
                    <CustomDetailsName title="Status" body={payout.status} />
                    <CustomDetailsName
                      title="Commission rate"
                      body={`${payout.amount}%`}
                    />
                    <CustomDetailsName
                      title="Total payout"
                      body={`₦${payout.amount.toLocaleString()}`}
                    />
                    <CustomDetailsName
                      title="Joined"
                      body={`₦${payout.amount.toLocaleString()}`}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Note */}
            {showContent && (
              <div className="bg-white space-y-4 py-[20px] px-[24px]">
                <div className="space-y-[8px]">
                  <h1 className="font-[500] text-[14px] leading-[20px]">
                    Request Details
                  </h1>
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
            )}
          </div>

          {/* Footer - Action buttons */}
          {showContent && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 py-[16px] px-[20px] flex flex-col md:flex-row gap-4">
              <Button
              variant={payout.status === "rejected" ? "outline" : "default"}
                disabled={payout.status === "rejected"}
                className={
                  payout.status === "rejected"
                    ? "cursor-not-allowed flex-1 bg-transparent border border-destructive text-destructive font-[500] text-[14px] leading-[18px]"
                    : "flex-1"
                }
                onClick={onDecline}
              >
                Decline Request
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-[#606368] font-[500] text-[14px] leading-[18px]"
                onClick={onDecline}
                disabled={true}
              >
                Hold/Flag Payout
              </Button>
              <Button
                variant={payout.status === "paid" ? "outline" : "default"}
                disabled={payout.status === "paid"}
                className={
                  payout.status === "paid"
                    ? "flex-1 cursor-not-allowed bg-gray-300 text-gray-500 border border-gray-300"
                    : "flex-1"
                }
                onClick={onProcess}
              >
                Process Payout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
