import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const actions = vi.hoisted(() => ({
  getFundingIntents: vi.fn(),
  completeFundingIntent: vi.fn(),
  rejectFundingIntent: vi.fn(),
  uploadFundingAttachment: vi.fn(),
}));
const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn(), error: vi.fn() }));
vi.mock("../actions/fundingActions", () => actions);
vi.mock("sonner", () => ({ toast }));

import {
  FUNDING_INTENTS_QUERY_KEY,
  uploadProofFile,
  useCompleteFundingIntent,
  useGetFundingIntents,
  useRejectFundingIntent,
} from "./funding.service";
import { intentsResponse } from "../utils/funding.fixtures";

const ID = "3f6c1d52-8a41-4b7e-9c0d-2e5a7b1f4c90";

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidate };
}

beforeEach(() => {
  Object.values(actions).forEach((fn) => fn.mockReset());
  Object.values(toast).forEach((fn) => fn.mockReset());
});

describe("useGetFundingIntents", () => {
  it("returns items and meta from the backend body", async () => {
    actions.getFundingIntents.mockResolvedValue({ data: intentsResponse });
    const { wrapper } = setup();

    const { result } = renderHook(() => useGetFundingIntents({ status: "pending" }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0].customer.name).toBe("Ada Tester");
    expect(result.current.data?.meta.totalItems).toBe(1);
  });

  it("does not refetch while a partial account number is typed", async () => {
    actions.getFundingIntents.mockResolvedValue({ data: intentsResponse });
    const { wrapper } = setup();

    const { result, rerender } = renderHook(
      ({ accountNumber }) => useGetFundingIntents({ status: "pending", accountNumber }),
      { wrapper, initialProps: { accountNumber: "" } },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ accountNumber: "00000" });
    rerender({ accountNumber: "000000000" });
    expect(actions.getFundingIntents).toHaveBeenCalledTimes(1);

    rerender({ accountNumber: "0000000001" });
    await waitFor(() => expect(actions.getFundingIntents).toHaveBeenCalledTimes(2));
  });
});

describe("useCompleteFundingIntent", () => {
  const vars = { transactionId: ID, payload: { bankReference: "NIP1", creditedBy: "ops@xbanka.com" } };

  it("refetches the list and toasts once on a fresh credit", async () => {
    actions.completeFundingIntent.mockResolvedValue({ data: { duplicate: false, transactionId: ID } });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCompleteFundingIntent(), { wrapper });

    await act(() => result.current.mutateAsync(vars));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: FUNDING_INTENTS_QUERY_KEY });
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.info).not.toHaveBeenCalled();
  });

  it("treats duplicate: true as success without a second 'credited' toast", async () => {
    actions.completeFundingIntent.mockResolvedValue({ data: { duplicate: true, transactionId: ID } });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCompleteFundingIntent(), { wrapper });

    await act(() => result.current.mutateAsync(vars));

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalled();
  });

  it("refetches on 409 (settled elsewhere) and shows the server message", async () => {
    actions.completeFundingIntent.mockRejectedValue({ status: 409, message: "Already settled" });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCompleteFundingIntent(), { wrapper });

    await act(() => result.current.mutateAsync(vars).catch(() => {}));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: FUNDING_INTENTS_QUERY_KEY });
    expect(toast.error).toHaveBeenCalledWith("Already settled", expect.anything());
  });

  it("does not refetch on other errors", async () => {
    actions.completeFundingIntent.mockRejectedValue({ status: 422, message: "bad" });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCompleteFundingIntent(), { wrapper });

    await act(() => result.current.mutateAsync(vars).catch(() => {}));

    expect(invalidate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});

describe("useRejectFundingIntent", () => {
  it("refetches and toasts on reject", async () => {
    actions.rejectFundingIntent.mockResolvedValue({ data: { duplicate: false, status: "FAILED" } });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useRejectFundingIntent(), { wrapper });

    await act(() =>
      result.current.mutateAsync({ transactionId: ID, payload: { rejectedBy: "ops", reason: "none" } }),
    );

    expect(invalidate).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Funding request rejected.");
  });
});

describe("uploadProofFile", () => {
  const file = new File(["x"], "proof.png");

  it("resolves to the returned URL", async () => {
    actions.uploadFundingAttachment.mockResolvedValue({ data: { url: "https://s3/proof.png" } });
    await expect(uploadProofFile(file)).resolves.toBe("https://s3/proof.png");
  });

  it("rejects when the response carries no URL", async () => {
    actions.uploadFundingAttachment.mockResolvedValue({ data: { message: "ok" } });
    await expect(uploadProofFile(file)).rejects.toMatchObject({ message: "No URL returned for proof.png" });
  });
});
