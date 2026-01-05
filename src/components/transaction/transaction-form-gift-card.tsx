"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";
import { SearchSelectFieldLayout } from "../layout/SearchableSelectLayout";
import { GetGiftCards } from "@/lib/data";

export function GiftCardTransactionForm() {
  const { register, setValue, watch, handleSubmit } = useFormContext();

  const onSubmit = () => {};

  return (
    <div onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service Type & Card Type */}
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
          id="details.cardType"
          label="Card Type"
          options={GetGiftCards}
          value={watch("details.cardType")}
          onChange={(value) => setValue("details.cardType", value)}
          // error={errors.cardType}
        />
      </div>

      {/* Card Face Value & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="cardFaceValue"
          label="Card Face Value"
          placeholder="Enter a card face value"
          register={register}
          // error={errors.cardFaceValue}
        />

        <SearchSelectFieldLayout
          id="currency"
          label="Currency"
          options={["Dollar (USD)", "Euro (EUR)", "Pound (GBP)"]}
          value={watch("currency")}
          onChange={(value) => setValue("currency", value)}
          // error={errors.cardType}
        />
      </div>

      {/* Quantity & Rayah */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.quantity"
          label="Quantity"
          placeholder="Enter quantity"
          register={register}
          // error={errors.quantity}
        />

        <SearchSelectFieldLayout
          id="details.vendor"
          label="Vendor"
          options={["Rayah", "Direct", "Broker"]}
          value={watch("details.vendor")}
          onChange={(value) => setValue("details.vendor", value)}
          // error={errors.cardType}
        />
      </div>

      {/* Vendor, Xbanka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="details.vendorRate"
          label="Vendor Rate"
          placeholder="Enter ventor rate"
          register={register}
          // error={errors.vendor}
        />

        <FormField
          id="details.xbankaRate"
          label="Xbanka Rate"
          placeholder="Enter Xbanka Rate"
          register={register}
          // error={errors.xbankaRate}
        />

        <FormField
          id="details.margin"
          label="Margin"
          placeholder="Enter Margin"
          register={register}
          // error={errors.margin}
        />
      </div>

      {/* Expected Payout & Gift Card Code */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.expectedPayout"
          label="Expected Payout"
          placeholder="Enter expected payout"
          register={register}
          // error={errors.expectedPayout}
        />

        <FormField
          id="details.giftCardCode"
          label="Gift Card Code"
          placeholder="Enter gift card code"
          register={register}
          // error={errors.giftCardCode}
        />
      </div>

      {/* Customer Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <SearchSelectFieldLayout
          id="details.customerAccountWallet"
          label="Customer Account / Wallet"
          options={["GTB - 0123456789"]}
          value={watch("details.customerAccountWallet")}
          onChange={(value) => setValue("details.customerAccountWallet", value)}
          // error={errors.cardType}
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
      <Button className="w-full">Submit for Verification</Button>
    </div>
  );
}
