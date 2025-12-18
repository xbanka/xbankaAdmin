"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";

export function CryptoTransactionForm() {
  const { register, setValue, watch, handleSubmit } = useFormContext();

  useEffect(() => {
    setValue("details.serviceType", "crypto");
  }, []);

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
          options={["Crypto", "Gift Card", "Bills Payment"]}
          value={watch("serviceType")}
          onChange={(value) => {
            setValue("serviceType", value);
            setValue("details.serviceType", value);
          }}
          // error={errors.serviceType}
        />

        <SelectFieldLayout
          id="details.transactionType"
          label="Transaction Type"
          options={["USDT - NGN", "BTC - NGN", "ETH - NGN"]}
          value={watch("details.transactionType")}
          onChange={(value) => setValue("transactionType", value)}
          // error={errors.transactionType}
        />
      </div>

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.customerAmount"
          label="Customer Amount"
          placeholder="100 USDT"
          register={register}
          // error={errors.customerAmount}
        />

        <SelectFieldLayout
          id="details.vendor"
          label="Vendor"
          options={["Rayah", "Binance", "Kraken"]}
          value={watch("details.vendor")}
          onChange={(value) => setValue("vendor", value)}
          // error={errors.vendor}
        />
      </div>

      {/* Vendor Rate, Xibaka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="details.vendorRate"
          label="Vendor Rate"
          placeholder="1467"
          register={register}
          // error={errors.vendorRate}
        />
        <FormField
          id="details.xbankaRate"
          label="Xbanka Rate"
          placeholder="1467.5"
          register={register}
          // error={errors.xbankaRate}
        />
        <FormField
          id="details.margin"
          label="Margin"
          placeholder="0.5"
          register={register}
          // error={errors.margin}
        />
      </div>

      {/* Expected Payout & Customer Account */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.expectedPayout"
          label="Expected Payout"
          placeholder="₦146,750"
          register={register}
          // error={errors.expectedPayout}
        />
        <FormField
          id="details.customerAccountWallet"
          label="Customer Account / Wallet"
          placeholder="GTB - 0123456789"
          register={register}
          // error={errors.customerAccountWallet}
        />
      </div>

      {/* Xibaka Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.xbankaAccount"
          label="Xbanka Account"
          placeholder="GTB - 0123456789"
          register={register}
          // error={errors.xbankaAccount}
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
        className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11"
      >
        Submit for Verification
      </Button>
    </form>
  );
}
