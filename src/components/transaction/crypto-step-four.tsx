// components/transaction/crypto-step-four.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowUpRight } from "lucide-react";

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
  const { watch, handleSubmit } = useFormContext();
  const d = watch("details");
  const customer = watch("customer");

  const onSubmit = (data: unknown) => {
    // TODO: call your mutation here, then close
    console.log("Submit transaction", data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <SummarySection title="Trade Summary">
        <SummaryRow label="Customer Pays" value={d?.customerPays ? `₦${d.customerPays}` : undefined} />
        <SummaryRow label="Customer Receives" value={d?.customerReceives ? `${d.customerReceives} ${d?.customerReceivesCurrency ?? ""}` : undefined} />
        <SummaryRow label="Partner Rate" value={d?.partnerRate ? `$${d.partnerRate} / USDT` : undefined} />
        <SummaryRow label="Xbanka Rate" value={d?.xbankaRate ? `$${d.xbankaRate} / USDT` : undefined} />
        <SummaryRow label="Partner" value={d?.partner} />
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
          <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-2">
            Proof of Payment
          </h4>
          <div className="bg-[var(--grey-light)] rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-[var(--text-primary)] truncate">{d.attachment}</span>
            <span className="text-xs text-[var(--text-teal)] cursor-pointer">View</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-[var(--border-default)]">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[var(--button-primary-bg)] text-white"
        >
          Submit Transaction
        </Button>
      </div>
    </form>
  );
}