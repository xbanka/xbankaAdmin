export const formatNGN = (value?: number | null): string => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  const truncated = Math.trunc(amount * 100) / 100;

  return truncated.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};