// components/transaction/crypto-step-four.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowUpRight, Loader2 } from "lucide-react";
import { useCreateManualTransaction } from "@/lib/services/transaction.service";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <span className="text-xs font-medium text-[var(--text-primary)]">{value}</span>
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
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
          {title}
        </h4>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs text-[var(--text-teal)] hover:underline"
          >
            Edit <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="bg-[var(--grey-light)] rounded-lg p-3 divide-y divide-[var(--border-default)]">
        {children}
      </div>
    </div>
  );
}

export function CryptoStepFour({ onClose, onBack }: Props) {
  const { watch } = useFormContext();
  const d = watch("details");
  const customer = watch("customer");

  const { mutate, isPending } = useCreateManualTransaction();

  // Derived values (same logic as step two)
  const partnerRate = parseFloat(d?.partnerRate ?? 0);
  const xbankaRate = parseFloat(d?.xbankaRate ?? 0);
  const customerPays = parseFloat(d?.customerPays ?? 0);
  const marginPerUnit = isNaN(partnerRate) || isNaN(xbankaRate) ? 0 : xbankaRate - partnerRate;
  const totalMargin = isNaN(customerPays) || isNaN(marginPerUnit) ? 0 : customerPays * marginPerUnit;
  const marginPct = partnerRate > 0 ? ((marginPerUnit / partnerRate) * 100).toFixed(2) + "%" : "0%";

  const handleSubmit = () => {
    const payload = {
      // ── Customer ──
      isNewUser: customer?.isNewUser ?? false,
      ...(customer?.isNewUser && customer?.newUserData
        ? { newUserData: customer.newUserData }
        : { userId: customer?.id }),

      // ── Step 1 ──
      tradeDirection: d?.tradeDirection ?? "",
      // channelOrigin: d?.channelOrigin ?? "",
      // transactionType: d?.transactionType ?? "",

      // ── Step 2 ──
      customerPaysCurrency: d?.customerPaysCurrency ?? "NGN",
      customerPaysAmount: customerPays,
      customerReceivesCurrency: d?.customerReceivesCurrency ?? "USDT",
      customerReceivesAmount: parseFloat(d?.customerReceives ?? 0),
      partner: d?.partner ?? "",
      partnerRate,
      xbankaRate,
      marginPerUsdt: marginPerUnit,
      totalMargin,
      marginPercentage: marginPct,
      internalNotes: d?.internalNotes ?? undefined,

      // ── Step 3 ──
      paymentMethod: d?.paymentMethod ?? "",
      paymentStatus: d?.paymentStatus ?? "",
      paymentReference: d?.paymentReference ?? "",
      receivedInto: d?.xbankaAccount ?? "",
      deliveryMethod: d?.deliveryMethod ?? "",
      deliveryAsset: d?.deliveryAsset ?? "",
      deliverySource: d?.deliverySource ?? "",
      deliveryStatus: d?.deliveryStatus ?? "",
      deliveryReference: d?.deliveryReference ?? "",
      attachmentUrl: d?.attachment ?? undefined,
    };
    console.log("payload:", payload)

    mutate(payload, {
      onSuccess: () => {
        toast.success("Transaction logged successfully");
        onClose();
      },
    });
  };


  return (
    <div className="flex flex-col gap-2">
      {/* Customer info header (read-only) */}
      {customer?.isNewUser && customer?.newUserData && (
        <div className="bg-[var(--teal-light)] border border-[var(--teal-border)] rounded-lg p-3 mb-2">
          <p className="text-xs font-medium text-[var(--teal-text)] mb-1">New Customer</p>
          <p className="text-xs text-[var(--text-primary)]">
            {customer.newUserData.firstName} {customer.newUserData.lastName}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{customer.newUserData.email}</p>
        </div>
      )}

      <SummarySection title="Trade Summary">
        <SummaryRow
          label="Customer Pays"
          value={customerPays ? `${d?.customerPaysCurrency} ${customerPays.toLocaleString()}` : undefined}
        />
        <SummaryRow
          label="Customer Receives"
          value={d?.customerReceives ? `${parseFloat(d.customerReceives).toLocaleString()} ${d?.customerReceivesCurrency}` : undefined}
        />
        <SummaryRow label="Partner Rate" value={partnerRate ? `$${partnerRate} / USDT` : undefined} />
        <SummaryRow label="Xbanka Rate" value={xbankaRate ? `$${xbankaRate} / USDT` : undefined} />
        <SummaryRow label="Partner Cost" value={`₦${(customerPays).toLocaleString()}`} />
        <SummaryRow
          label="Total Margin"
          value={totalMargin ? `₦${totalMargin.toLocaleString()}` : undefined}
        />
      </SummarySection>

      <SummarySection title="Settlement">
        <SummaryRow label="Payment Method" value={d?.paymentMethod} />
        <SummaryRow label="Payment Status" value={d?.paymentStatus} />
        <SummaryRow label="Received Into" value={d?.xbankaAccount} />
        <SummaryRow label="Payment Ref" value={d?.paymentReference} />
        <SummaryRow label="Delivery Method" value={d?.deliveryMethod} />
        <SummaryRow label="Delivery Status" value={d?.deliveryStatus} />
        <SummaryRow label="Delivery Source" value={d?.deliverySource} />
      </SummarySection>

      {d?.attachment && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Proof of Payment</h4>
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