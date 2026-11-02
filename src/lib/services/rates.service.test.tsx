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

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
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
