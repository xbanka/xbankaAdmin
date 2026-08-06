import { UserProfileData } from "@/lib/types/customer";
import { DetailField } from "./detail-field";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

export function ProfileTab({ customer }: { customer: UserProfileData }) {
  const dob = customer.dateOfBirth
    ? new Date(customer.dateOfBirth).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;
  const joined = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const fullName =
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="p-6">
      <SectionTitle>Personal Details</SectionTitle>
      <SectionCard>
        <div className="grid grid-cols-3 gap-x-4 gap-y-5">
          <DetailField
            label="Full name"
            value={fullName}
          />
          <DetailField label="Username" value={customer.referralCode ?? "—"} />
          <DetailField label="Email Address" value={customer.email} />
          <DetailField label="Phone number" value={customer.phoneNumber} />
          <DetailField label="Date of Birth" value={dob} />
          <DetailField
            label="Gender"
            value={
              customer.gender
                ? customer.gender.charAt(0).toUpperCase() +
                  customer.gender.slice(1)
                : null
            }
          />
          <DetailField label="Date Joined" value={joined} />
          <DetailField
            label="Last Login"
            value={
              customer.updatedAt
                ? new Date(customer.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null
            }
          />
          <DetailField label="Nationality" value={customer.country} />
        </div>
        {/* Address full-width */}
        <div className="pt-2 border-t border-[var(--border-default)]">
          <DetailField label="Address" value={customer.state ?? "—"} />
        </div>
      </SectionCard>
    </div>
  );
}
