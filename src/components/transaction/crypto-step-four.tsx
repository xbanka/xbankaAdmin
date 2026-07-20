"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useCreateManualTransaction } from "@/lib/services/transaction.service";
import { toast } from "sonner";
import { FilePreview } from "../ui/file-preview";

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
    <div className="">
      <div className="bg-card-secondary border-x border-t border-card-border-secondary flex items-center justify-between rounded-tl-[20px] rounded-tr-[20px] py-3 px-5">
        <h4 className="text-sm font-medium leading-5 text-text-primary">
          {title}
        </h4>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-medium text-text-teal hover:underline"
          >
            Edit <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="bg-card-primary border border-card-border-secondary rounded-bl-[20px] rounded-br-[20px] py-4 px-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
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
  const marginPerUsdt =
    isNaN(partnerRate) || isNaN(xbankaRate) ? 0 : xbankaRate - partnerRate;

  const grossMargin =
    isNaN(cryptoAmount) || isNaN(marginPerUsdt)
      ? 0
      : cryptoAmount * marginPerUsdt;

  const partnerCost =
    isNaN(cryptoAmount) || isNaN(partnerRate) ? 0 : cryptoAmount * partnerRate;

  const marginPercentage =
    partnerRate > 0
      ? Number(((marginPerUsdt / partnerRate) * 100).toFixed(2))
      : 0;

  const paysCurrency = d?.customerPaysCurrency ?? (isBuy ? "NGN" : "USDT");
  const receivesCurrency =
    d?.customerReceivesCurrency ?? (isBuy ? "USDT" : "NGN");
  const rateUnit = isBuy ? receivesCurrency : paysCurrency;

  const handleSubmit = () => {
    const payload = {
      ...(customer?.isNewUser !== undefined && {
        isNewUser: customer.isNewUser,
      }),

      ...(customer?.isNewUser
        ? {
            newUserData: {
              firstName: customer.newUserData?.firstName,
              lastName: customer.newUserData?.lastName,
              email: customer.newUserData?.email,
              phoneNumber: customer.newUserData?.phoneNumber,

              // TODO: replace with uploaded file URLs after upload
              kycDocuments:
                customer.newUserData?.kycDocuments?.map(
                  (file: File) => file.name,
                ) ?? [],
            },
          }
        : { userId: customer?.id }),

      tradeDirection: isBuy ? "BUY" : "SELL",

      customerPaysCurrency: paysCurrency,
      customerPaysAmount: customerPays,

      customerReceivesCurrency: receivesCurrency,
      customerReceivesAmount: customerReceives,

      partner: d.partner,
      partnerRate,
      xbankaRate,

      partnerCost,
      marginPerUsdt,
      grossMargin,
      marginPercentage,

      internalNotes: d.internalNotes,

      // Customer Payment
      paymentMethod: d.paymentMethod,
      paymentStatus: d.paymentStatus,
      paymentReference: d.paymentReference,
      expectedAmount: Number(d.expectedAmount),
      amountReceived: Number(d.amountReceived),
      receivedInto: d.receivedInto,
      dateReceived: d.dateReceived,

      ...(isBuy
        ? {}
        : {
            asset: d.paymentAsset,
            network: d.paymentNetwork,
            senderWalletAddress: d.senderWalletAddress,
            transactionHash: d.transactionHash,
          }),

      // Delivery
      deliveryMethod: d.deliveryMethod,
      deliveryStatus: d.deliveryStatus,
      deliverySource: d.deliverySource,

      expectedDeliveryAmount: Number(d.expectedDeliveryAmount),
      amountDelivered: Number(d.amountDelivered),

      ...(isBuy
        ? {
            deliveryAsset: d.deliveryAsset,
            network: d.deliveryNetwork,
          }
        : {}),

      attachmentUrl: d.attachment,
    };

    console.log(payload);

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
          <p className="text-xs font-medium text-[var(--teal-text)] mb-1">
            New Customer
          </p>
          <p className="text-xs text-[var(--text-primary)]">
            {customer.newUserData.firstName} {customer.newUserData.lastName}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {customer.newUserData.email}
          </p>
        </div>
      )}

      <div>
        {isBuy ? (
          <div className="space-y-4">
            <SummarySection title="Trade Summary" onEdit={() => goToStep(2)}>
              <SummaryItem
                label="Customer Pays"
                value={
                  customerPays
                    ? `${paysCurrency} ${customerPays.toLocaleString()}`
                    : undefined
                }
              />
              <SummaryItem
                label="Customer Receives"
                value={
                  customerReceives
                    ? `${customerReceives.toLocaleString()} ${receivesCurrency}`
                    : undefined
                }
              />
              <SummaryItem
                label="Partner Rate"
                value={
                  partnerRate
                    ? `₦${partnerRate.toLocaleString()} / ${rateUnit}`
                    : undefined
                }
              />
              <SummaryItem
                label="Xbanka Rate"
                value={
                  xbankaRate
                    ? `₦${xbankaRate.toLocaleString()} / ${rateUnit}`
                    : undefined
                }
              />
              <SummaryItem
                label="Partner Cost"
                value={
                  partnerCost ? `₦${partnerCost.toLocaleString()}` : undefined
                }
              />
              <SummaryItem
                label="Total Margin"
                value={
                  d.totalMargin
                    ? `₦${d.totalMargin.toLocaleString()} (${d.marginPct})`
                    : undefined
                }
                highlight
              />
            </SummarySection>

            <SummarySection title="Settlement" onEdit={() => goToStep(3)}>
              <SummaryItem label="Payment Method" value={d.paymentMethod} />

              <SummaryItem label="Payment Status" value={d.paymentStatus} />

              <SummaryItem label="Received Into" value={d.receivedInto} />

              <SummaryItem label="Payment Ref" value={d.paymentReference} />

              <SummaryItem label="Delivery Method" value={d.deliveryMethod} />

              <SummaryItem label="Delivery Status" value={d.deliveryStatus} />

              <SummaryItem label="Delivery Source" value={d.deliverySource} />
            </SummarySection>
          </div>
        ) : (
          <div className="space-y-4">
            <SummarySection title="Customer Payment" onEdit={() => goToStep(3)}>
              <SummaryItem label="Payment Method" value={d.paymentMethod} />
              <SummaryItem label="Asset" value={d.paymentAsset} />
              <SummaryItem label="Network" value={d.paymentNetwork} />
              <SummaryItem label="Expected Amount" value={d.expectedAmount} />
              <SummaryItem label="Amount Received" value={d.amountReceived} />
              <SummaryItem label="Received Into" value={d.receivedInto} />
              <SummaryItem
                label="Payment Reference"
                value={d.paymentReference}
              />
              <SummaryItem
                label="Sender Wallet"
                value={d.senderWalletAddress}
                full
              />
              <SummaryItem
                label="Transaction Hash"
                value={d.transactionHash}
                full
              />
              <SummaryItem label="Payment Status" value={d.paymentStatus} />
              <SummaryItem label="Date Received" value={d.dateReceived} />
            </SummarySection>

            <SummarySection title="Xbanka Delivery" onEdit={() => goToStep(3)}>
              <SummaryItem label="Payment Method" value={d.deliveryMethod} />
              <SummaryItem
                label="Expected NGN"
                value={d.expectedDeliveryAmount}
              />
              <SummaryItem label="Amount Paid" value={d.amountDelivered} />
              <SummaryItem label="Paid From" value={d.deliverySource} />
              <SummaryItem label="Payment Status" value={d.deliveryStatus} />
            </SummarySection>
          </div>
        )}
      </div>

      {d?.attachment && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
            Proof of Payment
          </h4>
          <FilePreview fileName={d.attachment} btnClass="" />
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-[var(--border-default)]">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
        >
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
