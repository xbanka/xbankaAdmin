import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AssetIcon } from "./asset-icon";
import { getAssetIconUrls, getAssetInitials } from "@/lib/utils/asset-icon";

describe("getAssetIconUrls", () => {
  it("builds spothq then CoinCap URLs from a lowercased ticker", () => {
    expect(getAssetIconUrls(" BTC ")).toEqual([
      "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/btc.svg",
      "https://assets.coincap.io/assets/icons/btc@2x.png",
    ]);
  });

  it("returns no sources for empty or unsafe tickers", () => {
    expect(getAssetIconUrls("")).toEqual([]);
    expect(getAssetIconUrls(null)).toEqual([]);
    expect(getAssetIconUrls("../x")).toEqual([]);
  });
});

describe("getAssetInitials", () => {
  it("uses up to three uppercase characters", () => {
    expect(getAssetInitials("usdt")).toBe("USD");
    expect(getAssetInitials(undefined)).toBe("?");
  });
});

describe("AssetIcon", () => {
  it("falls through each source and ends on initials", () => {
    render(<AssetIcon currency="PEPE" />);
    const first = screen.getByRole("img");
    expect(first).toHaveAttribute("src", expect.stringContaining("pepe.svg"));

    fireEvent.error(first);
    const second = screen.getByRole("img");
    expect(second).toHaveAttribute("src", expect.stringContaining("pepe@2x.png"));

    fireEvent.error(second);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("PEP")).toBeInTheDocument();
  });
});
