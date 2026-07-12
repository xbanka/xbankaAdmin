import { Upload } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { useFormContext } from "react-hook-form";
import FormField from "../forms/FormField";
import { CardLayout } from "../ui/card-layout";
import { AmountField } from "../forms/AmountField";
import { DateField } from "../ui/date-field";
import { FilePreview } from "../ui/file-preview";

const PAYMENT_METHODS = ["Bank Transfer"];
const PAYMENT_STATUSES = ["Payment Received", "Pending", "Failed"];
const CRYPTO_NETWORKS = ["TRC20", "ERC20", "BEP20", "Bitcoin Network"];
const XBANKA_ACCOUNTS = ["Stanbic Account", "GTB Account", "Zenith Account"];
const BENEFICIARY_ACCOUNTS = ["GTB Account"];
const DELIVERY_METHODS = ["External Wallet Transfer", "Xbanka Wallet"];
const DELIVERY_ASSETS = ["USDT", "BTC", "ETH"];
const DELIVERY_STATUSES = ["Delivered", "Pending", "Failed"];
const DELIVERY_SOURCES = [
  "Luno Wallet",
  "Rayosh",
  "Obiex",
  "Salmnine",
  "GredoEx",
];

export function SellSettlement() {
  const { watch, setValue, register } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const paymentMethod = watch("details.paymentMethod") ?? "";
  const paymentAsset = watch("details.paymentAsset") ?? "";
  const paymentNetwork = watch("details.paymentNetwork") ?? "";
  const paymentStatus = watch("details.paymentStatus") ?? "";
  const receivedInto = watch("details.receivedInto") ?? "";
  const beneficiaryBank = watch("details.beneficiaryBank") ?? "";
  const xbankaAccount = watch("details.xbankaAccount") ?? "";
  const deliveryMethod = watch("details.deliveryMethod") ?? "";
  const paidFrom = watch("details.paidFrom") ?? "";
  const deliveryAsset = watch("details.deliveryAsset") ?? "";
  const deliverySource = watch("details.deliverySource") ?? "";
  const deliveryStatus = watch("details.deliveryStatus") ?? "";
  const customerPays = watch("details.customerPays") ?? "";
  const customerReceivesAmount = watch("details.customerReceives") ?? "";
  const customerPaysCurrency = watch("details.customerPaysCurrency") ?? "NGN";
  const customerReceivesCurrency =
    watch("details.customerReceivesCurrency") ?? "USDT";
  const attachment = watch("details.attachment");
  const today = React.useMemo(() => new Date(), []);

  const isValid = paymentMethod && paymentStatus && deliveryMethod;

  return (
    <div className="flex flex-col gap-4">
      {/* Customer Payment */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Customer Payment
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
              options={DELIVERY_ASSETS}
              placeholder="Select asset"
              value={paymentAsset}
              onChange={(v) => setValue("details.paymentAsset", v)}
            />
          </div>
          <SelectFieldLayout
            id="details.paymentNetwork"
            label="Network"
            options={CRYPTO_NETWORKS}
            placeholder="Select network"
            value={paymentNetwork}
            onChange={(v) => setValue("details.paymentNetwork", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <AmountField
              id="details.expectedAmount"
              label="Expected Amount"
              currency={`${customerReceivesCurrency}`}
              value={customerPays}
              placeholder="GTB-TRF-882910"
              readOnly
              inputClassName="pl-6"
            />
            <AmountField
              id="details.amountReceived"
              label="Amount Received"
              currency={`${customerReceivesCurrency}`}
              value={customerPays}
              placeholder="GTB-TRF-882910"
              readOnly
              inputClassName="pl-6"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.receivedInto"
              label="Received Into"
              options={XBANKA_ACCOUNTS}
              placeholder="Select account"
              value={receivedInto}
              onChange={(v) => setValue("details.receivedInto", v)}
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
            <FormField
              id="details.transactionHash"
              label="Transaction Hash"
              register={register}
              placeholder="GTB-TRF-882910"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.paymentStatus"
              label="Settlement Status"
              options={DELIVERY_STATUSES}
              placeholder="Select status"
              value={paymentStatus}
              onChange={(v) => setValue("details.paymentStatus", v)}
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
              label="Payment Method"
              options={DELIVERY_METHODS}
              placeholder="Select method"
              value={deliveryMethod}
              onChange={(v) => setValue("details.deliveryMethod", v)}
            />
            <AmountField
              id="details.expectedNgnAmount"
              label="Expected NGN Amount"
              value={customerReceivesAmount}
              placeholder="Enter amount"
              currencySymbol={customerPaysCurrency === "NGN" ? "₦" : "$"}
              inputClassName="pl-6"
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AmountField
              id="details.amountPaid"
              label="Amount Paid"
              value={customerReceivesAmount}
              placeholder="Enter amount"
              currencySymbol={customerPaysCurrency === "NGN" ? "₦" : "$"}
              inputClassName="pl-6"
              readOnly
            />

            <SelectFieldLayout
              id="details.paidFrom"
              label="Paid From"
              options={XBANKA_ACCOUNTS}
              placeholder="Select asset"
              value={paidFrom}
              onChange={(v) => setValue("details.paidFrom", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectFieldLayout
              id="details.beneficiaryBank"
              label="Beneficiary Bank"
              options={BENEFICIARY_ACCOUNTS}
              placeholder="Select asset"
              value={beneficiaryBank}
              onChange={(v) => setValue("details.beneficiaryBank", v)}
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
