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

function wrapper(
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

// The body GET /api/rates/crypto/all returns.
const respond = (data: unknown) =>
  axios.get.mockResolvedValue({ data: { data, message: "Request successful" } });

const coin = (id: string, segmentId: string) => ({ id, currency: id, segmentId });

beforeEach(() => {
  axios.get.mockReset();
});

describe("getCryptoRates", () => {
  it("calls crypto/all with no segment filter", async () => {
    axios.get.mockResolvedValue({ data: {} });
    await getCryptoRates();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get.mock.calls[0]).toEqual([CRYPTO_URL]);
  });

  it("passes filters as axios params so the client encodes them", async () => {
    axios.get.mockResolvedValue({ data: {} });
    await getCryptoRates({ segmentName: "Alt coins,Stablecoins", search: "bit" });
    expect(axios.get.mock.calls[0]).toEqual([
      CRYPTO_URL,
      { params: { segmentName: "Alt coins,Stablecoins", search: "bit" } },
    ]);
  });

  it("treats empty params as no filter", async () => {
    axios.get.mockResolvedValue({ data: {} });
    await getCryptoRates({});
    expect(axios.get.mock.calls[0]).toEqual([CRYPTO_URL]);
  });
});

describe("useGetCryptoRates", () => {
  it("returns initial and every item from every segment", async () => {
    respond({
      initial: false,
      items: [coin("bnb", "alt"), coin("btc", "major"), coin("usdt", "stable")],
    });
    const { result } = renderHook(() => useGetCryptoRates(), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.initial).toBe(false);
    expect(result.current.data?.items.map((i) => i.id)).toEqual([
      "bnb",
      "btc",
      "usdt",
    ]);
  });
});

describe("useSpreadSchedule", () => {
  it("shows the empty state when the backend says initial: true", async () => {
    respond({ initial: true, items: [] });
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.rows).toEqual([]);
  });

  it("lists every item when initial is false, without filtering by segment", async () => {
    respond({
      initial: false,
      items: [coin("bnb", "alt"), coin("btc", "major"), coin("eth", "major")],
    });
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.rows).toHaveLength(3));
    expect(result.current.isEmpty).toBe(false);
    expect(axios.get.mock.calls).toEqual([[CRYPTO_URL]]);
  });

  it("keeps the table (not the empty state) when initial is false with no items", async () => {
    respond({ initial: false, items: [] });
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.rows).toEqual([]);
  });

  it("is loading, not empty, while the request is in flight", () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isEmpty).toBe(false);
  });

  it("reports an error, not the empty state, when the request fails", async () => {
    axios.get.mockRejectedValue(new Error("Could not reach the core backend"));
    const { result } = renderHook(() => useSpreadSchedule(), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.isEmpty).toBe(false);
  });
});

describe("useSpreadSchedule with filters", () => {
  const SEG = "a3d9b2f1-6c44-4e0a-b1d7-90e5c8f2a411";

  it("sends search and segmentId to crypto/all", async () => {
    respond({ initial: false, items: [coin("sol", SEG)] });
    const { result } = renderHook(
      () => useSpreadSchedule({ search: " so ", segmentId: SEG }),
      { wrapper: wrapper() },
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(1));
    expect(axios.get.mock.calls).toEqual([
      [CRYPTO_URL, { params: { search: "so", segmentId: SEG } }],
    ]);
    expect(result.current.isFiltered).toBe(true);
  });

  it("does not send the 'all' segment or a blank search", async () => {
    respond({ initial: false, items: [] });
    const { result } = renderHook(
      () => useSpreadSchedule({ search: "  ", segmentId: "all" }),
      { wrapper: wrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(axios.get.mock.calls).toEqual([[CRYPTO_URL]]);
    expect(result.current.isFiltered).toBe(false);
  });

  it("an empty filtered result is 'nothing matched', not the empty schedule", async () => {
    // initial is computed across all assets, so it stays false under a filter.
    respond({ initial: false, items: [] });
    const { result } = renderHook(
      () => useSpreadSchedule({ search: "zzz" }),
      { wrapper: wrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.isFiltered).toBe(true);
    expect(result.current.rows).toEqual([]);
  });

  it("keeps the previous rows on screen while a new filter loads", async () => {
    respond({ initial: false, items: [coin("btc", SEG), coin("eth", SEG)] });
    const { result, rerender } = renderHook(
      ({ search }: { search: string }) => useSpreadSchedule({ search }),
      { wrapper: wrapper(), initialProps: { search: "" } },
    );
    await waitFor(() => expect(result.current.rows).toHaveLength(2));

    axios.get.mockReturnValue(new Promise(() => {}));
    rerender({ search: "bt" });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
  });

  it("a filtered dashboard does not change the wizard's unfiltered list", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    axios.get.mockImplementation((_url: string, config?: { params?: object }) =>
      Promise.resolve({
        data: {
          data: {
            initial: false,
            items: config?.params
              ? [coin("sol", SEG)]
              : [coin("btc", "major"), coin("sol", SEG)],
          },
        },
      }),
    );

    const dashboard = renderHook(() => useSpreadSchedule({ segmentId: SEG }), {
      wrapper: wrapper(client),
    });
    const wizard = renderHook(() => useGetCryptoRates(), {
      wrapper: wrapper(client),
    });

    await waitFor(() => expect(dashboard.result.current.rows).toHaveLength(1));
    await waitFor(() => expect(wizard.result.current.data?.items).toHaveLength(2));
  });

  it("invalidating 'get-crypto-rates' refetches the filtered list too", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    respond({ initial: false, items: [coin("sol", SEG)] });
    const { result } = renderHook(() => useSpreadSchedule({ segmentId: SEG }), {
      wrapper: wrapper(client),
    });
    await waitFor(() => expect(result.current.rows).toHaveLength(1));

    await client.invalidateQueries({ queryKey: ["get-crypto-rates"] });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  });
});
