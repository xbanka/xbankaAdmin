// Nigerian bank logos. The banks endpoint (a Paystack /bank proxy) returns
// codes and names but no artwork, so logos come from this community-maintained
// list and are matched on CBN bank code, then on name.
//
// This is a third-party host with no uptime guarantee — every consumer must
// degrade to the initials badge rather than depend on it. Deliberately uses
// fetch, not AxiosInstance, so no auth headers or API baseURL are applied.
// Ported from the web app's lib/actions/bank-logos.ts.
const BANK_LOGO_SOURCE = "https://nigerianbanks.xyz/";

// The source returns this placeholder for banks it has no artwork for. Initials
// are more useful to the user than a generic grey square.
const PLACEHOLDER_LOGO = "default-image.png";

export interface BankLogoEntry {
  name: string;
  slug: string;
  code: string;
  logo: string;
}

/** Normalises a bank name so lookups survive casing and punctuation drift. */
export const normaliseBankName = (name?: string) =>
  (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/**
 * Builds the logo index: CBN code and normalised name, plus any short name in
 * brackets. Paystack and this list disagree on some codes (OPay is "100004" in
 * one and "999992" in the other), and the full names differ too ("OPay" vs
 * "OPay Digital Services Limited (OPay)"), so the bracketed alias is what
 * lets those still match.
 */
export const indexBankLogos = (banks: BankLogoEntry[]): Map<string, string> => {
  const index = new Map<string, string>();

  banks.forEach((bank) => {
    if (!bank.logo || bank.logo.includes(PLACEHOLDER_LOGO)) return;

    if (bank.code) index.set(bank.code, bank.logo);
    if (bank.name) index.set(normaliseBankName(bank.name), bank.logo);

    const alias = bank.name?.match(/\(([^)]+)\)/)?.[1];
    const aliasKey = normaliseBankName(alias);
    if (aliasKey && !index.has(aliasKey)) index.set(aliasKey, bank.logo);
  });

  return index;
};

export const getBankLogos = async (): Promise<Map<string, string>> => {
  const response = await fetch(BANK_LOGO_SOURCE);

  if (!response.ok) {
    throw new Error(`Bank logo lookup failed: ${response.status}`);
  }

  return indexBankLogos(await response.json());
};
