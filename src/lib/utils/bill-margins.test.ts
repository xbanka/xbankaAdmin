import { describe, expect, it } from "vitest";
import {
  buildUpdatePayload,
  describeChanges,
  formatMargin,
  normalizeHistory,
  normalizeMargins,
  parseHistoryMetadata,
  sourceLabel,
  validateMarginForm,
} from "./bill-margins";
import type { BillMargin } from "../types/bill-margins-types";

const form = (over: Partial<Parameters<typeof validateMarginForm>[0]> = {}) => ({
  marginType: "FIXED" as const,
  marginValue: "15",
  isActive: true,
  reason: "Launch margin",
  ...over,
});

const saved: BillMargin = {
  product: "CABLE_TV",
  marginType: "PERCENTAGE",
  marginValue: 2,
  isActive: true,
  sampleOn1000: 20,
  updatedAt: "2026-11-09T10:00:00Z",
};

describe("validateMarginForm", () => {
  it("accepts a valid form", () => {
    expect(validateMarginForm(form())).toEqual({});
  });

  it("rejects an empty or negative value", () => {
    expect(validateMarginForm(form({ marginValue: "" })).marginValue).toBeTruthy();
    expect(validateMarginForm(form({ marginValue: "-1" })).marginValue).toBeTruthy();
  });

  it("caps a percentage at 100 but not a fixed amount", () => {
    const pct = form({ marginType: "PERCENTAGE", marginValue: "101" });
    expect(validateMarginForm(pct).marginValue).toBeTruthy();
    expect(validateMarginForm(form({ marginValue: "5000" }))).toEqual({});
  });

  it("allows zero", () => {
    expect(validateMarginForm(form({ marginValue: "0" }))).toEqual({});
  });

  it("requires a reason of at least 3 characters", () => {
    expect(validateMarginForm(form({ reason: "ab" })).reason).toBeTruthy();
    expect(validateMarginForm(form({ reason: "  ab  " })).reason).toBeTruthy();
    expect(validateMarginForm(form({ reason: "abc" }))).toEqual({});
  });
});

describe("buildUpdatePayload", () => {
  const values = {
    marginType: "PERCENTAGE" as const,
    marginValue: "2",
    isActive: true,
    reason: " Raise ",
  };

  it("returns null when nothing changed", () => {
    expect(buildUpdatePayload(saved, values)).toBeNull();
  });

  it("sends only the changed fields plus a trimmed reason", () => {
    expect(buildUpdatePayload(saved, { ...values, marginValue: "3" })).toEqual({
      marginValue: 3,
      reason: "Raise",
    });
    expect(buildUpdatePayload(saved, { ...values, isActive: false })).toEqual({
      isActive: false,
      reason: "Raise",
    });
  });
});

describe("normalizeMargins", () => {
  const electricity: BillMargin = { ...saved, product: "ELECTRICITY" };
  const betting: BillMargin = { ...saved, product: "BETTING" };

  it("returns the margin products in a stable order", () => {
    const rows = normalizeMargins([betting, saved, electricity]);
    expect(rows.map((r) => r.product)).toEqual([
      "ELECTRICITY",
      "CABLE_TV",
      "BETTING",
    ]);
    expect(rows[1]).toBe(saved);
  });

  it("drops airtime, data and unknown products", () => {
    const rows = normalizeMargins([
      { ...saved, product: "AIRTIME" },
      { ...saved, product: "DATA" },
      { ...saved, product: "SOMETHING_NEW" },
      saved,
    ]);
    expect(rows).toEqual([saved]);
  });

  it("does not invent rows for products the response leaves out", () => {
    expect(normalizeMargins([saved])).toEqual([saved]);
  });

  it("accepts the list bare, under items, or under data", () => {
    expect(normalizeMargins([saved])).toEqual([saved]);
    expect(normalizeMargins({ items: [saved] })).toEqual([saved]);
    expect(normalizeMargins({ data: [saved] })).toEqual([saved]);
    expect(normalizeMargins({ data: { items: [saved] } })).toEqual([saved]);
  });

  it("survives a malformed body", () => {
    expect(normalizeMargins(undefined)).toEqual([]);
    expect(normalizeMargins("nope")).toEqual([]);
  });
});

describe("normalizeHistory", () => {
  it("reads page, limit, total and items", () => {
    expect(
      normalizeHistory({ page: 2, limit: 25, total: 60, items: [{}] }, 1),
    ).toMatchObject({ page: 2, limit: 25, total: 60 });
  });

  it("falls back for a missing envelope", () => {
    expect(normalizeHistory({}, 3)).toEqual({
      page: 3,
      limit: 25,
      total: 0,
      items: [],
    });
  });
});

describe("history metadata", () => {
  it("parses the JSON string and describes changes", () => {
    const meta = parseHistoryMetadata(
      JSON.stringify({
        product: "DATA",
        source: "erp",
        created: false,
        changes: {
          marginValue: { from: 2, to: 3 },
          isActive: { from: true, to: false },
        },
      }),
    );
    expect(meta.product).toBe("DATA");
    expect(describeChanges(meta)).toEqual([
      "Margin value: 2 → 3",
      "Status: Active → Inactive",
    ]);
  });

  it("shows from the defaults on a product's first change", () => {
    const meta = parseHistoryMetadata(
      JSON.stringify({
        product: "CABLE_TV",
        source: "ADMIN_CONSOLE",
        created: true,
        changes: {
          marginType: { from: "FIXED", to: "PERCENTAGE" },
          marginValue: { from: 100, to: 3 },
        },
      }),
    );
    expect(meta.source).toBe("ADMIN_CONSOLE");
    expect(describeChanges(meta)).toEqual([
      "Margin type: Fixed (₦) → Percentage",
      "Margin value: 100 → 3",
    ]);
  });

  it("shows only the new value when there is no previous value", () => {
    const meta = parseHistoryMetadata(
      JSON.stringify({ changes: { marginType: { from: null, to: "FIXED" } } }),
    );
    expect(describeChanges(meta)).toEqual(["Margin type: Fixed (₦)"]);
  });

  it("labels the change source", () => {
    expect(sourceLabel("ADMIN_CONSOLE")).toBe("Admin console");
    expect(sourceLabel("INTERNAL_API")).toBe("Internal API");
    expect(sourceLabel(undefined)).toBe("");
  });

  it("returns no changes for missing or invalid metadata", () => {
    expect(parseHistoryMetadata(undefined).changes).toEqual({});
    expect(parseHistoryMetadata("{not json").changes).toEqual({});
  });
});

describe("formatMargin", () => {
  it("formats by type", () => {
    expect(formatMargin("PERCENTAGE", 3)).toBe("3%");
    expect(formatMargin("FIXED", 1500)).toBe("₦1,500");
    expect(formatMargin(null, 0)).toBe("—");
  });
});
