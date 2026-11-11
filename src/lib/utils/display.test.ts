import { describe, expect, it } from "vitest";
import { amountOrNA, fullNameOrNA, NA, orNA, pairOrNA } from "./display";

describe("orNA", () => {
  it("returns N/A for null, undefined, empty and whitespace", () => {
    expect(orNA(null)).toBe(NA);
    expect(orNA(undefined)).toBe(NA);
    expect(orNA("")).toBe(NA);
    expect(orNA("   ")).toBe(NA);
  });

  it("returns the value when present", () => {
    expect(orNA("+2348012345678")).toBe("+2348012345678");
    expect(orNA("a@b.com")).toBe("a@b.com");
    expect(orNA(0)).toBe("0");
  });
});

describe("fullNameOrNA", () => {
  it("joins first and last name", () => {
    expect(fullNameOrNA("Ada", "Obi")).toBe("Ada Obi");
  });

  it("does not render 'undefined' when last name is missing", () => {
    expect(fullNameOrNA("Ada", undefined)).toBe("Ada");
    expect(fullNameOrNA("Ada", null)).toBe("Ada");
  });

  it("uses last name alone when first name is missing", () => {
    expect(fullNameOrNA(undefined, "Obi")).toBe("Obi");
  });

  it("returns N/A when both parts are missing or blank", () => {
    expect(fullNameOrNA(undefined, undefined)).toBe(NA);
    expect(fullNameOrNA("", " ")).toBe(NA);
  });
});

describe("pairOrNA", () => {
  it("joins both sides", () => {
    expect(pairOrNA("BTC", "NGN")).toBe("BTC-NGN");
  });
  it("never leaves a dangling dash", () => {
    expect(pairOrNA("BTC", undefined)).toBe("BTC-N/A");
    expect(pairOrNA(null, "NGN")).toBe("N/A-NGN");
  });
  it("returns N/A when both sides are missing", () => {
    expect(pairOrNA(undefined, " ")).toBe(NA);
  });
});

describe("amountOrNA", () => {
  it("returns N/A for missing or non-numeric amounts", () => {
    expect(amountOrNA(undefined, "NGN")).toBe(NA);
    expect(amountOrNA(null, "NGN")).toBe(NA);
    expect(amountOrNA("", "NGN")).toBe(NA);
    expect(amountOrNA("abc", "NGN")).toBe(NA);
  });
  it("keeps 0 as a real amount", () => {
    expect(amountOrNA(0, "NGN")).toBe("NGN 0");
  });
  it("formats with the currency before or after", () => {
    expect(amountOrNA(1234567.891, "NGN")).toBe("NGN 1,234,567.89");
    expect(amountOrNA("0.5", "BTC", "after")).toBe("0.5 BTC");
  });
  it("shows the bare number when currency is missing", () => {
    expect(amountOrNA(1500, undefined)).toBe("1,500");
  });
});
