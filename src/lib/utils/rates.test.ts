import { describe, it, expect } from "vitest";
import { formatFeeDisplay } from "./rates";

describe("formatFeeDisplay", () => {
  it("renders a PERCENTAGE fee with a % suffix", () => {
    expect(formatFeeDisplay(2.2, "PERCENTAGE")).toBe("2.2%");
  });

  it("renders a FLAT fee as a Naira amount, not a percent", () => {
    expect(formatFeeDisplay(3, "FLAT")).toBe("₦3");
  });

  it("renders a legacy FIXED fee (same concept as FLAT, older enum value) as a Naira amount too", () => {
    expect(formatFeeDisplay(200000, "FIXED")).toBe("₦200,000");
  });
});
