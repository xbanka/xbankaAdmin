// components/transaction/crypto-step-four.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2, FileText } from "lucide-react";
import {
  useCreateManualTransaction,
  useUploadTransactionAttachment,
} from "@/lib/services/transaction.service";
import { toast } from "sonner";
import { AttachmentFile } from "../ui/UploadAttachment";

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
  const { watch, reset } = useFormContext();
  const d = watch("details");
  const customer = watch("customer");
  const attachments: AttachmentFile[] = d?.attachments ?? [];

  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateManualTransaction();
  const { mutate: uploadAttachment, isPending: isUploading } =
    useUploadTransactionAttachment();

  // Derived values (same logic as step two)
  const partnerRate = parseFloat(d?.partnerRate ?? 0);
  const xbankaRate = parseFloat(d?.xbankaRate ?? 0);
  const customerPays = parseFloat(d?.customerPays ?? 0);
  const customerReceives = parseFloat(d?.customerReceives ?? 0);
  const marginPerUnit =
    isNaN(partnerRate) || isNaN(xbankaRate) ? 0 : xbankaRate - partnerRate;
  const totalMargin =
    isNaN(customerReceives) || isNaN(marginPerUnit)
      ? 0
      : customerReceives * marginPerUnit;
  const partnerCost =
    isNaN(customerReceives) || isNaN(partnerRate)
      ? 0
      : customerReceives * partnerRate;
  const marginPct =
    partnerRate > 0 ? ((marginPerUnit / partnerRate) * 100).toFixed(2) + "%" : "0%";

  const paysCurrency = d?.customerPaysCurrency ?? "NGN";
  const receivesCurrency = d?.customerReceivesCurrency ?? "USDT";

  const submitting = isPending || isUploading;

  const handleSubmit = () => {
    const payload = {
      // ── Customer ──
      isNewUser: customer?.isNewUser ?? false,
      ...(customer?.isNewUser && customer?.newUserData
        ? { newUserData: customer.newUserData }
        : { customerId: customer?.id }),

      // ── Step 1 ──
      tradeDirection: d?.tradeDirection ?? "",
      channelOrigin: d?.channelOrigin ?? "",
      transactionType: d?.transactionType ?? "",

      // ── Step 2 ──
      customerPaysCurrency: d?.customerPaysCurrency ?? "NGN",
      customerPaysAmount: customerPays,
      customerReceivesCurrency: d?.customerReceivesCurrency ?? "USDT",
      customerReceivesAmount: customerReceives,
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
    };

    mutate(payload, {
      onSuccess: (response) => {
        // The manual-log endpoint returns the raw API body; the id can live
        // at a couple of shapes depending on the wrapper.
        const transactionId =
          response?.data?.transaction?.id ??
          response?.transaction?.id ??
          response?.data?.id ??
          response?.id;

        const finish = () => {
          toast.success("Transaction logged successfully");
          queryClient.invalidateQueries({ queryKey: ["get-all-transactions"] });
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          reset();
          onClose();
        };

        if (attachments.length > 0 && transactionId) {
          let remaining = attachments.length;
          attachments.forEach(({ file }) => {
            uploadAttachment(
              { transactionId, file },
              {
                onSettled: () => {
                  remaining -= 1;
                  if (remaining === 0) finish();
                },
              }
            );
          });
        } else {
          if (attachments.length > 0 && !transactionId) {
            toast.error("Transaction created, but the receipt could not be attached");
          }
          finish();
        }
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
          value={partnerRate ? `${paysCurrency} ${partnerRate.toLocaleString()} / ${receivesCurrency}` : undefined}
        />
        <SummaryItem
          label="Xbanka Rate"
          value={xbankaRate ? `${paysCurrency} ${xbankaRate.toLocaleString()} / ${receivesCurrency}` : undefined}
        />
        <SummaryItem
          label="Partner Cost"
          value={partnerCost ? `${paysCurrency} ${partnerCost.toLocaleString()}` : undefined}
        />
        <SummaryItem
          label="Total Margin"
          value={totalMargin ? `${paysCurrency} ${totalMargin.toLocaleString()} (${marginPct})` : undefined}
          highlight
        />
      </SummarySection>

      <SummarySection title="Settlement" onEdit={() => goToStep(3)}>
        <SummaryItem label="Payment Method" value={d?.paymentMethod} />
        <SummaryItem label="Payment Status" value={d?.paymentStatus} />
        <SummaryItem label="Received Into" value={d?.xbankaAccount} />
        <SummaryItem label="Payment Ref" value={d?.paymentReference} />
        <SummaryItem label="Delivery Method" value={d?.deliveryMethod} />
        <SummaryItem label="Delivery Status" value={d?.deliveryStatus} />
        <SummaryItem label="Delivery Source" value={d?.deliverySource} full />
      </SummarySection>

      {attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Proof of Payment</h4>
          <div className="flex flex-col gap-2">
            {attachments.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--grey-light)] rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-[var(--text-secondary)] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-primary)] truncate">{item.file.name}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {item.previewUrl && (
                  <a
                    href={item.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[var(--text-teal)] cursor-pointer"
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-[var(--border-default)]">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 bg-[var(--button-primary-bg)] text-white"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
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