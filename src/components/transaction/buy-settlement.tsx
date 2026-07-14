import { File, Trash, Upload } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { useFormContext } from "react-hook-form";
import FormField from "../forms/FormField";
import { CardLayout } from "../ui/card-layout";
import { DateField } from "../ui/date-field";
import { AmountField } from "../forms/AmountField";
import { FilePreview } from "../ui/file-preview";

const PAYMENT_METHODS = ["Bank Transfer"];
const PAYMENT_STATUSES = ["Payment Received", "Pending", "Failed"];
const XBANKA_ACCOUNTS = ["Stanbic Account", "GTB Account", "Zenith Account"];
const DELIVERY_METHODS = ["External Wallet Transfer", "Xbanka Wallet"];
const DELIVERY_ASSETS = ["USDT", "BTC", "ETH"];
const DELIVERY_SOURCES = ["Stanbic Account", "GTB Account", "Zenith Account"];
const DELIVERY_STATUSES = ["Delivered", "Pending", "Failed"];

export function BuySettlement() {
  const { watch, setValue, register } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const paymentMethod = watch("details.paymentMethod") ?? "";
  const paymentStatus = watch("details.paymentStatus") ?? "";
  const receivedInto = watch("details.receivedInto") ?? "";
  const xbankaAccount = watch("details.xbankaAccount") ?? "";
  const deliveryMethod = watch("details.deliveryMethod") ?? "";
  const deliveryNetwork = watch("details.deliveryNetwork") ?? "";
  const deliveryAsset = watch("details.deliveryAsset") ?? "";
  const deliverySource = watch("details.deliverySource") ?? "";
  const deliveryStatus = watch("details.deliveryStatus") ?? "";
  const attachment = watch("details.attachment");
  const customerPays = watch("details.customerPays") ?? "";
  const customerReceivesAmount = watch("details.customerReceives") ?? "";
  const customerReceives = watch("details.customerReceives") ?? "";
  const customerPaysCurrency = watch("details.customerPaysCurrency") ?? "NGN";
  const customerReceivesCurrency =
    watch("details.customerReceivesCurrency") ?? "USDT";

  const isValid = paymentMethod && paymentStatus && deliveryMethod;

  const today = React.useMemo(() => new Date(), []);

  useEffect(() => {
    if (!watch("details.dateReceived")) {
      setValue("details.dateReceived", today.toISOString());
    }

    if (!watch("details.deliveryDate")) {
      setValue("details.deliveryDate", today.toISOString());
    }
  }, [setValue, today, watch]);

  return (
    <div className="flex flex-col gap-4">
      {/* Customer Payment */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Customer Payment
        </h3>
        <CardLayout className="space-y-3">
          <div className="">
            <SelectFieldLayout
              id="details.paymentMethod"
              label="Payment Method"
              options={PAYMENT_METHODS}
              placeholder="Select method"
              value={paymentMethod}
              onChange={(v) => setValue("details.paymentMethod", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AmountField
              id="details.expectedAmount"
              label="Expected Amount"
              value={customerPays}
              readOnly
              currencySymbol={customerPaysCurrency === "NGN" ? "₦" : "$"}
              placeholder="Enter amount"
              inputClassName="pl-6"
            />
            <AmountField
              id="details.amountReceived"
              label="Amount Received"
              value={customerPays}
              placeholder="Enter amount"
              currencySymbol={customerPaysCurrency === "NGN" ? "₦" : "$"}
              inputClassName="pl-6"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.paymentStatus"
              label="Payment Status"
              options={["Payment Received"]}
              placeholder="Select method"
              value={paymentStatus}
              onChange={(v) => setValue("details.paymentStatus", v)}
            />
            <SelectFieldLayout
              id="details.receivedInto"
              label="Received Into"
              options={["Stanbic Account", "GTB Account", "Zenith Account"]}
              placeholder="Select method"
              value={receivedInto}
              onChange={(v) => setValue("details.receivedInto", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="details.paymentReference"
              label="Payment Reference"
              register={register}
              placeholder="GTB-TRF-882910"
            />
            <DateField
              id="details.dateReceived"
              label="Date Received"
              value={today}
              disabled
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
              label="Delivery Method"
              options={DELIVERY_METHODS}
              placeholder="Select method"
              value={deliveryMethod}
              onChange={(v) => setValue("details.deliveryMethod", v)}
            />
            <SelectFieldLayout
              id="details.deliveryAsset"
              label="Asset"
              options={DELIVERY_ASSETS}
              placeholder="Select asset"
              value={deliveryAsset}
              onChange={(v) => setValue("details.deliveryAsset", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AmountField
              id="details.deliveryExpectedAmount"
              label="Expected Amount"
              value={customerReceivesAmount}
              readOnly
              currency={`${customerReceivesCurrency}`}
              placeholder=" 1500.00"
              inputClassName="pl-6"
            />
            <AmountField
              id="details.deliveryAmountReceived"
              label="Amount Received"
              value={customerReceivesAmount}
              placeholder="Enter amount delivered"
              currency={`${customerReceivesCurrency}`}
              inputClassName="pl-6"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.deliveryNetwork"
              label="Network"
              options={["TRC20"]}
              placeholder="Select network"
              value={deliveryNetwork}
              onChange={(v) => setValue("details.deliveryNetwork", v)}
            />
            <SelectFieldLayout
              id="details.deliverySource"
              label="Delivery Source"
              options={DELIVERY_SOURCES}
              placeholder="Select source"
              value={deliverySource}
              onChange={(v) => setValue("details.deliverySource", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="details.deliveryDestination"
              label="Destination"
              placeholder="Enter delivery destination"
              register={register}
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
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="details.deliveryReference"
              label="Delivery Reference"
              register={register}
              placeholder="WAL-CREDIT-00921"
            />
            <DateField
              id="details.deliveryDate"
              label="Delivery Date"
              value={today}
              disabled
            />
          </div>
        </CardLayout>
      </div>

      {/* Attachments */}
      <div className="py-5 border-y border-[#E5E3E3] space-y-2">
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
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border border-dashed h-[104px] border-[var(--grey-border)] rounded-lg py-4 px-12 flex flex-col items-center gap-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--grey-light)] transition"
        >
          <Upload size={24} className="text-secondary-text" />
          <span className="font-normal text-[12px] leading-[16px] text-secondary-text">
            Upload screenshot, receipt, or proof document
          </span>
          <span className="font-normal text-[12px] leading-[16px] text-secondary-text">
            JPG, PNG OR PDF • Max 5MB
          </span>
        </button>
        {attachment && (
          <FilePreview
            fileName={attachment}
            onRemove={() => setValue("details.attachment", null)}
          />
        )}
      </div>
    </div>
  );
}
