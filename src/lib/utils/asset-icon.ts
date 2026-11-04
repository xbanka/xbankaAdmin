// Asset logos come from public CDNs keyed by ticker, so a newly listed
// currency gets an icon with no code change. Sources are tried in order:
// spothq's cryptocurrency-icons (crisp SVGs, older coins) then CoinCap
// (PNG, covers newer coins like TON and PEPE). If every source fails the
// UI falls back to the ticker's initials.
const SPOTHQ_BASE =
  "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color";
const COINCAP_BASE = "https://assets.coincap.io/assets/icons";

export function getAssetIconUrls(currency?: string | null): string[] {
  const symbol = (currency ?? "").trim().toLowerCase();
  if (!/^[a-z0-9]+$/.test(symbol)) return [];
  return [`${SPOTHQ_BASE}/${symbol}.svg`, `${COINCAP_BASE}/${symbol}@2x.png`];
}

export function getAssetInitials(currency?: string | null): string {
  return (currency ?? "").trim().slice(0, 3).toUpperCase() || "?";
}
