"use client";

import { Button } from "@/components/ui/button";
import FinanceDetailsHeader from "./FinanceDetailsHeader";
import LoaderSpinner from "../ui/loaderSpinner";
import SidebarHeader from "../Sidebar/sidebar-header";
import { PayoutData } from "@/lib/types";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { useForm } from "react-hook-form";
import FormField from "../forms/FormField";
import { Label } from "../ui/label";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";
import { useState } from "react";

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

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const hasAttachments = attachments.length > 0;
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  if (!isOpen) return null;

  const accounts: string | any[] = []

  const defaultAccounts = accounts.length > 0 ? accounts : [
      { id: "1", label: "GTB - XBanka Team", account: "01234*****" },
      { id: "2", label: "Access Bank - Finance", account: "12345*****" },
      { id: "3", label: "First Bank - Operations", account: "54321*****" },
    ]

  const accountOptions = defaultAccounts.map(acc => `${acc.label} (${acc.account})`)

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
                    <div className="flex items-start justify-between">
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
                            -
                          </div>
                        }
                      />
                      <FinanceDetailsHeader
                        title="Bank Details"
                        content={
                          <div className="font-[500] text-[14px] leading-[18px] text-center">
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
            <div className="py-[20px] px-[24px] space-y-4 border-b border-border">
                  <SelectFieldLayout
                id="accountSource"
                label="Select Account Source"
                options={accountOptions}
                placeholder="Select an account"
                onChange={(value) => setValue("accountSource", value)}
                className="w-full"
                selectClassName="border border-[#E5E3E3] bg-white"
              />
              <FormField
        id="paymentReference"
        label="Payment Reference"
        placeholder="e.g REF89665WER"
        register={register}
        error={errors.paymentReference}
      />
            </div>
             

            {/* Attachments */}
            <div className="py-[20px] px-[24px] border-b border-border">
        <Label className="text-[14px] font-[500] leading-[20px]">Attachments</Label>
        <Label className="text-[#606368] mb-[8px]">Include receipt of transaction</Label>
        <AttachmentUpload value={attachments} onChange={setAttachments} />
        {/* {!hasAttachments && (
          <p className="text-[10px] text-mainRed mt-1">
            At least one attachment is required
          </p>
        )} */}
      </div>
          </div>

          {/* Footer - Action buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent text-[#606368]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-3"
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

