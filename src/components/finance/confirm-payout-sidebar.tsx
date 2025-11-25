"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Trash2 } from "lucide-react";
import type { PayoutData } from "@/app/(dashboard)/finance/page";
import FinanceDetailsHeader from "../layout/Finance/FinanceDetailsHeader";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import LoaderSpinner from "../ui/loaderSpinner";

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
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const showContent = !loading && !error;

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       attachments: Array.from(e.target.files || []),
  //     }));
  //   }
  // };

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
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
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

// {showContent && <div className="px-[24px] py-[20px]">
//   <div className="space-y-4">
//     {/* Account Source */}
//     <SelectFieldLayout
//     label="Select Account Source"
//       id="date"
//       selectClassName="h-10 py-[8px]"
//       options={filterOptions}
//       placeholder="Transaction Type"
//       onChange={setTransactionTypeFilter}
//     />

//     {/* Payment Reference */}
//     <div>
//       <label
//         htmlFor="paymentReference"
//         className="block text-xs font-semibold text-gray-700 mb-2"
//       >
//         Payment Reference
//       </label>
//       <Input
//         id="paymentReference"
//         name="paymentReference"
//         placeholder="e.g REF88656WER"
//         value={formData.paymentReference}
//         onChange={handleInputChange}
//         className="h-10"
//       />
//     </div>

//     {/* Bank Reference */}
//     <div>
//       <label
//         htmlFor="bankReference"
//         className="block text-xs font-semibold text-gray-700 mb-2"
//       >
//         Bank Reference
//       </label>
//       <Input
//         id="bankReference"
//         name="bankReference"
//         placeholder="e.g REF88656WER"
//         value={formData.bankReference}
//         onChange={handleInputChange}
//         className="h-10"
//       />
//     </div>
//   </div>
// </div>}

// {showContent && <div className="px-[24px] py-[20px]">
//   <h3 className="text-sm font-[500] leading-[20px] text-[#1E1F20] mb-1">
//     Attachments
//   </h3>
//   <p className="text-xs text-[#606368] mb-3">
//     Upload screenshot, receipt or proof of transaction
//   </p>

//   {/* Upload Area */}
//   <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
//     <div className="flex flex-col items-center gap-2">
//       <Upload className="w-5 h-5 text-gray-400" />
//       <div className="text-xs">
//         <p className="font-medium text-gray-700">
//           Upload screenshot, receipt or proof document
//         </p>
//         <p className="text-gray-500">JPG, PNG, PDF, Max 5 MB</p>
//       </div>
//     </div>
//     <input
//       type="file"
//       multiple
//       onChange={handleFileChange}
//       className="hidden"
//       accept=".jpg,.jpeg,.png,.pdf"
//     />
//   </label>

//   {/* Uploaded Files */}
//   {formData.attachments.length > 0 && (
//     <div className="mt-4 space-y-2">
//       {formData.attachments.map((file, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
//         >
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">
//               {file.name.split(".").pop()?.toUpperCase()}
//             </div>
//             <div className="text-sm">
//               <p className="font-medium text-foreground truncate">
//                 {file.name}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {(file.size / 1024).toFixed(2)} KB
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() =>
//               setFormData((prev) => ({
//                 ...prev,
//                 attachments: prev.attachments.filter(
//                   (_, i) => i !== index
//                 ),
//               }))
//             }
//             className="text-red-500 hover:text-red-700 p-1"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       ))}
//     </div>
//   )}
// </div>}
