"use client";
 
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useCreateManualTransaction } from "@/lib/services/transaction.service";
import { toast } from "sonner";
 
interface Props {
  onClose: () => void;
  onBack: () => void;
  goToStep: (step: number) => void;
}
 
function SummaryItem({
  label,
  value,
  highlight,
  full,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-[var(--text-teal)]" : "text-[var(--text-primary)]"
        }`}
      >
        {value && value.trim() ? value : "—"}
      </span>
    </div>
  );
}
 
function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--grey-light)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-medium text-[var(--text-teal)] hover:underline"
          >
            Edit <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}
 
export function CryptoStepFour({ onClose, onBack, goToStep }: Props) {
  const { watch } = useFormContext();
  const d = watch("details");
  const customer = watch("customer");
 
  const { mutate, isPending } = useCreateManualTransaction();
 
  const isBuy = d?.tradeDirection === "Buy Crypto";
 
  // Derived values for display only (review screen)
  const partnerRate = parseFloat(d?.partnerRate ?? 0);
  const xbankaRate = parseFloat(d?.xbankaRate ?? 0);
  const customerPays = parseFloat(d?.customerPays ?? 0);
  const customerReceives = parseFloat(d?.customerReceives ?? 0);
  // The crypto leg is whichever side isn't NGN, and margin is always earned on that leg.
  const cryptoAmount = isBuy ? customerReceives : customerPays;
  const marginPerUnit =
    isNaN(partnerRate) || isNaN(xbankaRate) ? 0 : xbankaRate - partnerRate;
  const totalMargin =
    isNaN(cryptoAmount) || isNaN(marginPerUnit) ? 0 : cryptoAmount * marginPerUnit;
  const partnerCost =
    isNaN(cryptoAmount) || isNaN(partnerRate) ? 0 : cryptoAmount * partnerRate;
  const marginPct =
    partnerRate > 0 ? ((marginPerUnit / partnerRate) * 100).toFixed(2) + "%" : "0%";
 
  const paysCurrency = d?.customerPaysCurrency ?? (isBuy ? "NGN" : "USDT");
  const receivesCurrency = d?.customerReceivesCurrency ?? (isBuy ? "USDT" : "NGN");
  const rateUnit = isBuy ? receivesCurrency : paysCurrency;
 
  const handleSubmit = () => {
    const payload = {
      // ── Customer ──
      isNewUser: customer?.isNewUser ?? false,
      ...(customer?.isNewUser && customer?.newUserData
        ? { newUserData: customer.newUserData }
        : { userId: customer?.id }),
 
      // ── Step 1 ──
      tradeDirection: d?.tradeDirection ?? "",
      transactionType: d?.transactionType ?? "",
      channelOrigin: d?.channelOrigin ?? "",
 
      // ── Step 2 ──
      customerPaysCurrency: paysCurrency,
      customerPaysAmount: customerPays,
      customerReceivesCurrency: receivesCurrency,
      customerReceivesAmount: customerReceives,
      partner: d?.partner ?? "",
      partnerRate,
      xbankaRate,
      marginPerUnit,
      totalMargin,
      marginPercentage: marginPct,
      internalNotes: d?.internalNotes ?? undefined,
 
      // ── Step 3: Customer Payment (fiat if Buy, crypto if Sell) ──
      paymentMethod: d?.paymentMethod ?? "",
      paymentStatus: d?.paymentStatus ?? "",
      paymentReference: d?.paymentReference ?? "",
      receivedInto: d?.receivedInto ?? "",
      expectedAmount: d?.expectedAmount ?? undefined,
      amountReceived: d?.amountReceived ?? undefined,
      dateReceived: d?.dateReceived ?? undefined,
      ...(isBuy
        ? {}
        : {
            paymentAsset: d?.paymentAsset ?? "",
            paymentNetwork: d?.paymentNetwork ?? "",
            senderWalletAddress: d?.senderWalletAddress ?? "",
            transactionHash: d?.transactionHash ?? "",
          }),
 
      // ── Step 3: Xbanka Delivery (crypto if Buy, fiat if Sell) ──
      deliveryMethod: d?.deliveryMethod ?? "",
      deliveryStatus: d?.deliveryStatus ?? "",
      deliveryReference: d?.deliveryReference ?? "",
      ...(isBuy
        ? {
            deliveryAsset: d?.deliveryAsset ?? "",
            deliveryNetwork: d?.deliveryNetwork ?? "",
            deliveryExpectedAmount: d?.deliveryExpectedAmount ?? undefined,
            deliveryAmountReceived: d?.deliveryAmountReceived ?? undefined,
            deliverySource: d?.deliverySource ?? "",
          }
        : {
            expectedNgnAmount: d?.expectedNgnAmount ?? undefined,
            amountPaid: d?.amountPaid ?? undefined,
            paidFrom: d?.paidFrom ?? "",
          }),
 
      attachmentUrl: d?.attachment ?? undefined,
    };
    console.log("payload:", payload);
 
    mutate(payload, {
      onSuccess: () => {
        toast.success("Transaction logged successfully");
        onClose();
      },
    });
  };
 
  return (
    <div className="flex flex-col gap-4">
      {/* Customer info header (read-only) */}
      {customer?.isNewUser && customer?.newUserData && (
        <div className="bg-[var(--teal-light)] border border-[var(--teal-border)] rounded-lg p-3">
          <p className="text-xs font-medium text-[var(--teal-text)] mb-1">New Customer</p>
          <p className="text-xs text-[var(--text-primary)]">
            {customer.newUserData.firstName} {customer.newUserData.lastName}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{customer.newUserData.email}</p>
        </div>
      )}
 
      <SummarySection title="Trade Summary" onEdit={() => goToStep(2)}>
        <SummaryItem
          label="Customer Pays"
          value={customerPays ? `${paysCurrency} ${customerPays.toLocaleString()}` : undefined}
        />
        <SummaryItem
          label="Customer Receives"
          value={customerReceives ? `${customerReceives.toLocaleString()} ${receivesCurrency}` : undefined}
        />
        <SummaryItem
          label="Partner Rate"
          value={partnerRate ? `₦${partnerRate.toLocaleString()} / ${rateUnit}` : undefined}
        />
        <SummaryItem
          label="Xbanka Rate"
          value={xbankaRate ? `₦${xbankaRate.toLocaleString()} / ${rateUnit}` : undefined}
        />
        <SummaryItem
          label="Partner Cost"
          value={partnerCost ? `₦${partnerCost.toLocaleString()}` : undefined}
        />
        <SummaryItem
          label="Total Margin"
          value={totalMargin ? `₦${totalMargin.toLocaleString()} (${marginPct})` : undefined}
          highlight
        />
      </SummarySection>
 
      <SummarySection title="Settlement" onEdit={() => goToStep(3)}>
        {isBuy ? (
          <>
            <SummaryItem label="Payment Method" value={d?.paymentMethod} />
            <SummaryItem label="Payment Status" value={d?.paymentStatus} />
            <SummaryItem label="Received Into" value={d?.receivedInto} />
            <SummaryItem label="Payment Ref" value={d?.paymentReference} />
            <SummaryItem label="Delivery Method" value={d?.deliveryMethod} />
            <SummaryItem label="Delivery Status" value={d?.deliveryStatus} />
            <SummaryItem label="Delivery Source" value={d?.deliverySource} full />
          </>
        ) : (
          <>
            <SummaryItem label="Payment Method" value={d?.paymentMethod} />
            <SummaryItem label="Settlement Status" value={d?.paymentStatus} />
            <SummaryItem label="Received Into" value={d?.receivedInto} />
            <SummaryItem label="Payment Ref" value={d?.paymentReference} />
            <SummaryItem label="Sender Wallet Address" value={d?.senderWalletAddress} />
            <SummaryItem label="Transaction Hash" value={d?.transactionHash} />
            <SummaryItem label="Delivery Method" value={d?.deliveryMethod} />
            <SummaryItem label="Delivery Status" value={d?.deliveryStatus} />
            <SummaryItem label="Paid From" value={d?.paidFrom} full />
          </>
        )}
      </SummarySection>
 
      {d?.attachment && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Proof of Payment</h4>
          <div className="bg-[var(--grey-light)] rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-[var(--text-primary)] truncate">{d.attachment}</span>
            <span className="text-xs text-[var(--text-teal)] cursor-pointer">View</span>
          </div>
        </div>
      )}
 
      <div className="flex gap-3 pt-4 border-t border-[var(--border-default)]">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={isPending}>
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 bg-[var(--button-primary-bg)] text-white"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </span>
          ) : (
            "Submit Transaction"
          )}
        </Button>
      </div>
    </div>
  );
}