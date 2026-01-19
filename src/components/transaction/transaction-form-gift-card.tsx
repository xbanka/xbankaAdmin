"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";
import { SearchSelectFieldLayout } from "../layout/SearchableSelectLayout";
import { GetGiftCards } from "@/lib/data";
import {
  useCreateTransaction,
  useUploadTransactionAttachment,
} from "@/lib/services/transaction.service";
import { mapTransactionToApiPayload } from "@/lib/mappers/transactionPayload.mapper";
import { calculateMargin } from "@/lib/utils/calculateMargin";
import { TransactionFormValues } from "@/lib/schema/transaction.schema";
import { ServiceType } from "@/lib/schema/service-type.schema";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";
import { toast } from "sonner";

export function GiftCardTransactionForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { mutate } = useCreateTransaction();
  const { mutate: uploadAttachment } = useUploadTransactionAttachment();

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const hasAttachments = attachments.length > 0;
  
  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<TransactionFormValues>();

  function handleNumericInput(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and optional dot (for decimals)
    const value = e.target.value.replace(/[^0-9.]/g, "");
    e.target.value = value;
  }

  const onSubmit = (data: TransactionFormValues) => {
    if (attachments.length === 0) {
    toast.error("Please upload at least one file");
    return;
  }
    const payload = mapTransactionToApiPayload(data);

    mutate(payload, {
      onSuccess: (response) => {
        const transactionId = response?.data?.transaction?.id;
        if (!transactionId) {
          toast.error("Transaction ID missing from response");
          return;
        }

        attachments.forEach(({ file }) => {
          uploadAttachment({
            transactionId,
            file,
          });
        });
        reset();
        handleClose();
      },
    });
  };

  const xbankasRate = watch("details.xbankaRate");
  const vendorRate = watch("details.vendorRate");

  useEffect(() => {
    const margin = calculateMargin(xbankasRate, vendorRate);
    setValue("details.margin", margin?.toString() ?? "", {
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
            const serviceType = value as ServiceType;

            setValue("serviceType", serviceType, {
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
          error={errors.details?.cardType}
        />
      </div>

      {/* Card Face Value & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.cardFaceValue"
          label="Card Face Value"
          placeholder="Enter a card face value"
          register={register}
          error={errors.details?.cardFaceValue}
          inputProps={{
            onInput: handleNumericInput,
          }}
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
          error={errors.details?.currency}
        />
      </div>

      {/* Quantity & Rayah */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.quantity"
          label="Quantity"
          placeholder="Enter quantity"
          register={register}
          error={errors.details?.quantity}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />

        <SearchSelectFieldLayout
          id="details.vendor"
          label="Vendor"
          options={["Rayah", "Direct", "Broker"]}
          value={watch("details.vendor")}
          onChange={(value) => setValue("details.vendor", value)}
          error={errors.details?.vendor}
        />
      </div>

      {/* Vendor, Xbanka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="details.vendorRate"
          label="Vendor Rate"
          placeholder="Enter ventor rate"
          register={register}
          error={errors.details?.vendorRate}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />

        <FormField
          id="details.xbankaRate"
          label="Xbanka Rate"
          placeholder="Enter Xbanka Rate"
          register={register}
          error={errors.details?.vendorRate}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />

        <FormField
          id="details.margin"
          label="Margin"
          placeholder="Enter Margin"
          register={register}
          readOnly
          error={errors.details?.margin}
        />
      </div>

      {/* Expected Payout & Gift Card Code */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.expectedPayout"
          label="Expected Payout"
          placeholder="Enter expected payout"
          register={register}
          error={errors.details?.expectedPayout}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />

        <FormField
          id="details.giftCardCode"
          label="Gift Card Code"
          placeholder="Enter gift card code"
          register={register}
          error={errors.details?.giftCardCode}
        />
      </div>

      {/* Customer Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="details.customerAccountWallet"
          label="Customer Account / Wallet"
          placeholder="Enter customer account"
          register={register}
          error={errors.details?.customerAccountWallet}
        />

        <FormField
          id="details.paymentDate"
          label="Payment Date"
          type="date"
          register={register}
          error={errors.details?.paymentDate}
        />
      </div>

      {/* Attachments */}
      <div>
        <Label>Attachments</Label>
        <AttachmentUpload value={attachments} onChange={setAttachments} />
        {/* {!hasAttachments && (
          <p className="text-[10px] text-mainRed mt-1">
            At least one attachment is required
          </p>
        )} */}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={!hasAttachments}>
        Submit for Verification
      </Button>
    </form>
  );
}
