import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const actions = vi.hoisted(() => ({
  getFundingIntents: vi.fn(),
  completeFundingIntent: vi.fn(),
  rejectFundingIntent: vi.fn(),
  uploadFundingAttachment: vi.fn(),
  lookupFundingCustomer: vi.fn(),
  creditFundingDirectly: vi.fn(),
}));
const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn(), error: vi.fn() }));
vi.mock("../actions/fundingActions", () => actions);
vi.mock("sonner", () => ({ toast }));

import {
  FUNDING_INTENTS_QUERY_KEY,
  uploadProofFile,
  useCompleteFundingIntent,
  useCreditFundingDirectly,
  useFundingLookup,
  useGetFundingIntents,
  useRejectFundingIntent,
} from "./funding.service";
import { creditResult, intentsResponse, lookupMatch } from "../utils/funding.fixtures";

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

describe("useFundingLookup", () => {
  it("does not call the backend until the account number is 10 digits", () => {
    const { wrapper } = setup();
    renderHook(() => useFundingLookup("70541782"), { wrapper });
    expect(actions.lookupFundingCustomer).not.toHaveBeenCalled();
  });

  it("returns the matches for a full account number", async () => {
    actions.lookupFundingCustomer.mockResolvedValue({ data: [lookupMatch] });
    const { wrapper } = setup();

    const { result } = renderHook(() => useFundingLookup("7054178290"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(actions.lookupFundingCustomer).toHaveBeenCalledWith({ accountNumber: "7054178290" });
    expect(result.current.data).toEqual([lookupMatch]);
  });

  it("returns an empty list when nobody registered the account", async () => {
    actions.lookupFundingCustomer.mockResolvedValue({ data: [] });
    const { wrapper } = setup();

    const { result } = renderHook(() => useFundingLookup("7054178290"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("surfaces a failure without retrying on its own", async () => {
    actions.lookupFundingCustomer.mockRejectedValue({ status: 502, message: "unreachable" });
    const { wrapper } = setup();

    const { result } = renderHook(() => useFundingLookup("7054178290"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(actions.lookupFundingCustomer).toHaveBeenCalledTimes(1);
  });
});

describe("useCreditFundingDirectly", () => {
  const payload = {
    fundingAccountId: lookupMatch.fundingAccountId,
    amount: 2000,
    reference: "100004261006204500123456",
    creditedBy: "ops@xbanka.com",
  };

  it("returns the credit result and refreshes the intents list, with no toast", async () => {
    actions.creditFundingDirectly.mockResolvedValue({ data: creditResult });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCreditFundingDirectly(), { wrapper });

    const credited = await act(() => result.current.mutateAsync(payload));

    expect(actions.creditFundingDirectly).toHaveBeenCalledWith(payload);
    expect(credited).toEqual(creditResult);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: FUNDING_INTENTS_QUERY_KEY });
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("passes a duplicate result through as a success", async () => {
    actions.creditFundingDirectly.mockResolvedValue({ data: { ...creditResult, duplicate: true } });
    const { wrapper } = setup();
    const { result } = renderHook(() => useCreditFundingDirectly(), { wrapper });

    const credited = await act(() => result.current.mutateAsync(payload));

    expect(credited.duplicate).toBe(true);
  });

  it("leaves error display to the caller: no toast, status kept", async () => {
    actions.creditFundingDirectly.mockRejectedValue({ status: 409, message: "Reference already used" });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCreditFundingDirectly(), { wrapper });

    await act(() => result.current.mutateAsync(payload).catch(() => {}));

    await waitFor(() => expect(result.current.error).toMatchObject({ status: 409 }));
    expect(toast.error).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
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
