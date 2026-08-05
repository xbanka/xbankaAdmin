import { CustomerWalletData } from "@/lib/types/customer";
import { ActiveBadge } from "./active-badge";
import { DetailField } from "./detail-field";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";
import { getTotalCryptoBalance } from "@/lib/getCryptoBalance";

interface WalletTabProps {
  wallet: CustomerWalletData;
}

export function WalletTab({ wallet }: WalletTabProps) {
  // Placeholder — no wallet data from UserProfileData yet
  const totalCryptoBalance = getTotalCryptoBalance(wallet?.cryptoAssets ?? []);
  const primaryFiatAsset = wallet?.fiatAssets?.[0];
  const primaryAddress = primaryFiatAsset?.addresses?.[0];
  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Wallet Summary */}
      <div>
        <SectionTitle>Wallet Summary</SectionTitle>
        <div className="grid grid-cols-3 gap-3 bg-card-primary py-4 px-5">
          {[
            { label: "Total NGN Balance", value: wallet?.fiatAssets[0]?.balance },
            { label: "Crypto Asset Held", value: wallet.totalWallets },
            { label: "Total Crypto Balance", value: totalCryptoBalance },
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
            <DetailField label="Available Balance" value={wallet?.fiatAssets[0]?.balance} />
            <DetailField label="Wallet ID" value={wallet.userId} />
            <DetailField label="Provider" value="—" />
          </div>
        </SectionCard>
      </div>

      {/* Dedicated Funding Account */}
      <div>
        <SectionTitle>Dedicated Funding Account</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-3 gap-4">
            <DetailField label="Account Name" value={primaryAddress?.accountName ?? "—"} />
            <DetailField label="Account Number" value={primaryAddress?.accountNumber ?? "—"} />
            <DetailField label="Bank Name" value={primaryAddress?.bankName ?? "—"} />
          </div>
        </SectionCard>
      </div>

      {/* Crypto Wallets */}
      <div>
        <SectionTitle className="bg-card-primary">Crypto Wallets</SectionTitle>
        <div className="border border-[var(--border-default)] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-card-secondary border-b border-card-border-secondary">
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
              {wallet?.cryptoAssets?.length ? (
                wallet?.cryptoAssets?.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-card-border-secondary last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-[var(--text-primary)]">
                      {asset.currency}
                    </td>

                    <td className="px-3 py-3 text-[var(--text-primary)]">
                      {Number(asset.balance).toLocaleString()}
                    </td>

                    <td className="px-3 py-3 text-[var(--text-secondary)]">
                      —
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          asset.addresses.length > 0
                            ? "bg-[#D1FAE5] text-[#037508]"
                            : "bg-[#FFF8D8] text-[#B29504]"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {asset.addresses.length > 0 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right">
                      {asset.addresses.length > 0 ? (
                        <button className="text-text-teal hover:underline">
                          View
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-[var(--text-secondary)]"
                  >
                    No wallet data available
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
