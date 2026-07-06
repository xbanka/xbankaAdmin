// components/transaction/transaction-detail-sidebar.tsx
"use client";

import { useState } from "react";
import { X, Copy, Check, ArrowUpRight } from "lucide-react";
import { useGetTransactionById } from "@/lib/services/transaction.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ManualTradeTransaction } from "./transaction-data";
import { useCustomerSidebarStore } from "@/store/customer-sidebar-store";

interface Props {
  transactionId: string | null;
  onClose: () => void;
}

function Field({
  label,
  value,
  children,
  full,
}: {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
      <span className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">
        {label}
      </span>
      {children ?? (
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {value === 0 || value ? value : "—"}
        </span>
      )}
    </div>
  );
}

function InfoCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--border-default)] rounded-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--grey-light)] border-b border-[var(--border-default)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </h4>
        {action}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4">{children}</div>
    </div>
  );
}

function ActionLink({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-medium text-[var(--text-teal)] hover:underline"
    >
      {label} <ArrowUpRight className="h-3.5 w-3.5" />
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cls =
    s === "completed" || s === "successful"
      ? "bg-[#D1FAE5] text-[#037508]"
      : s === "failed"
        ? "bg-[#FCE6E6] text-[#EF4444]"
        : s === "pending" || s === "processing"
          ? "bg-[#FFF8D8] text-[#B29504]"
          : "bg-[#E0F2FE] text-[#0369A1]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 capitalize px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s}
    </span>
  );
}

export function TransactionDetailSidebar({ transactionId, onClose }: Props) {
  const { data, isPending } = useGetTransactionById(transactionId);
  const [copied, setCopied] = useState(false);
  const { openCustomer } = useCustomerSidebarStore();

  useBodyScrollLock(!!transactionId);

  if (!transactionId) return null;

  const txn: ManualTradeTransaction = data?.data ?? data; // handle both { data: txn } and plain txn shapes
  console.log("txn", txn);
  const profile = txn?.user?.profile;
  // const tier = item.customer.kycTier ?? 0;
  const customerName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || null
    : null;

  const handleCopy = () => {
    if (!txn?.reference) return;
    navigator.clipboard?.writeText(txn.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dateTime = txn?.createdAt
    ? new Date(txn.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const heroAmount =
    txn?.amount != null
      ? `${txn.currency ?? ""} ${txn.amount.toLocaleString()}`.trim()
      : "—";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full md:w-[42%] bg-white shadow-lg flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex-1 min-w-0">
            {isPending ? (
              <Skeleton className="h-5 w-40 mb-2" />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold text-[var(--text-primary)]">
                    {txn?.type ?? "Transaction"}
                  </span>
                  {txn?.status && <StatusBadge status={txn.status} />}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[var(--text-secondary)] truncate">
                    {txn?.reference ?? "—"}
                  </span>
                  {txn?.reference && (
                    <button
                      onClick={handleCopy}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="Copy reference"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-[var(--text-teal)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isPending ? (
          <div className="p-6 flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {/* Amount hero */}
            <div className="border border-[var(--border-default)] border-l-4 border-l-[var(--text-teal)] rounded-xl p-5">
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                  {txn?.type?.toLowerCase().includes("credit") ||
                  txn?.type?.toLowerCase().includes("deposit")
                    ? "Amount Credited"
                    : "Customer Received"}
                </p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {heroAmount}
                </p>
                {dateTime && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {dateTime}
                  </p>
                )}
              </div>

              <div className="border-t border-[var(--border-default)] mt-4 pt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Direction" value={txn?.type} />
                <Field label="Asset" value={txn?.currency} />
              </div>
            </div>

            {/* Customer */}
            <InfoCard
              title="Customer"
              action={
                <ActionLink
                  label="View customer profile"
                  onClick={() => {
                    if (txn?.userId) {
                      openCustomer(txn.userId);
                      onClose()
                    }
                  }}
                />
              }
            >
              <Field label="Name" value={customerName} />
              <Field label="UID" value={txn?.userId?.slice(0, 8)} />
              <Field label="Phone" value={profile?.phoneNumber} />
              <Field label="Email" value={txn?.user?.email} />
              <Field label="KYC Tier">
                {/* <Image
                  src={tierImages[tier] || "/Tier0.svg"}
                  alt={`Tier ${tier}`}
                  width={67}
                  height={24}
                /> */}
              </Field>
            </InfoCard>

            {/* Trade Details */}
            <InfoCard title="Trade Details">
              <Field
                label="Trade Pair"
                value={
                  txn?.currency ? `${txn.currency} → ${txn.currency}` : null
                }
              />
              <Field label="Type" value={txn?.type} />
              <Field
                label="Quantity"
                value={
                  txn?.amount != null
                    ? `${txn.amount.toLocaleString()} ${txn.currency ?? ""}`.trim()
                    : null
                }
              />
              <Field
                label="Fiat"
                value={
                  txn?.amount != null ? `₦${txn.amount.toLocaleString()}` : null
                }
              />
            </InfoCard>

            {/* Settlement */}
            <InfoCard title="Settlement">
              <Field label="Payment Status" value={txn?.status} />
              <Field label="Delivery Status" value={txn?.status} />
            </InfoCard>

            {txn?.note && (
              <InfoCard title="Notes">
                <Field label="Internal Note" value={txn.note} full />
              </InfoCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
