"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";
import { SearchSelectFieldLayout } from "../layout/SearchableSelectLayout";

export function CryptoTransactionForm() {
  const { register, setValue, watch, handleSubmit } = useFormContext();


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service Type & Transaction Type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="serviceType"
          label="Service Type"
          options={["crypto", "gift-card", "bill-payments"]}
          value={watch("serviceType")}
          onChange={(value) => setValue("serviceType", value)}
          // error={errors.serviceType}
        />
        <SearchSelectFieldLayout
          id="details.transactionType"
          label="Transaction Type"
          options={["USDT - NGN", "BTC - NGN", "ETH - NGN", "NGN - USDT", "NGN - BTC", "NGN - ETH"]}
          value={watch("details.transactionType")}
          onChange={(value) => setValue("details.transactionType", value)}
        />
      </div>

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.customerAmount"
          label="Customer Amount"
          placeholder="Enter customer amount"
          register={register}
          // error={errors.customerAmount}
        />

        <SearchSelectFieldLayout
          id="details.vendor"
          label="Vendor"
          options={["Rayah", "Binance", "Kraken"]}
          value={watch("details.vendor")}
          onChange={(value) => setValue("details.vendor", value)}
          // error={errors.vendor}
        />
      </div>

      {/* Vendor Rate, Xibaka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="details.vendorRate"
          label="Vendor Rate"
          placeholder="Enter vendor's rate"
          register={register}
          // error={errors.vendorRate}
        />
        <FormField
          id="details.xbankaRate"
          label="Xbanka Rate"
          placeholder="Enter xbanka's rate"
          register={register}
          // error={errors.xbankaRate}
        />
        <FormField
          id="details.margin"
          label="Margin"
          placeholder="Enter margin"
          register={register}
          // error={errors.margin}
        />
      </div>

      {/* Expected Payout & Customer Account */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.expectedPayout"
          label="Expected Payout"
          placeholder="Enter expected payout"
          register={register}
          // error={errors.expectedPayout}
        />
        <SearchSelectFieldLayout
          id="details.customerAccountWallet"
          label="Customer Account / Wallet"
          options={["GTB - 0123456789"]}
          value={watch("details.customerAccountWallet")}
          onChange={(value) => setValue("details.customerAccountWallet", value)}
          // error={errors.vendor}
        />
      </div>

      {/* Xibaka Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <SearchSelectFieldLayout
          id="details.xbankaAccount"
          label="Xbanka Account"
          options={["GTB - 0123456789"]}
          value={watch("details.xbankaAccount")}
          onChange={(value) => setValue("details.xbankaAccount", value)}
          // error={errors.vendor}
        />
        <FormField
          id="details.paymentDate"
          label="Payment Date"
          type="date"
          register={register}
          // error={errors.paymentDate}
        />
      </div>

      {/* Attachments */}
      <div>
        <Label>Attachments</Label>
        <div className="mt-2 border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Upload screenshot, receipt, or proof document
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, OR PDF • Max 5MB
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full"
      >
        Submit for Verification
      </Button>
    </form>
  );
}
