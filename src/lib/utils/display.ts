export const NA = "N/A";

/** Returns the trimmed value, or "N/A" when it is null, undefined or blank. */
export function orNA(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return NA;
  const str = String(value).trim();
  return str ? str : NA;
}

/** Joins first and last name, skipping missing parts. "N/A" when both are missing. */
export function fullNameOrNA(
  firstName?: string | null,
  lastName?: string | null,
): string {
  return orNA(
    [firstName, lastName]
      .map((p) => p?.trim())
      .filter(Boolean)
      .join(" "),
  );
}

/** "BTC-NGN" style pair. "N/A" replaces any missing side; "N/A" alone when both are missing. */
export function pairOrNA(
  from?: string | null,
  to?: string | null,
): string {
  const a = from?.trim();
  const b = to?.trim();
  if (!a && !b) return NA;
  return `${a || NA}-${b || NA}`;
}

/**
 * Formats an amount with an optional currency, placed before or after the number.
 * "N/A" when the amount is null, undefined or not a finite number. 0 is a real amount.
 */
export function amountOrNA(
  amount: number | string | null | undefined,
  currency?: string | null,
  position: "before" | "after" = "before",
): string {
  if (amount === null || amount === undefined || amount === "") return NA;
  const n = Number(amount);
  if (!Number.isFinite(n)) return NA;
  const formatted = new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
  }).format(n);
  const cur = currency?.trim();
  if (!cur) return formatted;
  return position === "before" ? `${cur} ${formatted}` : `${formatted} ${cur}`;
}
