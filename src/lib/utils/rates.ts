import { CryptoCurrencyTypes } from "@/lib/types/rates-types";

export function getXBankaRates(row: CryptoCurrencyTypes) {
  const obiexRate = row.obiexRate ?? 0;
  const buySpread = row.segment?.buySpread ?? 0;
  const sellSpread = row.segment?.sellSpread ?? 0;

  return {
    buy: obiexRate + obiexRate * (buySpread / 100),
    sell: obiexRate - obiexRate * (sellSpread / 100),
  };
}
