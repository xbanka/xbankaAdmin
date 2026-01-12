"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";
import { SearchSelectFieldLayout } from "../layout/SearchableSelectLayout";
import { calculateMargin } from "@/lib/utils/calculateMargin";
import { TransactionFormValues } from "@/lib/schema/transaction.schema";
import { mapTransactionToApiPayload } from "@/lib/mappers/transactionPayload.mapper";
import {
  useCreateTransaction,
  useUploadTransactionAttachment,
} from "@/lib/services/transaction.service";
import { ServiceType } from "@/lib/schema/service-type.schema";
import { toast } from "sonner";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";

export function CryptoTransactionForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { mutate } = useCreateTransaction();
  const { mutate: uploadAttachment } = useUploadTransactionAttachment();

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const {
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext<TransactionFormValues>();

  function handleNumericInput(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and optional dot (for decimals)
    const value = e.target.value.replace(/[^0-9.]/g, "");
    e.target.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log("clicked", data);
    const payload = mapTransactionToApiPayload(data);

    mutate(payload, {
      onSuccess: (response) => {
        console.log("response",response);
        const transactionId = response?.data?.transaction?.id;
        if (!transactionId) {
          toast.error("Transaction ID missing from response");
          console.log("Transaction ID missing from response");
          return;
        }
        console.log(transactionId);

        attachments.forEach(({ file }) => {
          uploadAttachment({
            transactionId,
            file,
          });
        });

        reset();
        setAttachments([]);
        handleClose();
      },
    });

    console.log("VALID SUBMISSION:", data);
  };

  const xbankasRate = watch("details.xbankaRate");
  const vendorRate = watch("details.vendorRate");

  useEffect(() => {
    const margin = calculateMargin(xbankasRate, vendorRate);
    console.log("details.margin:", margin);
    setValue("details.margin", margin?.toString() ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [xbankasRate, vendorRate, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service Type & Transaction Type */}
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
          error={errors?.serviceType}
        />
        <SearchSelectFieldLayout
          id="details.transactionType"
          label="Transaction Type"
          options={[
            "USDT-NGN",
            "BTC-NGN",
            "ETH-NGN",
            "NGN-USDT",
            "NGN-BTC",
            "NGN-ETH",
          ]}
          value={watch("details.transactionType") ?? ""}
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
          error={errors.details?.customerAmount}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />

        <SearchSelectFieldLayout
          id="details.vendor"
          label="Vendor"
          options={["Rayah", "Binance", "Kraken"]}
          value={watch("details.vendor")}
          onChange={(value) => setValue("details.vendor", value)}
          error={errors.details?.vendor}
        />
      </div>

      {/* Vendor Rate, Xibaka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="details.vendorRate"
          label="Vendor Rate"
          placeholder="Enter vendor's rate"
          register={register}
          error={errors.details?.vendorRate}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />
        <FormField
          id="details.xbankaRate"
          label="Xbanka Rate"
          placeholder="Enter xbanka's rate"
          register={register}
          error={errors.details?.xbankaRate}
          inputProps={{
            onInput: handleNumericInput,
          }}
        />
        <FormField
          id="details.margin"
          label="Margin"
          readOnly
          placeholder="Enter margin"
          register={register}
          error={errors.details?.margin}
        />
      </div>

      {/* Expected Payout & Customer Account */}
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
          id="details.customerAccountWallet"
          label="Customer Account / Wallet"
          placeholder="Enter customer account"
          register={register}
          error={errors.details?.customerAccountWallet}
        />
      </div>

      {/* Xibaka Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <SearchSelectFieldLayout
          id="details.xbankaAccount"
          label="Xbanka Account"
          options={["GTB - 0123456789"]}
          value={watch("details.xbankaAccount") ?? ""}
          onChange={(value) =>
            setValue("details.xbankaAccount", value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          error={errors.details?.xbankaAccount}
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
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Submit for Verification
      </Button>
    </form>
  );
}
