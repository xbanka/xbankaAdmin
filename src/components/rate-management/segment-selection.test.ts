import { describe, expect, it } from "vitest";
import {
  ALL_SEGMENTS,
  filterReviewAssets,
  getReviewSegments,
  mergeSegments,
} from "./segment-selection";
import { CryptoCurrencyTypes } from "@/lib/types/rates-types";
import { Segment, SegmentResponse } from "./types";

const response = (id: string, over: Partial<SegmentResponse> = {}) =>
  ({
    id,
    name: id,
    isActive: true,
    buySpread: 0,
    sellSpread: 0,
    buyFeeType: "PERCENTAGE",
    sellFeeType: "PERCENTAGE",
    assets: [],
    ...over,
  }) as SegmentResponse;

describe("mergeSegments", () => {
  it("starts every segment unpicked on first load", () => {
    const merged = mergeSegments([], [response("major"), response("alt")]);
    expect(merged.map((s) => s.selected)).toEqual([false, false]);
  });

  it("keeps the staff's picks and edits when segment data refetches after a save", () => {
    const prev: Segment[] = [
      { ...mergeSegments([], [response("major")])[0], selected: true, buySpread: 2, sellSpread: 1 },
      { ...mergeSegments([], [response("alt")])[0], selected: false },
    ];
    const merged = mergeSegments(prev, [
      response("major", { name: "Major coins", buySpread: 0 }),
      response("alt"),
    ]);

    expect(merged[0]).toMatchObject({
      id: "major",
      name: "Major coins",
      selected: true,
      buySpread: 2,
      sellSpread: 1,
    });
    expect(merged[1].selected).toBe(false);
  });

  it("adds a new segment from the server unpicked with its server spreads", () => {
    const merged = mergeSegments([], [response("new", { buySpread: 3, sellSpread: 2 })]);
    expect(merged[0]).toMatchObject({ selected: false, buySpread: 3, sellSpread: 2 });
  });

  it("drops a segment that no longer exists on the server", () => {
    const prev = mergeSegments([], [response("gone"), response("major")]);
    expect(mergeSegments(prev, [response("major")]).map((s) => s.id)).toEqual(["major"]);
  });
});

const asset = (id: string, over: Partial<CryptoCurrencyTypes> = {}) =>
  ({
    id,
    name: id,
    currency: id.toUpperCase(),
    segmentId: "",
    buyFeeType: "PERCENTAGE",
    buyFeeValue: 0,
    sellFeeType: "PERCENTAGE",
    sellFeeValue: 0,
    ...over,
  }) as CryptoCurrencyTypes;

const segment = (id: string, over: Partial<Segment> = {}): Segment => ({
  id,
  name: id,
  selected: true,
  isActive: true,
  buySpread: 0,
  sellSpread: 0,
  assets: [asset(`${id}-coin`, { segmentId: id })],
  ...over,
});

describe("getReviewSegments", () => {
  it("keeps only segments picked in step 1", () => {
    const result = getReviewSegments([
      segment("major", { buySpread: 2 }),
      segment("alt", { buySpread: 2, selected: false }),
    ]);
    expect(result.map((s) => s.id)).toEqual(["major"]);
  });

  it("keeps a picked segment bulk updated in step 2 with only a sell spread", () => {
    expect(getReviewSegments([segment("major", { sellSpread: 1.5 })])).toHaveLength(1);
  });

  it("drops a picked segment left empty in step 2 when every asset is at 0", () => {
    expect(getReviewSegments([segment("stable")])).toEqual([]);
  });

  it("keeps a picked segment left empty in step 2 when one asset has a percentage spread", () => {
    const stable = segment("stable", {
      assets: [
        asset("usdt", { segmentId: "stable" }),
        asset("usdc", { segmentId: "stable", buyFeeValue: 1 }),
      ],
    });
    expect(getReviewSegments([stable]).map((s) => s.id)).toEqual(["stable"]);
  });

  it("keeps a picked segment left empty in step 2 when one asset has a flat sell fee", () => {
    const stable = segment("stable", {
      assets: [
        asset("usdt", { segmentId: "stable", sellFeeType: "FLAT", sellFeeValue: 50 }),
      ],
    });
    expect(getReviewSegments([stable])).toHaveLength(1);
  });

  it("drops a picked segment with a spread but no assets", () => {
    expect(getReviewSegments([segment("empty", { buySpread: 2, assets: [] })])).toEqual([]);
  });

  it("drops a picked segment whose step 2 values and coins are all below 1", () => {
    const major = segment("major", {
      buySpread: 0.5,
      sellSpread: 0.99,
      assets: [asset("btc", { segmentId: "major", buyFeeType: "FLAT", buyFeeValue: 0.5 })],
    });
    expect(getReviewSegments([major])).toEqual([]);
  });

  it("keeps a picked segment bulk set to exactly 1", () => {
    expect(getReviewSegments([segment("major", { buySpread: 1 })])).toHaveLength(1);
  });

  it("treats a cleared step 2 input (NaN) as empty", () => {
    expect(getReviewSegments([segment("major", { buySpread: NaN })])).toEqual([]);
  });
});

describe("filterReviewAssets", () => {
  const assets = [
    asset("bitcoin", { currency: "BTC", segmentId: "major" }),
    asset("tether", { currency: "USDT", segmentId: "stable" }),
  ];

  it("returns every asset for the all segments option and no search", () => {
    expect(filterReviewAssets(assets, { segmentId: ALL_SEGMENTS, query: "" })).toHaveLength(2);
  });

  it("filters by segment", () => {
    const result = filterReviewAssets(assets, { segmentId: "stable", query: "" });
    expect(result.map((a) => a.id)).toEqual(["tether"]);
  });

  it("searches name and ticker case-insensitively", () => {
    expect(filterReviewAssets(assets, { segmentId: "", query: " btc " }).map((a) => a.id)).toEqual(["bitcoin"]);
    expect(filterReviewAssets(assets, { segmentId: "", query: "TETH" }).map((a) => a.id)).toEqual(["tether"]);
  });

  it("combines segment and search", () => {
    expect(filterReviewAssets(assets, { segmentId: "major", query: "usdt" })).toEqual([]);
  });
});
