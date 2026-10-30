import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const axios = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn(), post: vi.fn() }));
vi.mock("../Axiosinstance/axiosInstance", () => ({ default: axios }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { getCryptoRates } from "../actions/rates";
import { useGetCryptoRates, useSpreadSchedule } from "./rates.service";

const CRYPTO_URL = "/api/rates/crypto/all";
const SEGMENTS_URL = "/api/rates/segments/all";

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

// assetBuyFee is each coin's own buy fee; the backend sends 0 when unused.
const segment = (
  id: string,
  buySpread: number,
  assetIds: string[],
  assetBuyFee = 0,
) => ({
  id,
  name: id,
  isActive: true,
  buySpread,
  sellSpread: 0,
  buyFeeType: "PERCENTAGE",
  sellFeeType: "PERCENTAGE",
  assets: assetIds.map((assetId) => ({
    id: assetId,
    overrideSegment: false,
    buyFeeValue: assetBuyFee,
    sellFeeValue: 0,
  })),
});

// Routes GET calls by URL so the segment and crypto calls can differ.
function mockApi(segments: unknown[], cryptos: unknown[] = []) {
  axios.get.mockImplementation((url: string) =>
    Promise.resolve({
      data: { data: url === SEGMENTS_URL ? segments : cryptos },
    }),
  );
}

const cryptoCalls = () =>
  axios.get.mock.calls.filter(([url]) => url === CRYPTO_URL);

beforeEach(() => {
  axios.get.mockReset();
});

describe("getCryptoRates", () => {
  it("sends no segment filter when no ids are given", async () => {
    axios.get.mockResolvedValue({ data: {} });
    await getCryptoRates();
    await getCryptoRates([]);
    expect(axios.get).toHaveBeenNthCalledWith(1, CRYPTO_URL, { params: undefined });
    expect(axios.get).toHaveBeenNthCalledWith(2, CRYPTO_URL, { params: undefined });
  });

  it("comma-joins several segment ids into one segmentId param", async () => {
    axios.get.mockResolvedValue({ data: {} });
    await getCryptoRates(["a", "b"]);
    expect(axios.get).toHaveBeenCalledWith(CRYPTO_URL, {
      params: { segmentId: "a,b" },
    });
  });
});

describe("useGetCryptoRates", () => {
  it("does not call the API for an empty segment list (that would return every asset)", async () => {
    const { result } = renderHook(() => useGetCryptoRates([]), {
      wrapper: wrapper(),
    });
    await new Promise((r) => setTimeout(r, 20));
    expect(axios.get).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("filters by the picked segment ids", async () => {
    axios.get.mockResolvedValue({ data: { data: [{ id: "btc" }] } });
    const { result } = renderHook(() => useGetCryptoRates(["major", "alt"]), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axios.get).toHaveBeenCalledWith(CRYPTO_URL, {
      params: { segmentId: "alt,major" },
    });
  });
});

describe("useSpreadSchedule", () => {
  it("is empty without calling the crypto API when every segment is 0/0", async () => {
    mockApi([segment("major", 0, ["btc"]), segment("stable", 0, ["usdt"])]);
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.rows).toEqual([]);
    expect(cryptoCalls()).toHaveLength(0);
  });

  it("after a wizard save of only Alt coins, fetches and shows only Alt coins", async () => {
    // The coins still carry 0 fees from the backend; the segment spread set
    // in the wizard is what puts the segment on the dashboard.
    mockApi(
      [
        segment("major", 0, ["btc"]),
        segment("alt", 1.5, ["sol"]),
      ],
      [{ id: "sol", segmentId: "alt" }],
    );
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    expect(result.current.isEmpty).toBe(false);
    expect(cryptoCalls()).toEqual([
      [CRYPTO_URL, { params: { segmentId: "alt" } }],
    ]);
  });
  it("is loading, not empty, while segments are still loading", () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isEmpty).toBe(false);
  });

  it("fetches only the configured segments and returns their assets", async () => {
    mockApi(
      [segment("major", 0, ["btc"], 1.5), segment("stable", 0, ["usdt"])],
      // usdt comes back too, as if the backend ignored the filter.
      [
        { id: "btc", segmentId: "major" },
        { id: "usdt", segmentId: "stable" },
      ],
    );
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    expect(result.current.rows.map((r) => r.id)).toEqual(["btc"]);
    expect(result.current.isEmpty).toBe(false);
    expect(cryptoCalls()).toEqual([
      [CRYPTO_URL, { params: { segmentId: "major" } }],
    ]);
  });

  it("shows the empty state when the backend returns no assets for the configured segments", async () => {
    mockApi([segment("major", 0, ["btc"], 1.5)], []);
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(cryptoCalls()).toHaveLength(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isEmpty).toBe(true);
  });

  it("reports an error, not the empty state, when segments fail to load", async () => {
    axios.get.mockRejectedValue(new Error("Could not reach the core backend"));
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.isEmpty).toBe(false);
  });
});
