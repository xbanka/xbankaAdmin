import { describe, it, expect } from "vitest";
import {
  formatFeeDisplay,
  parseCryptoRates,
  getEffectiveSpreads,
  applySpreads,
  getObiexRates,
  getSegmentSpreads,
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

describe("applySpreads", () => {
  const obiex = { buy: 1375, sell: 1371.5 };

  it("adds a percentage buy spread and takes off a percentage sell spread", () => {
    expect(
      applySpreads(obiex, {
        buySpread: 2,
        sellSpread: 1,
        buyFeeType: "PERCENTAGE",
        sellFeeType: "PERCENTAGE",
      }),
    ).toEqual({ buy: 1402.5, sell: 1357.785, buyAmount: 27.5, sellAmount: 13.715 });
  });

  it("treats FLAT and legacy FIXED as a Naira amount", () => {
    expect(
      applySpreads(obiex, {
        buySpread: 25,
        sellSpread: 10,
        buyFeeType: "FLAT",
        sellFeeType: "FIXED",
      }),
    ).toEqual({ buy: 1400, sell: 1361.5, buyAmount: 25, sellAmount: 10 });
  });
});

describe("getXBankaRates", () => {
  // BNB on staging: Obiex buy 1375, sell 1371.5.
  const bnb = (over: Partial<CryptoCurrencyTypes> = {}) =>
    coin({
      obiexRate: 1371.5,
      obiexValueBuyRate: 1375,
      obiexValueSellRate: 1371.5,
      ...over,
    });

  it("matches the edit modal: Obiex buy/sell rates plus the row's shown spread", () => {
    // Regression: the table used obiexRate for both sides and only the
    // segment %, so it disagreed with the modal preview for the same coin.
    const row = bnb({ buyFeeValue: 1.5, sellFeeValue: 2 });
    expect(getXBankaRates(row)).toEqual({ buy: 1395.625, sell: 1344.07 });
  });

  it("uses a coin's flat fee as Naira, not a percentage", () => {
    const row = bnb({
      buyFeeType: "FLAT",
      buyFeeValue: 25,
      sellFeeType: "FLAT",
      sellFeeValue: 10,
    });
    expect(getXBankaRates(row)).toEqual({ buy: 1400, sell: 1361.5 });
  });

  it("falls back to the segment spread when the coin fee is missing", () => {
    const row = bnb({
      buyFeeValue: undefined as unknown as number,
      sellFeeValue: undefined as unknown as number,
      segment: seg({ buySpread: 2, sellSpread: 1 }),
    });
    expect(getXBankaRates(row)).toEqual({ buy: 1402.5, sell: 1357.785 });
  });

  it("uses obiexRate on both sides for a row without Obiex buy/sell rates", () => {
    expect(getXBankaRates(coin({ obiexRate: 1384 }))).toEqual({ buy: 1384, sell: 1384 });
  });

  it("takes explicit spreads, as wizard step 3 does with the segment spread", () => {
    const row = bnb({ segment: seg({ buySpread: 2, sellSpread: 1 }) });
    expect(getXBankaRates(row, getSegmentSpreads(row))).toEqual({
      buy: 1402.5,
      sell: 1357.785,
    });
  });
});

describe("getSegmentSpreads", () => {
  it("reads the segment spread and its fee type, ignoring the coin fee", () => {
    const row = coin({
      buyFeeValue: 5,
      segment: seg({ buySpread: 2, sellSpread: 300, sellFeeType: "FLAT" }),
    });
    expect(getSegmentSpreads(row)).toEqual({
      buySpread: 2,
      sellSpread: 300,
      buyFeeType: "PERCENTAGE",
      sellFeeType: "FLAT",
    });
  });

  it("is 0% when the row has no segment", () => {
    expect(getSegmentSpreads(coin({ segment: null }))).toEqual({
      buySpread: 0,
      sellSpread: 0,
      buyFeeType: "PERCENTAGE",
      sellFeeType: "PERCENTAGE",
    });
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

describe("parseCryptoRates", () => {
  // Shaped like `data` from GET /api/rates/crypto/all.
  it("reads initial: true as the empty spread schedule", () => {
    expect(parseCryptoRates({ initial: true, items: [] })).toEqual({
      initial: true,
      items: [],
    });
  });

  it("keeps every item, from every segment, when initial is false", () => {
    const items = [
      coin({ id: "bnb", segmentId: "alt" }),
      coin({ id: "btc", segmentId: "major" }),
      coin({ id: "usdt", segmentId: "stable" }),
    ];
    const parsed = parseCryptoRates({ initial: false, items });
    expect(parsed.initial).toBe(false);
    expect(parsed.items.map((i) => i.id)).toEqual(["bnb", "btc", "usdt"]);
  });

  it("only treats an explicit true as initial", () => {
    expect(parseCryptoRates({ items: [] }).initial).toBe(false);
    expect(parseCryptoRates(undefined)).toEqual({ initial: false, items: [] });
    expect(parseCryptoRates(null)).toEqual({ initial: false, items: [] });
  });

  it("returns no items when items is missing or not a list", () => {
    expect(parseCryptoRates({ initial: false }).items).toEqual([]);
    expect(
      parseCryptoRates({ initial: false, items: "x" as unknown as [] }).items,
    ).toEqual([]);
  });
});

describe("getObiexRates", () => {
  // Values from a staging crypto/all row.
  it("uses Obiex's own buy and sell rates, not obiexRate for both", () => {
    expect(
      getObiexRates(
        coin({
          obiexRate: 1371.5,
          obiexValueBuyRate: 1375,
          obiexValueSellRate: 1371.5,
        }),
      ),
    ).toEqual({ buy: 1375, sell: 1371.5 });
  });

  it("keeps a real 0 from the backend", () => {
    expect(
      getObiexRates(
        coin({ obiexRate: 1371.5, obiexValueBuyRate: 0, obiexValueSellRate: 0 }),
      ),
    ).toEqual({ buy: 0, sell: 0 });
  });

  it("falls back to obiexRate when a side is missing", () => {
    expect(
      getObiexRates(coin({ obiexRate: 1371.5, obiexValueSellRate: 1370 })),
    ).toEqual({ buy: 1371.5, sell: 1370 });
    expect(
      getObiexRates(coin({ obiexRate: 1371.5, obiexValueBuyRate: null })),
    ).toEqual({ buy: 1371.5, sell: 1371.5 });
  });

  it("is 0/0 when the row has no rates at all", () => {
    expect(
      getObiexRates(coin({ obiexRate: undefined as unknown as number })),
    ).toEqual({ buy: 0, sell: 0 });
  });
});
