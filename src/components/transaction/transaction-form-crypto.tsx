"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { Controller, useController, useFormContext } from "react-hook-form";
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
import { formatNumber, parseNumber } from "@/lib/utils/formatNumber";
import { getTodayDate } from "@/lib/utils/todayDate";

export function CryptoTransactionForm({
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
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    control,
  } = useFormContext<TransactionFormValues>();

  const {
    field: customerAmountField,
    fieldState: { error },
  } = useController({
    name: "details.customerAmount",
    control,
  });

  const rawValue = customerAmountField.value ?? "";

  function handleNumericInput(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and optional dot (for decimals)
    let value = e.target.value;

    // Allow digits + one dot
    value = value.replace(/[^0-9.]/g, "");

    // Prevent multiple dots
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit decimals to 2
    if (parts[1]?.length > 2) {
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    // Limit total digits (excluding dot)
    const digitsOnly = value.replace(".", "");
    if (digitsOnly.length > 12) return;

    e.target.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
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
        setAttachments([]);
        handleClose();
      },
    });
  };

  const xbankasRate = watch("details.xbankaRate");
  const vendorRate = watch("details.vendorRate");
  const transactionType = watch("details.transactionType");
  const customerAmount = watch("details.customerAmount");
  const today = getTodayDate();

  useEffect(() => {
    if (!transactionType || !customerAmount || !xbankasRate) {
      setValue("details.expectedPayout", "");
      return;
    }

    const amount = Number(customerAmount);
    const rate = Number(parseNumber(xbankasRate));

    if (isNaN(amount) || isNaN(rate) || rate === 0) return;

    let payout: number;

    switch (transactionType) {
      case "USDT-NGN":
        payout = amount * rate;
        break;
      case "NGN-USDT":
        payout = amount / rate;
        break;
      default:
        return;
    }

    setValue("details.expectedPayout", formatNumber(payout), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [transactionType, customerAmount, xbankasRate, setValue]);

  useEffect(() => {
    const margin = calculateMargin(xbankasRate, vendorRate);
    setValue("details.margin", margin?.toString() ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [xbankasRate, vendorRate, setValue]);

  useEffect(() => {
    setValue("details.paymentDate", today, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue, today]);

  const paymentDate = watch("details.paymentDate");

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
          error={errors.details?.transactionType}
        />
      </div>

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="details.customerAmount"
          control={control}
          render={({ field }) => {
            const displayValue =
              typeof field.value === "number"
                ? field.value.toLocaleString()
                : "";
            return (
              <FormField
                id="details.customerAmount"
                label="Customer Amount"
                placeholder="Enter customer amount"
                type="text"
                // register={register}
                error={errors.details?.customerAmount}
                value={displayValue}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (!/^\d*$/.test(raw)) return;
                  field.onChange(raw === "" ? 0 : Number(raw));
                }}
              />
            );
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
          readOnly
          error={errors.details?.expectedPayout}
          inputProps={{
            onInput: handleNumericInput,
            onBlur: (e) => {
              const raw = parseNumber(e.target.value);
              setValue("details.expectedPayout", formatNumber(raw), {
                shouldDirty: true,
                shouldValidate: true,
              });
            },
            onFocus: (e) => {
              e.target.value = parseNumber(e.target.value);
            },
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

      {/* Xbanka Account & Payment Date */}
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
          value={paymentDate}
          readOnly
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
