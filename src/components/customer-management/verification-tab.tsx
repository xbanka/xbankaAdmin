import {
  CustomerVerificationData,
  UserProfileData,
} from "@/lib/types/customer";
import { DetailField } from "./detail-field";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";
import { TierBadge } from "./tier-badge";
import { VerificationStatusBadge } from "./verification-status-badge";

export function VerificationTab({
  customer,
}: {
  customer: CustomerVerificationData;
}) {
  const { kycStatus } = customer;

  const verificationRequirements = [
    {
      requirement: "BVN Verification",
      tier: 1,
      status: kycStatus?.bvnVerified ? "Verified" : "Not Submitted",
    },
    {
      requirement: "ID & Liveness Verification",
      tier: 2,
      status:
        kycStatus?.idStatus === "APPROVED"
          ? "Verified"
          : kycStatus?.idStatus === "PENDING"
            ? "Pending Review"
            : "Not Submitted",
    },
    {
      requirement: "Proof of Address",
      tier: 3,
      status:
        kycStatus?.addressStatus === "APPROVED"
          ? "Verified"
          : kycStatus?.addressStatus === "PENDING"
            ? "Pending Review"
            : "Not Submitted",
    },
  ];

  // Derive current tier from kycStatus
  const currentTier =
    kycStatus?.addressStatus === "APPROVED"
      ? 3
      : kycStatus?.idStatus === "APPROVED"
        ? 2
        : kycStatus?.bvnVerified
          ? 1
          : 0;

  const overallStatus = currentTier >= 1 ? "Active" : "Inactive";

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
              <TierBadge tier={currentTier} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[var(--text-secondary)]">
                Verification Status
              </p>
              <VerificationStatusBadge status={overallStatus} />
            </div>
            <DetailField
              label="Date Verified"
              value={
                kycStatus?.bvnVerified
                  ? new Date(customer.updatedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : null
              }
            />
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
                    <TierBadge tier={row.tier} />
                  </td>
                  <td className="px-4 py-3">
                    <VerificationStatusBadge status={row.status} />
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
                    <VerificationStatusBadge
                      status={
                        kycStatus.idStatus === "APPROVED"
                          ? "Verified"
                          : kycStatus.idStatus === "PENDING"
                            ? "Pending Review"
                            : "Rejected"
                      }
                    />
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
