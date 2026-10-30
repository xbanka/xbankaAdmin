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

type SegmentWithAssets = Partial<SpreadSource> & {
  id: string;
  assets?: CryptoCurrencyTypes[];
};

// Smallest buy or sell spread that counts as configured, as a percentage or
// a flat Naira amount. Anything below it is treated as not set.
export const MIN_SPREAD = 1;

// True when at least one asset in the segment shows a buy or sell spread of
// at least MIN_SPREAD (percentage or flat), resolved exactly as the dashboard
// row shows it. A segment whose assets are all below 1 does not count.
export function hasAssetSpread(segment: SegmentWithAssets) {
  return (segment.assets ?? []).some((asset) => {
    const shown = getEffectiveSpreads(asset, asset.segment ?? segment);
    return shown.buySpread >= MIN_SPREAD || shown.sellSpread >= MIN_SPREAD;
  });
}

// A segment is configured once it has assets and a spread of at least
// MIN_SPREAD, either its own (what the wizard's step 2 saves) or one shown by
// any of its assets. The segment's own spread counts even while its coins
// read 0% (the backend stores unused coin fees as 0), so a segment set in the
// wizard is on the dashboard after Done. Step 3 of the wizard and the
// dashboard both use this rule, so Done shows the segments step 3 showed.
export function isSegmentConfigured(segment: SegmentWithAssets) {
  if ((segment.assets ?? []).length === 0) return false;
  return (
    (segment.buySpread || 0) >= MIN_SPREAD ||
    (segment.sellSpread || 0) >= MIN_SPREAD ||
    hasAssetSpread(segment)
  );
}

// The dashboard's spread schedule. Segments that are not configured, and so
// all their assets, stay off the dashboard.
export function getConfiguredSegmentIds(
  segments: SegmentWithAssets[] | undefined,
) {
  return (segments ?? [])
    .filter(isSegmentConfigured)
    .map((segment) => segment.id);
}

// Keeps only rows in the given segments. crypto/all is asked to filter by
// segmentId, but the screen must not show other segments' assets if a
// backend build ignores the filter, so the rows are checked here too.
export function keepSegments(
  rows: CryptoCurrencyTypes[] | undefined,
  segmentIds: string[],
) {
  const ids = new Set(segmentIds);
  return (rows ?? []).filter((row) =>
    ids.has(row.segmentId || row.segment?.id || ""),
  );
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

export function getXBankaRates(row: CryptoCurrencyTypes) {
  const obiexRate = row.obiexRate ?? 0;
  const buySpread = row.segment?.buySpread ?? 0;
  const sellSpread = row.segment?.sellSpread ?? 0;

  return {
    buy: obiexRate + obiexRate * (buySpread / 100),
    sell: obiexRate - obiexRate * (sellSpread / 100),
  };
}
