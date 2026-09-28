import { CryptoCurrencyTypes, FeeType } from "@/lib/types/rates-types";
import { fmt } from "@/lib/utils/formatNumber";

export function getEffectiveSpreads(row: CryptoCurrencyTypes) {
  const buySpread = row.buyFeeValue ?? row.segment?.buySpread ?? 0;
  const sellSpread = row.sellFeeValue ?? row.segment?.sellSpread ?? 0;

  return { buySpread, sellSpread };
}

// "Flat Value" fees are a Naira amount, not a percentage. The app now
// writes "FLAT" for those; "FIXED" is the same concept under the enum
// value older rows still carry. Only "PERCENTAGE" reads as a percent.
export function formatFeeDisplay(value: number, feeType: FeeType) {
  return feeType === "PERCENTAGE" ? `${value}%` : fmt(value);
}

export function getXBankaRates(row: CryptoCurrencyTypes) {
  const obiexRate = row.obiexRate ?? 0;
  const buySpread = row.segment?.buySpread ?? 0;
  const sellSpread = row.segment?.sellSpread ?? 0;

  return {
    buy: obiexRate + obiexRate * (buySpread / 100),
    sell: obiexRate - obiexRate * (sellSpread / 100),
  };
}
