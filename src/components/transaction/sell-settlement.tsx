import { Upload } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { useFormContext } from "react-hook-form";
import FormField from "../forms/FormField";
import { CardLayout } from "../ui/card-layout";

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "USDT Transfer", "Card"];
const PAYMENT_STATUSES = ["Payment Received", "Pending", "Failed"];
const XBANKA_ACCOUNTS = ["Stanbic Account", "GTB Account", "Zenith Account"];
const DELIVERY_METHODS = [
  "Customer Wallet",
  "Bank Transfer",
  "Exchange Wallet",
];
const DELIVERY_ASSETS = ["USDT", "BTC", "ETH", "NGN"];
const DELIVERY_SOURCES = ["Luno Wallet", "Binance Wallet", "Quidax Wallet"];
const DELIVERY_STATUSES = ["Delivered", "Pending", "Failed"];

export function SellSettlement() {
  const { watch, setValue, register } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const paymentMethod = watch("details.paymentMethod") ?? "";
  const paymentStatus = watch("details.paymentStatus") ?? "";
  const xbankaAccount = watch("details.xbankaAccount") ?? "";
  const deliveryMethod = watch("details.deliveryMethod") ?? "";
  const deliveryAsset = watch("details.deliveryAsset") ?? "";
  const deliverySource = watch("details.deliverySource") ?? "";
  const deliveryStatus = watch("details.deliveryStatus") ?? "";
  const attachment = watch("details.attachment");

  const isValid = paymentMethod && paymentStatus && deliveryMethod;

  return (
    <div className="flex flex-col gap-4">
      {/* Customer Payment */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Customer Payment sell
        </h3>
        <CardLayout className="space-y-3">
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
              id="details.paymentAsset"
              label="Asset"
              options={PAYMENT_STATUSES}
              placeholder="Select status"
              value={paymentStatus}
              onChange={(v) => setValue("details.paymentStatus", v)}
            />
          </div>
          <SelectFieldLayout
            id="details.paymentNetwork"
            label="Network"
            options={PAYMENT_STATUSES}
            placeholder="Select status"
            value={paymentStatus}
            onChange={(v) => setValue("details.paymentStatus", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
             id="details.expectedAmount"
              label="Expected Amount"
              register={register}
              placeholder="GTB-TRF-882910"
            />
            <SelectFieldLayout
              id="details.amountReceived"
              label="Amount Received"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={xbankaAccount}
              onChange={(v) => setValue("details.xbankaAccount", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.receivedInto"
              label="Received Into"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={xbankaAccount}
              onChange={(v) => setValue("details.xbankaAccount", v)}
            />
            <FormField
              id="details.paymentReference"
              label="Payment Reference"
              register={register}
              placeholder="GTB-TRF-882910"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="details.senderWalletAddress"
              label="Sender Wallet Address"
              register={register}
              placeholder="GTB-TRF-882910"
            />
            <SelectFieldLayout
              id="details.transactionHash"
              label="Transaction Hash"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={xbankaAccount}
              onChange={(v) => setValue("details.xbankaAccount", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.paymentStatus"
              label="Settlement Status"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={xbankaAccount}
              onChange={(v) => setValue("details.xbankaAccount", v)}
            />
            <SelectFieldLayout
              id="details.dateReceived"
              label="Date Received"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={xbankaAccount}
              onChange={(v) => setValue("details.xbankaAccount", v)}
            />
          </div>
        </CardLayout>
      </div>

      {/* Xbanka Delivery */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Xbanka Delivery
        </h3>
        <CardLayout className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.deliveryMethod"
              label="Payment Method"
              options={DELIVERY_METHODS}
              placeholder="Select method"
              value={deliveryMethod}
              onChange={(v) => setValue("details.deliveryMethod", v)}
            />
            <SelectFieldLayout
              id="details.expectedNgnAmount"
              label="Expected NGN Amount"
              options={DELIVERY_ASSETS}
              placeholder="Select asset"
              value={deliveryAsset}
              onChange={(v) => setValue("details.deliveryAsset", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
               id="details.amountPaid"
              label="Amount Paid"
              register={register}
              placeholder="WAL-CREDIT-00921"
            />
            <SelectFieldLayout
              id="details.paidFrom"
              label="Paid From"
              options={DELIVERY_ASSETS}
              placeholder="Select asset"
              value={deliveryAsset}
              onChange={(v) => setValue("details.deliveryAsset", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
             id="details.beneficiaryBank"
              label="Beneficiary Bank"
              register={register}
              placeholder="WAL-CREDIT-00921"
            />
            <FormField
              id="details.accountName"
              label="Account Name"
              register={register}
              placeholder="WAL-CREDIT-00921"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="details.accountNumber"
              label="Account Number"
              register={register}
              placeholder="WAL-CREDIT-00921"
            />
              <SelectFieldLayout
                id="details.deliveryStatus"
                label="Payment Status"
                options={DELIVERY_SOURCES}
                placeholder="Select source"
                value={deliverySource}
                onChange={(v) => setValue("details.deliverySource", v)}
              />
          </div>
          <div className="grid grid-cols-2 gap-3">
           <FormField
              id="details.deliveryReference"
              label="Delivery Reference"
              register={register}
              placeholder="WAL-CREDIT-00921"
            />
            <SelectFieldLayout
              id="details.deliveryDate"
              label="Date Received"
              options={DELIVERY_STATUSES}
              placeholder="Select status"
              value={deliveryStatus}
              onChange={(v) => setValue("details.deliveryStatus", v)}
            />
          </div>
        </CardLayout>
      </div>

      {/* Attachments */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
          Attachments
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-2">
          Include receipt of transaction
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.png,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("details.attachment", file.name);
          }}
        />
        {attachment ? (
          <div className="flex items-center gap-2 p-2 rounded border border-[var(--border-default)] bg-[var(--grey-light)] text-xs">
            <span className="flex-1 truncate text-[var(--text-primary)]">
              {attachment}
            </span>
            <button
              type="button"
              className="text-[var(--text-secondary)] hover:text-[var(--mainRed)]"
              onClick={() => setValue("details.attachment", null)}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-[var(--grey-border)] rounded-lg p-6 flex flex-col items-center gap-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--grey-light)] transition"
          >
            <Upload className="h-5 w-5" />
            <span>JPG, PNG OR PDF • Max 5MB</span>
          </button>
        )}
      </div>
    </div>
  );
}
