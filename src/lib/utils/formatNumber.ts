export function formatNumber(value: string | number) {
  if (!value) return "";

  const num = Number(value);
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function parseNumber(value: string) {
  return value.replace(/,/g, "");
}

/**
 * Live thousands-grouping for amount inputs. Unlike formatNumber it does not
 * force decimals, so it preserves partial input (e.g. "12,500." or "12,500.5")
 * while the user is still typing.
 */
export function formatAmountInput(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  // Strip everything except digits and dots, then keep only the first dot.
  let s = String(value).replace(/[^\d.]/g, "");
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  }
  const [intPart, decPart] = s.split(".");
  const grouped = (intPart || "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}

export function fmt(n: number) {
  return "₦" + Math.round(n).toLocaleString();
}