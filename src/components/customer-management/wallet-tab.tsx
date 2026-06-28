import { CustomerWalletData } from "@/lib/types/customer";
import { ActiveBadge } from "./active-badge";
import { DetailField } from "./detail-field";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

interface WalletTabProps {
  wallet: CustomerWalletData;
}

export function WalletTab({ wallet }: WalletTabProps) {
  // Placeholder — no wallet data from UserProfileData yet
  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Wallet Summary */}
      <div>
        <SectionTitle>Wallet Summary</SectionTitle>
        <div className="grid grid-cols-3 gap-3 bg-card-primary py-4 px-5">
          {[
            { label: "Total NGN Balance", value: "—" },
            { label: "Crypto Asset Held", value: "—" },
            { label: "Total Crypto Balance", value: "—" },
          ].map((s) => (
            <DetailField key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      {/* NGN Wallet */}
      <div>
        <SectionTitle>
          <div className="flex items-center gap-2">
          NGN Wallet <ActiveBadge active={true} />
          </div>
        </SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-3 gap-4">
            <DetailField label="Available Balance" value="—" />
            <DetailField label="Wallet ID" value="—" />
            <DetailField label="Provider" value="—" />
          </div>
        </SectionCard>
      </div>

      {/* Dedicated Funding Account */}
      <div>
        <SectionTitle>Dedicated Funding Account</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-3 gap-4">
            <DetailField label="Account Name" value="—" />
            <DetailField label="Account Number" value="—" />
            <DetailField label="Account Status" value="—" />
          </div>
        </SectionCard>
      </div>

      {/* Crypto Wallets */}
      <div>
        <SectionTitle>Crypto Wallets</SectionTitle>
        <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--grey-light)] border-b border-[var(--border-default)]">
                {["Asset", "Available", "Provider", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-[var(--text-secondary)] font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-[var(--text-secondary)]"
                >
                  No wallet data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
