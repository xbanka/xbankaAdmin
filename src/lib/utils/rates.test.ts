import { describe, it, expect } from "vitest";
import {
  formatFeeDisplay,
  getConfiguredSegmentIds,
  hasAssetSpread,
  keepSegments,
  getEffectiveSpreads,
  getXBankaRates,
  isChangePendingApproval,
} from "./rates";
import { AssetSegment, CryptoCurrencyTypes } from "@/lib/types/rates-types";

const seg = (over: Partial<AssetSegment> = {}) =>
  ({
    id: "major",
    name: "Major coins",
    buySpread: 0,
    sellSpread: 0,
    buyFeeType: "PERCENTAGE",
    sellFeeType: "PERCENTAGE",
    ...over,
  }) as AssetSegment;

// Shaped like a row from GET /api/rates/crypto/all: unused asset fees are 0.
const coin = (over: Partial<CryptoCurrencyTypes> = {}) =>
  ({
    id: "btc",
    currency: "BTC",
    buyFeeType: "PERCENTAGE",
    buyFeeValue: 0,
    sellFeeType: "PERCENTAGE",
    sellFeeValue: 0,
    overrideSegment: false,
    obiexRate: 0,
    segment: seg(),
    ...over,
  }) as CryptoCurrencyTypes;

describe("formatFeeDisplay", () => {
  it("renders a PERCENTAGE fee with a % suffix", () => {
    expect(formatFeeDisplay(2, "PERCENTAGE")).toBe("2%");
  });

  it("renders a FLAT fee as a Naira amount", () => {
    expect(formatFeeDisplay(200000, "FLAT")).toBe("₦200,000");
  });

  it("renders a legacy FIXED fee as a Naira amount, same as FLAT", () => {
    expect(formatFeeDisplay(200000, "FIXED")).toBe("₦200,000");
  });
});

describe("getEffectiveSpreads", () => {
  it("shows a FLAT edit from the modal as the asset's own value and fee type", () => {
    expect(
      getEffectiveSpreads(
        coin({
          buyFeeType: "FLAT",
          buyFeeValue: 5000,
          sellFeeType: "FLAT",
          sellFeeValue: 3000,
          segment: seg({ buySpread: 2, sellSpread: 2 }),
        }),
      ),
    ).toEqual({
      buySpread: 5000,
      sellSpread: 3000,
      buyFeeType: "FLAT",
      sellFeeType: "FLAT",
    });
  });

  it("shows the asset value even when overrideSegment is false (the backend does not set it)", () => {
    expect(
      getEffectiveSpreads(
        coin({ overrideSegment: false, buyFeeValue: 3, sellFeeValue: 1, segment: seg({ buySpread: 2 }) }),
      ),
    ).toMatchObject({ buySpread: 3, sellSpread: 1 });
  });

  it("shows an asset fee of 0 as 0% even when the segment has a spread", () => {
    // Regression: editing a coin to 0% still showed the segment spread.
    expect(
      getEffectiveSpreads(coin({ segment: seg({ buySpread: 2, sellSpread: 1.5 }) })),
    ).toEqual({ buySpread: 0, sellSpread: 0, buyFeeType: "PERCENTAGE", sellFeeType: "PERCENTAGE" });
  });
  it("keeps an asset-level 0 when overrideSegment is true", () => {
    expect(
      getEffectiveSpreads(
        coin({ overrideSegment: true, segment: seg({ buySpread: 2, sellSpread: 2 }) }),
      ),
    ).toMatchObject({ buySpread: 0, sellSpread: 0 });
  });

  it("labels the value with the type it came from: asset type for asset values, segment type for fallbacks", () => {
    // Regression: a value labelled with the wrong type showed 11% as ₦11
    // while the edit modal opened on Percentage.
    const shown = getEffectiveSpreads(
      coin({
        buyFeeType: "FLAT",
        buyFeeValue: 11,
        sellFeeType: "FLAT",
        sellFeeValue: undefined,
        segment: seg({ sellSpread: 11, sellFeeType: "PERCENTAGE" }),
      }),
    );
    expect(formatFeeDisplay(shown.buySpread, shown.buyFeeType)).toBe("₦11");
    expect(formatFeeDisplay(shown.sellSpread, shown.sellFeeType)).toBe("11%");
  });
  it("resolves each side on its own: edited buy, missing sell falls back", () => {
    expect(
      getEffectiveSpreads(
        coin({
          buyFeeType: "FLAT",
          buyFeeValue: 5000,
          sellFeeValue: undefined,
          segment: seg({ buySpread: 2, sellSpread: 1 }),
        }),
      ),
    ).toEqual({ buySpread: 5000, sellSpread: 1, buyFeeType: "FLAT", sellFeeType: "PERCENTAGE" });
  });
  it("uses a parent segment passed in when the row has none (segments/all shape)", () => {
    expect(
      getEffectiveSpreads(
        coin({ buyFeeValue: undefined, segment: null }),
        seg({ buySpread: 3 }),
      ),
    ).toMatchObject({ buySpread: 3, sellSpread: 0 });
  });
  it("falls back to the segment spread when the asset value is missing", () => {
    expect(
      getEffectiveSpreads(
        coin({
          buyFeeValue: undefined,
          sellFeeValue: undefined,
          segment: seg({ buySpread: 2, sellSpread: 1.5 }),
        }),
      ),
    ).toMatchObject({ buySpread: 2, sellSpread: 1.5 });
  });

  it("returns 0 when neither asset nor segment has a spread", () => {
    expect(
      getEffectiveSpreads(coin({ buyFeeValue: undefined, sellFeeValue: undefined, segment: null })),
    ).toMatchObject({ buySpread: 0, sellSpread: 0 });
  });
});

describe("getXBankaRates", () => {
  it("applies the segment's percentage spread to the Obiex rate", () => {
    expect(
      getXBankaRates(coin({ obiexRate: 1000, segment: seg({ buySpread: 2, sellSpread: 1 }) })),
    ).toEqual({ buy: 1020, sell: 990 });
  });

  it("returns the Obiex rate unchanged when the segment spread is 0", () => {
    expect(getXBankaRates(coin({ obiexRate: 1384 }))).toEqual({ buy: 1384, sell: 1384 });
  });
});

describe("getConfiguredSegmentIds", () => {
  // Shaped like a segment from GET /api/rates/segments/all.
  const segment = (
    id: string,
    buySpread: number,
    sellSpread: number,
    assets: Partial<CryptoCurrencyTypes>[],
  ) => ({
    ...seg({ id, buySpread, sellSpread }),
    assets: assets.map((a) => coin({ segment: null, ...a })),
  });

  it("returns nothing for missing or empty data", () => {
    expect(getConfiguredSegmentIds(undefined)).toEqual([]);
    expect(getConfiguredSegmentIds([])).toEqual([]);
  });

  it("drops every segment when all coins are at 0 (the initial state)", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 0, 0, [{ id: "btc" }, { id: "eth" }]),
        segment("stable", 0, 0, [{ id: "usdt", obiexRate: 1384 }]),
      ]),
    ).toEqual([]);
  });

  it("after Done shows only the segment set in the wizard, even while its coins read 0%", () => {
    // Regression: picking only Alt coins in the wizard and clicking Done
    // left the dashboard on the empty state, because the backend stores
    // each coin's unused fee as 0 and only coin values were checked.
    expect(
      getConfiguredSegmentIds([
        segment("major", 0, 0, [{ id: "btc" }, { id: "eth" }]),
        segment("alt", 1.5, 1.5, [{ id: "sol" }, { id: "ada" }]),
        segment("stable", 0, 0, [{ id: "usdt" }]),
      ]),
    ).toEqual(["alt"]);
  });
  it("keeps a segment whose coins fall back to a segment spread of 1 or more", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 1.5, 0, [{ id: "btc", buyFeeValue: undefined }]),
      ]),
    ).toEqual(["major"]);
  });
  it("drops a segment whose own spread and coins are all below 1", () => {
    expect(
      getConfiguredSegmentIds([segment("alt", 0.5, 0.99, [{ id: "sol", buyFeeValue: 0.5 }])]),
    ).toEqual([]);
  });
  it("keeps a segment whose coins fall back to its spread (fee missing)", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 1.5, 0, [
          { id: "btc", buyFeeValue: undefined, sellFeeValue: undefined },
        ]),
      ]),
    ).toEqual(["major"]);
  });

  it("keeps a segment when one coin has only a sell spread", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 0, 0, [{ id: "btc" }, { id: "eth", sellFeeValue: 1.25 }]),
      ]),
    ).toEqual(["major"]);
  });

  it("keeps a 0/0 segment when one coin in it has its own edited spread", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 0, 0, [
          { id: "btc" },
          { id: "eth", buyFeeType: "FLAT", buyFeeValue: 5000 },
        ]),
      ]),
    ).toEqual(["major"]);
  });

  it("drops a segment when every coin's spread is below 1, percentage or flat", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 0.99, 0.5, [{ id: "btc" }]),
        segment("stable", 0, 0, [
          { id: "usdt", buyFeeType: "FLAT", buyFeeValue: 0.5 },
          { id: "usdc", sellFeeType: "FLAT", sellFeeValue: 0.99 },
        ]),
      ]),
    ).toEqual([]);
  });

  it("keeps a segment when one coin is exactly 1 (inclusive), flat or percentage", () => {
    expect(
      getConfiguredSegmentIds([
        segment("major", 0, 0, [{ id: "btc", buyFeeValue: 1 }]),
        segment("stable", 0, 0, [
          { id: "usdt", buyFeeValue: 0.5 },
          { id: "usdc", sellFeeType: "FLAT", sellFeeValue: 1 },
        ]),
      ]),
    ).toEqual(["major", "stable"]);
  });
  it("drops a segment with no assets, even with a spread set", () => {
    expect(getConfiguredSegmentIds([segment("empty", 2, 2, [])])).toEqual([]);
    expect(
      getConfiguredSegmentIds([{ ...seg({ id: "bare", buySpread: 2 }) }]),
    ).toEqual([]);
  });
});

describe("isChangePendingApproval", () => {
  it("is pending when the proposal status is PENDING", () => {
    expect(isChangePendingApproval({ proposed_change: { status: "PENDING" } })).toBe(true);
  });

  it("is not pending when the proposal was approved", () => {
    expect(
      isChangePendingApproval({
        message: "Awaiting approval",
        proposed_change: { status: "APPROVED" },
      }),
    ).toBe(false);
  });

  it("reads the message when there is no proposal status", () => {
    expect(isChangePendingApproval({ message: "Change submitted for approval" })).toBe(true);
    expect(isChangePendingApproval({ message: "Bulk segments updated" })).toBe(false);
  });

  it("is not pending for an empty response", () => {
    expect(isChangePendingApproval(undefined)).toBe(false);
  });
});

describe("hasAssetSpread", () => {
  it("is false for a segment with no assets", () => {
    expect(hasAssetSpread({ id: "empty", buySpread: 2, sellSpread: 2 })).toBe(false);
  });

  it("matches what the dashboard row shows for each coin", () => {
    const row = coin({ sellFeeType: "FLAT", sellFeeValue: 50 });
    const shown = getEffectiveSpreads(row);
    expect(shown.sellSpread).toBe(50);
    expect(hasAssetSpread({ id: "major", buySpread: 0, sellSpread: 0, assets: [row] })).toBe(true);
  });
});

describe("keepSegments", () => {
  it("drops rows from segments that were not asked for", () => {
    const rows = [
      coin({ id: "btc", segmentId: "major" }),
      coin({ id: "sol", segmentId: "alt" }),
      coin({ id: "usdt", segmentId: "", segment: seg({ id: "stable" }) }),
    ];
    expect(keepSegments(rows, ["major", "stable"]).map((r) => r.id)).toEqual([
      "btc",
      "usdt",
    ]);
  });

  it("returns nothing for no ids or no rows", () => {
    expect(keepSegments([coin({ segmentId: "major" })], [])).toEqual([]);
    expect(keepSegments(undefined, ["major"])).toEqual([]);
  });
});
