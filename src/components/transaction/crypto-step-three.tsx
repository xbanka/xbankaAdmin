// components/transaction/crypto-step-three.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import FormField from "../forms/FormField";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "USDT Transfer", "Card"];
const PAYMENT_STATUSES = ["Payment Received", "Pending", "Failed"];
const XBANKA_ACCOUNTS = ["Stanbic Account", "GTB Account", "Zenith Account"];
const DELIVERY_METHODS = ["Customer Wallet", "Bank Transfer", "Exchange Wallet"];
const DELIVERY_ASSETS = ["USDT", "BTC", "ETH", "NGN"];
const DELIVERY_SOURCES = ["Luno Wallet", "Binance Wallet", "Quidax Wallet"];
const DELIVERY_STATUSES = ["Delivered", "Pending", "Failed"];

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function CryptoStepThree({ onContinue, onBack }: Props) {
  const { watch, setValue, register } = useFormContext();

  const paymentMethod = watch("details.paymentMethod") ?? "";
  const paymentStatus = watch("details.paymentStatus") ?? "";
  const xbankaAccount = watch("details.xbankaAccount") ?? "";
  const deliveryMethod = watch("details.deliveryMethod") ?? "";
  const deliveryAsset = watch("details.deliveryAsset") ?? "";
  const deliverySource = watch("details.deliverySource") ?? "";
  const deliveryStatus = watch("details.deliveryStatus") ?? "";
  const attachments: AttachmentFile[] = watch("details.attachments") ?? [];

  const isValid = paymentMethod && paymentStatus && deliveryMethod;

  return (
    <div className="flex flex-col gap-4">
      {/* Customer Payment */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Customer Payment
        </h3>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.paymentMethod"
              label="Payment Method"
              options={PAYMENT_METHODS}
              placeholder="Select method"
              value={paymentMethod}
              onChange={(v) => setValue("details.paymentMethod", v)}
            />
            <SelectFieldLayout
              id="details.paymentStatus"
              label="Payment Status"
              options={PAYMENT_STATUSES}
              placeholder="Select status"
              value={paymentStatus}
              onChange={(v) => setValue("details.paymentStatus", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="details.paymentReference"
              label="Payment Reference"
              register={register}
              placeholder="GTB-TRF-882910"
            />
            <SelectFieldLayout
              id="details.xbankaAccount"
              label="Xbanka Account"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={xbankaAccount}
              onChange={(v) => setValue("details.xbankaAccount", v)}
            />
          </div>
        </div>
      </div>

      {/* Xbanka Delivery */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Xbanka Delivery
        </h3>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.deliveryMethod"
              label="Delivery Method"
              options={DELIVERY_METHODS}
              placeholder="Select method"
              value={deliveryMethod}
              onChange={(v) => setValue("details.deliveryMethod", v)}
            />
            <SelectFieldLayout
              id="details.deliveryAsset"
              label="Delivery Asset"
              options={DELIVERY_ASSETS}
              placeholder="Select asset"
              value={deliveryAsset}
              onChange={(v) => setValue("details.deliveryAsset", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.deliverySource"
              label="Delivery Source"
              options={DELIVERY_SOURCES}
              placeholder="Select source"
              value={deliverySource}
              onChange={(v) => setValue("details.deliverySource", v)}
            />
            <SelectFieldLayout
              id="details.deliveryStatus"
              label="Delivery Status"
              options={DELIVERY_STATUSES}
              placeholder="Select status"
              value={deliveryStatus}
              onChange={(v) => setValue("details.deliveryStatus", v)}
            />
          </div>
          <FormField
            id="details.deliveryReference"
            label="Delivery Reference"
            register={register}
            placeholder="WAL-CREDIT-00921"
          />
        </div>
      </div>

      {/* Attachments */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
          Attachments
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-2">
          Include receipt of transaction
        </p>
        <AttachmentUpload
          value={attachments}
          onChange={(files) =>
            setValue("details.attachments", files, { shouldDirty: true })
          }
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-[var(--border-default)] mt-auto">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1 bg-[var(--button-primary-bg)] text-white"
          disabled={!isValid}
          onClick={onContinue}
        >
          Review Transaction
        </Button>
      </div>
    </div>
  );
}