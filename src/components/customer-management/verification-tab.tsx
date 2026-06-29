import {
  CustomerVerificationData,
  UserProfileData,
} from "@/lib/types/customer";
import { DetailField } from "./detail-field";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";
import { TierBadge } from "./tier-badge";
import { VerificationRequirementsBadge, VerificationStatusBadge } from "./verification-status-badge";
import Image from "next/image";
import { tierImages } from "@/lib/utils/tier-images";

export function VerificationTab({
  customer,
}: {
  customer: CustomerVerificationData;
}) {
  const { kycStatus, isActive } = customer;

  const verificationRequirements = [
    {
      requirement: "BVN Verification",
      tier: 1,
      status: kycStatus?.bvnVerified,
    },
    {
      requirement: "ID & Liveness Verification",
      tier: 2,
      status:
        kycStatus?.idStatus === null && false
    },
    {
      requirement: "Proof of Address",
      tier: 3,
      status:
        kycStatus?.addressStatus === null && false
    },
  ];

  // const tier = customer.kycStatus.bvnVerified ?? 0;
  const tier = 1;

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Verification Summary */}
      <div>
        <SectionTitle>Verification Summary</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[var(--text-secondary)]">
                Current Tier
              </p>
              <Image
                src={tierImages[tier] || "/Tier0.svg"}
                alt={`Tier ${tier}`}
                width={67}
                height={24}
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-xs text-[var(--text-secondary)]">
                Verification Status
              </p>
              <VerificationStatusBadge status={isActive} />
            </div>
            <DetailField label="Date Verified" value={"-"} />
          </div>
        </SectionCard>
      </div>

      {/* Verification Requirements */}
      <div>
        <SectionTitle>Verification Requirements</SectionTitle>
        <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--grey-light)] border-b border-[var(--border-default)]">
                <th className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium">
                  Requirement
                </th>
                <th className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium">
                  Tier
                </th>
                <th className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {verificationRequirements.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border-default)] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--text-primary)]">
                    {row.requirement}
                  </td>
                  <td className="px-4 py-3">
                    <Image
                      src={tierImages[row.tier] || "/Tier0.svg"}
                      alt={`Tier ${row.tier}`}
                      width={67}
                      height={24}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <VerificationRequirementsBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submitted Documents */}
      <div>
        <SectionTitle>Submitted Documents</SectionTitle>
        <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--grey-light)] border-b border-[var(--border-default)]">
                {["Document", "Date Submitted", "Tier", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {kycStatus?.idStatus ? (
                <tr className="border-b border-[var(--border-default)] last:border-0">
                  <td className="px-4 py-3 text-[var(--text-primary)]">
                    National ID
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {new Date(customer.updatedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <TierBadge tier={2} />
                  </td>
                  <td className="px-4 py-3">
                    <VerificationStatusBadge status={isActive} />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[var(--text-teal)] hover:underline text-xs">
                      View
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-[var(--text-secondary)]"
                  >
                    No documents submitted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
