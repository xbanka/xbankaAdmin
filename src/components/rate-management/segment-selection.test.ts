import { describe, expect, it } from "vitest";
import {
  ALL_SEGMENTS,
  filterReviewAssets,
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
