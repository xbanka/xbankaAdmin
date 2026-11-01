import {
  AssetSegment,
  CryptoCurrencyTypes,
  FeeType,
} from "@/lib/types/rates-types";
import { fmt } from "@/lib/utils/formatNumber";

type SpreadSource = Pick<
  AssetSegment,
  "buySpread" | "sellSpread" | "buyFeeType" | "sellFeeType"
>;

// Same rule as main/staging: the asset's own fee wins, including 0, so an
// edit to 0% shows as 0%. The segment spread is only the fallback when the
// asset fee is missing. The fee type always travels with the value it
// labels, so the table and the edit modal agree on % vs Naira.
function resolveSide(
  assetValue: number | null | undefined,
  assetType: FeeType | undefined,
  segmentValue: number | undefined,
  segmentType: FeeType | undefined,
) {
  return assetValue != null
    ? { value: assetValue, type: assetType ?? "PERCENTAGE" }
    : { value: segmentValue ?? 0, type: segmentType ?? "PERCENTAGE" };
}

// The spread a row shows on the dashboard, with its fee type. `segment`
// defaults to the row's own; segments/all nests assets without it, so callers
// there pass the parent segment.
export function getEffectiveSpreads(
  row: CryptoCurrencyTypes,
  segment: Partial<SpreadSource> | null | undefined = row.segment,
) {
  const buy = resolveSide(
    row.buyFeeValue,
    row.buyFeeType,
    segment?.buySpread,
    segment?.buyFeeType,
  );
  const sell = resolveSide(
    row.sellFeeValue,
    row.sellFeeType,
    segment?.sellSpread,
    segment?.sellFeeType,
  );
  return {
    buySpread: buy.value,
    sellSpread: sell.value,
    buyFeeType: buy.type,
    sellFeeType: sell.type,
  };
}

type CryptoRatesPayload = {
  initial?: boolean;
  items?: CryptoCurrencyTypes[];
};

// GET /api/rates/crypto/all returns { initial, items }. The backend sets
// initial to true until a spread schedule has been set up, which is when the
// dashboard shows "No spread schedule configured yet". Any other value means
// the schedule exists and items are shown as they come back, unfiltered.
export function parseCryptoRates(
  data: CryptoRatesPayload | null | undefined,
): { initial: boolean; items: CryptoCurrencyTypes[] } {
  return {
    initial: data?.initial === true,
    items: Array.isArray(data?.items) ? data.items : [],
  };
}

// A save that needs a second approver comes back as a pending proposal. Only
// an explicit pending signal counts, so a plain success is never mislabelled.
export function isChangePendingApproval(
  response: { message?: string; proposed_change?: { status?: string } } | undefined,
) {
  if (response?.proposed_change?.status) {
    return response.proposed_change.status === "PENDING";
  }
  const message = (response?.message ?? "").toLowerCase();
  return message.includes("pending") || message.includes("approval");
}

// "Flat Value" fees are a Naira amount, not a percentage. The app now
// writes "FLAT" for those; "FIXED" is the same concept under the enum
// value older rows still carry. Only "PERCENTAGE" reads as a percent.
export function formatFeeDisplay(value: number, feeType: FeeType) {
  return feeType === "PERCENTAGE" ? `${value}%` : fmt(value);
}

// The Obiex buy and sell rates the edit modal previews against. crypto/all
// sends them as obiexValueBuyRate / obiexValueSellRate; a row without one
// falls back to obiexRate so the preview never drops to 0 by mistake.
export function getObiexRates(row: CryptoCurrencyTypes) {
  const reference = row.obiexRate ?? 0;
  return {
    buy: row.obiexValueBuyRate ?? reference,
    sell: row.obiexValueSellRate ?? reference,
  };
}

type ResolvedSpreads = ReturnType<typeof getEffectiveSpreads>;

// The spread a row inherits from its segment, ignoring the coin's own fee.
// Wizard step 3 shows segment spreads, so its customer rates use these.
export function getSegmentSpreads(row: CryptoCurrencyTypes): ResolvedSpreads {
  return {
    buySpread: row.segment?.buySpread ?? 0,
    sellSpread: row.segment?.sellSpread ?? 0,
    buyFeeType: row.segment?.buyFeeType ?? "PERCENTAGE",
    sellFeeType: row.segment?.sellFeeType ?? "PERCENTAGE",
  };
}

// Customer rates: the buy spread is added to the Obiex buy rate and the sell
// spread taken off the Obiex sell rate. A PERCENTAGE spread is a % of that
// rate; anything else (FLAT, legacy FIXED) is a Naira amount. The edit modal
// preview and the tables both use this, so they always agree.
export function applySpreads(
  obiex: { buy: number; sell: number },
  spreads: ResolvedSpreads,
) {
  const amount = (rate: number, value: number, type: FeeType) =>
    type === "PERCENTAGE" ? rate * (value / 100) : value;
  const buyAmount = amount(obiex.buy, spreads.buySpread, spreads.buyFeeType);
  const sellAmount = amount(obiex.sell, spreads.sellSpread, spreads.sellFeeType);

  return {
    buy: obiex.buy + buyAmount,
    sell: obiex.sell - sellAmount,
    buyAmount,
    sellAmount,
  };
}

// XBanka's customer rates for a row. Defaults to the spread the dashboard
// shows for the row (getEffectiveSpreads), the same one the edit modal opens on.
export function getXBankaRates(
  row: CryptoCurrencyTypes,
  spreads: ResolvedSpreads = getEffectiveSpreads(row),
) {
  const { buy, sell } = applySpreads(getObiexRates(row), spreads);
  return { buy, sell };
}
