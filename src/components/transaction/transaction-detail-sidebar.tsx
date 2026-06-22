// components/transaction/transaction-detail-sidebar.tsx
"use client";

import { X } from "lucide-react";
import { useGetTransactionById } from "@/lib/services/transaction.service";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  transactionId: string | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">{label}</span>
      <span className="text-xs font-medium text-[var(--text-primary)]">{value ?? "—"}</span>
    </div>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">{title}</h4>
        {action}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cls =
    s === "completed" ? "bg-[#D1FAE5] text-[#037508]" :
    s === "failed" ? "bg-[#FCE6E6] text-[#EF4444]" :
    s === "pending" ? "bg-[#FFF8D8] text-[#B29504]" :
    "bg-[#E0F2FE] text-[#0369A1]";
  return (
    <span className={`capitalize px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status?.toLowerCase()}
    </span>
  );
}

export function TransactionDetailSidebar({ transactionId, onClose }: Props) {
  const { data, isPending } = useGetTransactionById(transactionId);

  if (!transactionId) return null;

  const txn = data?.data ?? data; // handle both { data: txn } and plain txn shapes
  const td = txn?.tradeDetails;
  const rm = txn?.rateAndMargin;
  const c = txn?.customer;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full md:w-[38%] bg-white shadow-lg flex flex-col h-full overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border-default)]">
          <div className="flex-1">
            {isPending ? (
              <Skeleton className="h-5 w-40 mb-2" />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {txn?.displayType ?? "Transaction"}
                  </span>
                  {txn?.status && <StatusBadge status={txn.status} />}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{txn?.reference}</p>
                {td?.channelOrigin && (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    • {td.channelOrigin}
                  </p>
                )}
              </>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4">
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
          <div className="flex-1 p-6 flex flex-col gap-6">

            {/* Amount hero */}
            <div className="bg-[var(--grey-light)] rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                    Customer Received
                  </p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">
                    ₦{td?.sourceAmount?.toLocaleString() ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                    Debited
                  </p>
                  <p className="text-base font-semibold text-[var(--text-primary)]">
                    {td?.payoutAmount?.toLocaleString()} {td?.targetCurrency}
                  </p>
                </div>
              </div>
              {txn?.createdAt && (
                <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                  {new Date(txn.createdAt).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              )}
            </div>

            {/* Customer */}
            <Section title="Customer">
              <DetailGrid>
                <DetailRow label="Name" value={c ? `${c.firstName} ${c.lastName}` : null} />
                <DetailRow label="UID" value={c?.id?.slice(0, 8)} />
                <DetailRow label="Phone" value={c?.phoneNumber} />
                <DetailRow label="Username" value={c?.username} />
                <DetailRow label="KYC Tier" value={c?.kycTier != null ? `Tier ${c.kycTier}` : null} />
              </DetailGrid>
            </Section>

            {/* Trade Details */}
            <Section title="Trade Details">
              <DetailGrid>
                <DetailRow
                  label="Trade Pair"
                  value={td ? `${td.sourceCurrency} - ${td.targetCurrency}` : null}
                />
                <DetailRow label="Type" value={txn?.displayType} />
                <DetailRow
                  label="Quantity"
                  value={td?.sourceAmount != null ? `${td.sourceAmount} ${td.sourceCurrency}` : null}
                />
                <DetailRow
                  label="Fiat"
                  value={td?.payoutAmount != null ? `₦${td.payoutAmount?.toLocaleString()}` : null}
                />
              </DetailGrid>
            </Section>

            {/* Rate & Margin */}
            <Section title="Rate & Margin">
              <DetailGrid>
                <DetailRow
                  label="Obiex Rate"
                  value={rm?.obiexRate != null ? `$${rm.obiexRate}` : null}
                />
                <DetailRow
                  label="Xbanka Customer Rate"
                  value={rm?.xbankaCustomerRate != null ? `$${rm.xbankaCustomerRate}` : null}
                />
                <DetailRow label="Spread / Margin" value={rm?.spreadMargin} />
                <DetailRow
                  label="Platform Fee"
                  value={rm?.platformFee != null ? `₦${rm.platformFee}` : null}
                />
              </DetailGrid>
            </Section>

            {/* Settlement */}
            <Section title="Settlement">
              <DetailGrid>
                <DetailRow label="Payment Method" value={td?.paymentMethod} />
                <DetailRow label="Payment Status" value={td?.paymentStatus} />
                <DetailRow label="Delivery Method" value={td?.deliveryMethod} />
                <DetailRow label="Delivery Status" value={td?.deliveryStatus} />
                {td?.channelOrigin && (
                  <DetailRow label="Channel Origin" value={td.channelOrigin} />
                )}
              </DetailGrid>
            </Section>

          </div>
        )}
      </div>
    </div>
  );
}