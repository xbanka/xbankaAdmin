"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  ArrowLeftRight,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CustomerProps } from "@/lib/types/customer";
import { tierImages } from "@/lib/utils/tier-images";
import { formatDate } from "@/lib/formatDate";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type Tab = "profile" | "wallet" | "transactions" | "verification";

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "wallet", label: "Wallet" },
  { key: "transactions", label: "Transactions" },
  { key: "verification", label: "Verification" },
];

type PillTone = "green" | "red" | "yellow" | "gray";

const PILL_TONES: Record<PillTone, string> = {
  green: "bg-[#D1FAE5] text-[#037508]",
  red: "bg-[#FCE6E6] text-[#EF4444]",
  yellow: "bg-[#FFF8D8] text-[#B29504]",
  gray: "bg-gray-100 text-gray-500",
};

function StatusPill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium",
        PILL_TONES[tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function TierBadge({ tier }: { tier: number }) {
  return (
    <Image
      src={tierImages[tier] || "/Tier0.svg"}
      alt={`Tier ${tier}`}
      width={64}
      height={24}
      className="h-6 w-auto"
    />
  );
}

function Field({
  label,
  value,
  children,
  className,
}: {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </span>
      {children ?? (
        <span className="text-[14px] font-medium text-[#111827]">
          {value === 0 || value ? value : "—"}
        </span>
      )}
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
  bodyClassName,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-[#EEF0F2] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F0F0]">
        <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
        {action}
      </div>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}

function StatCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-1 text-center">
      {icon}
      <span className="text-[12px] text-[#6B7280]">{label}</span>
      <span className="text-[18px] font-semibold text-[#111827]">{value}</span>
    </div>
  );
}

/** Maps a KYC status string to a status pill. */
function kycPill(status?: string | null): { label: string; tone: PillTone } {
  const s = (status ?? "").toUpperCase();
  if (s === "APPROVED" || s === "VERIFIED")
    return { label: "Verified", tone: "green" };
  if (s === "PENDING") return { label: "Pending Review", tone: "yellow" };
  if (s === "REJECTED") return { label: "Rejected", tone: "red" };
  return { label: "Not Submitted", tone: "red" };
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-gray-400 hover:text-gray-600"
      title="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--text-teal)]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProps | null;
}

export default function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
}: CustomerDetailModalProps) {
  const [tab, setTab] = useState<Tab>("profile");
  useBodyScrollLock(isOpen);

  if (!isOpen || !customer) return null;

  const tier = customer.tier ?? 0;
  const fullName =
    `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() ||
    "Unknown User";
  const initials =
    `${customer.firstName?.charAt(0) ?? ""}${customer.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
    "U";

  const bvn = customer.kycStatus?.bvnVerified
    ? { label: "Verified", tone: "green" as PillTone }
    : { label: "Not Submitted", tone: "red" as PillTone };
  const idPill = kycPill(customer.kycStatus?.idStatus);
  const addressPill = kycPill(customer.kycStatus?.addressStatus);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* Sidebar drawer */}
      <div className="flex h-full w-full flex-col bg-white shadow-2xl md:w-[640px] animate-in slide-in-from-right duration-200">
        {/* Header (fixed) */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-[#E5E3E3] px-6 py-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#E6FBF7] text-abstractCyan font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#111827]">
                  {fullName}
                </h2>
                <TierBadge tier={tier} />
              </div>
              <div className="mt-1 flex items-center gap-2 text-[13px] text-[#6B7280]">
                <span>UID: {customer.userId?.slice(0, 8) ?? "—"}</span>
                <CopyButton value={customer.userId ?? ""} />
                <span className="text-gray-300">•</span>
                <span>{customer.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs (fixed) */}
        <div className="flex flex-shrink-0 gap-6 border-b border-[#E5E3E3] px-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "-mb-px border-b-2 py-3 text-[14px] font-medium transition-colors",
                tab === t.key
                  ? "border-abstractCyan text-abstractCyan"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-[#F9FAFB] p-6">
          {tab === "profile" && (
            <SectionCard title="Personal Details">
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <Field label="Full name" value={fullName} />
                <Field label="Username" value={null} />
                <Field label="Email Address" value={customer.email} />
                <Field label="Phone number" value={customer.phoneNumber} />
                <Field label="Date of Birth" value={null} />
                <Field label="Gender" value={null} />
                <Field
                  label="Date Joined"
                  value={formatDate(customer.createdAt)}
                />
                <Field label="Last Login" value={null} />
                <Field label="Nationality" value={null} />
                <Field label="Address" value={null} className="sm:col-span-3" />
              </div>
            </SectionCard>
          )}

          {tab === "wallet" && (
            <>
              <SectionCard title="Wallet Summary" bodyClassName="p-0">
                <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] py-4">
                  <StatCell label="Total NGN Balance" value="—" />
                  <StatCell label="Crypto Asset Held" value="—" />
                  <StatCell label="Total Crypto Balance" value="—" />
                </div>
              </SectionCard>

              <SectionCard
                title="NGN Wallet"
                action={<StatusPill label="Inactive" tone="gray" />}
                bodyClassName="p-0"
              >
                <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] py-4">
                  <StatCell label="Available Balance" value="—" />
                  <StatCell label="Wallet ID" value="—" />
                  <StatCell label="Provider" value="—" />
                </div>
              </SectionCard>

              <SectionCard title="Dedicated Funding Account">
                <p className="mb-4 text-[14px] font-medium text-[#111827]">
                  —
                </p>
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                  <Field label="Account Name" value={null} />
                  <Field label="Account Number" value={null} />
                  <Field label="Account Status">
                    <StatusPill label="Inactive" tone="gray" />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Crypto Wallets" bodyClassName="p-0">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#F0F0F0] text-[#9CA3AF]">
                      <th className="px-5 py-3 font-medium">Asset</th>
                      <th className="px-5 py-3 font-medium">Available</th>
                      <th className="px-5 py-3 font-medium">Provider</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-[#9CA3AF]"
                      >
                        No crypto wallets
                      </td>
                    </tr>
                  </tbody>
                </table>
              </SectionCard>
            </>
          )}

          {tab === "transactions" && (
            <SectionCard title="Transaction Summary" bodyClassName="p-0">
              <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] py-4">
                <StatCell
                  label="Total Transactions"
                  value="—"
                  icon={
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6FBF7] text-abstractCyan">
                      <ArrowLeftRight className="h-4 w-4" />
                    </span>
                  }
                />
                <StatCell
                  label="Pending Transactions"
                  value="—"
                  icon={
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8D8] text-[#B29504]">
                      <Clock className="h-4 w-4" />
                    </span>
                  }
                />
                <StatCell
                  label="Failed Transaction"
                  value="—"
                  icon={
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE6E6] text-[#EF4444]">
                      <XCircle className="h-4 w-4" />
                    </span>
                  }
                />
              </div>
            </SectionCard>
          )}

          {tab === "verification" && (
            <>
              <SectionCard title="Verification Summary" bodyClassName="p-0">
                <div className="grid grid-cols-3 gap-4 px-5 py-4">
                  <Field label="Current Tier">
                    <TierBadge tier={tier} />
                  </Field>
                  <Field label="Verification Status">
                    <StatusPill
                      label={tier > 0 ? "Active" : "Inactive"}
                      tone={tier > 0 ? "green" : "gray"}
                    />
                  </Field>
                  <Field label="Date Verified" value={null} />
                </div>
              </SectionCard>

              <SectionCard title="Verification Requirements" bodyClassName="p-0">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#F0F0F0] text-[#9CA3AF]">
                      <th className="px-5 py-3 font-medium">Requirement</th>
                      <th className="px-5 py-3 font-medium">Tier</th>
                      <th className="px-5 py-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {[
                      { name: "BVN Verification", t: 1, pill: bvn },
                      { name: "ID & Liveness Verification", t: 2, pill: idPill },
                      { name: "Proof of Address", t: 3, pill: addressPill },
                    ].map((row) => (
                      <tr key={row.name}>
                        <td className="px-5 py-4 font-medium text-[#111827]">
                          {row.name}
                        </td>
                        <td className="px-5 py-4">
                          <TierBadge tier={row.t} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <StatusPill label={row.pill.label} tone={row.pill.tone} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SectionCard>

              <SectionCard title="Submitted Documents" bodyClassName="p-0">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#F0F0F0] text-[#9CA3AF]">
                      <th className="px-5 py-3 font-medium">Document</th>
                      <th className="px-5 py-3 font-medium">Date Submitted</th>
                      <th className="px-5 py-3 font-medium">Tier</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-[#9CA3AF]"
                      >
                        No documents submitted
                      </td>
                    </tr>
                  </tbody>
                </table>
              </SectionCard>
            </>
          )}
        </div>

        {/* Footer (fixed) */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E3E3] px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="min-w-[120px] bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={onClose} className="min-w-[160px] text-white">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
