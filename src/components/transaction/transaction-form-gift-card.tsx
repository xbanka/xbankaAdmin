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
import { useCreateTransaction } from "@/lib/services/transaction.service";
import { mapTransactionToApiPayload } from "@/lib/mappers/transactionPayload.mapper";
import { calculateMargin } from "@/lib/utils/calculateMargin";

export function GiftCardTransactionForm() {
  const { mutate } = useCreateTransaction();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const onSubmit = (data) => {
    console.log("clicked", data);
    const payload = mapTransactionToApiPayload(data);

    mutate(payload);
    // const parsed = submitTransactionSchema.safeParse(data);

    // if (!parsed.success) {
    //   console.log("parsed error");
    //   console.error(parsed.error.format());
    //   return;
    // }

    // console.log("VALID SUBMISSION:", parsed.data);
  };

  const xbankasRate = watch("details.xbankaRate");
  const vendorRate = watch("details.vendorRate");

  useEffect(() => {
    const margin = calculateMargin(xbankasRate, vendorRate);
    console.log("details.margin:", margin);
    setValue("details.margin", margin, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [xbankasRate, vendorRate, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service Type & Card Type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="serviceType"
          label="Service Type"
          options={["crypto", "gift-card", "bill-payments"]}
          value={watch("serviceType")}
          onChange={(value) => {
            setValue("serviceType", value, {
              shouldValidate: true,
              shouldDirty: true,
            });

            setValue("details.serviceType", value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          error={errors.serviceType}
        />

        <SearchSelectFieldLayout
          id="details.cardType"
          label="Card Type"
          options={GetGiftCards}
          value={watch("details.cardType")}
          onChange={(value) => setValue("details.cardType", value)}
          error={errors.cardType}
        />
      </div>

      {/* Card Face Value & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.cardFaceValue"
          label="Card Face Value"
          placeholder="Enter a card face value"
          register={register}
          error={errors.cardFaceValue}
        />

        <SearchSelectFieldLayout
          id="details.currency"
          label="Currency"
          options={["Dollar (USD)", "Euro (EUR)", "Pound (GBP)"]}
          value={watch("details.currency")}
          onChange={(value) =>
            setValue("details.currency", value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          error={errors.cardType}
        />
      </div>

      {/* Quantity & Rayah */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.quantity"
          label="Quantity"
          placeholder="Enter quantity"
          register={register}
          error={errors.quantity}
        />

        <SearchSelectFieldLayout
          id="details.vendor"
          label="Vendor"
          options={["Rayah", "Direct", "Broker"]}
          value={watch("details.vendor")}
          onChange={(value) => setValue("details.vendor", value)}
          error={errors.cardType}
        />
      </div>

      {/* Vendor, Xbanka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="details.vendorRate"
          label="Vendor Rate"
          placeholder="Enter ventor rate"
          register={register}
          error={errors.vendor}
        />

        <FormField
          id="details.xbankaRate"
          label="Xbanka Rate"
          placeholder="Enter Xbanka Rate"
          register={register}
          error={errors.xbankaRate}
        />

        <FormField
          id="details.margin"
          label="Margin"
          placeholder="Enter Margin"
          register={register}
          readOnly
          error={errors.margin}
        />
      </div>

      {/* Expected Payout & Gift Card Code */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.expectedPayout"
          label="Expected Payout"
          placeholder="Enter expected payout"
          register={register}
          error={errors.expectedPayout}
        />

        <FormField
          id="details.giftCardCode"
          label="Gift Card Code"
          placeholder="Enter gift card code"
          register={register}
          error={errors.giftCardCode}
        />
      </div>

      {/* Customer Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.customerAccountWallet"
          label="Customer Account / Wallet"
          placeholder="Enter customer account"
          register={register}
          error={errors.customerAccountWallet}
        />

        <FormField
          id="details.paymentDate"
          label="Payment Date"
          type="date"
          register={register}
          error={errors.paymentDate}
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
      <Button type="submit" className="w-full">
        Submit for Verification
      </Button>
    </form>
  );
}
