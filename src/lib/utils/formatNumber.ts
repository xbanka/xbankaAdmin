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
