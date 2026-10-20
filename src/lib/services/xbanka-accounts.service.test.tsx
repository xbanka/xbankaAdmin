import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const actions = vi.hoisted(() => ({
  getXbankaAccounts: vi.fn(),
  createXbankaAccount: vi.fn(),
  updateXbankaAccount: vi.fn(),
  getFundingBanks: vi.fn(),
  lookupFundingAccount: vi.fn(),
}));
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("../actions/xbankaAccountActions", () => actions);
vi.mock("sonner", () => ({ toast }));

import {
  XBANKA_ACCOUNTS_QUERY_KEY,
  useAccountLookup,
  useCreateXbankaAccount,
  useFundingBanks,
  useUpdateXbankaAccount,
  useXbankaAccounts,
} from "./xbanka-accounts.service";
import { accountsResponse, banksResponse, gtb, lookupResponse } from "../utils/xbanka-accounts.fixtures";

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

describe("useXbankaAccounts", () => {
  it("returns accounts with the primary first", async () => {
    actions.getXbankaAccounts.mockResolvedValue({ data: { data: { items: [...accountsResponse.data.items].reverse() } } });
    const { wrapper } = setup();
    const { result } = renderHook(() => useXbankaAccounts(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].id).toBe(gtb.id);
  });
});

describe("mutations refetch the whole list", () => {
  it("after add, and toasts once", async () => {
    actions.createXbankaAccount.mockResolvedValue({ data: {} });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCreateXbankaAccount(), { wrapper });

    await act(() =>
      result.current.mutateAsync({
        bankName: "Access Bank", bankCode: "044", accountNumber: "0987654321", accountName: "N", updatedBy: "u",
      }),
    );

    expect(invalidate).toHaveBeenCalledWith({ queryKey: XBANKA_ACCOUNTS_QUERY_KEY });
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("after make primary (the old primary changes too, so no local patching)", async () => {
    actions.updateXbankaAccount.mockResolvedValue({ data: {} });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useUpdateXbankaAccount(), { wrapper });

    await act(() =>
      result.current.mutateAsync({ accountId: "id", payload: { isPrimary: true, updatedBy: "u" }, successMessage: "Done" }),
    );

    expect(actions.updateXbankaAccount).toHaveBeenCalledWith({
      accountId: "id",
      payload: { isPrimary: true, updatedBy: "u" },
      successMessage: "Done",
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: XBANKA_ACCOUNTS_QUERY_KEY });
    expect(toast.success).toHaveBeenCalledWith("Done");
  });

  it("still refetches and shows the server message on a 409", async () => {
    actions.createXbankaAccount.mockRejectedValue({ status: 409, message: "Account already exists" });
    const { wrapper, invalidate } = setup();
    const { result } = renderHook(() => useCreateXbankaAccount(), { wrapper });

    await act(() =>
      result.current.mutateAsync({
        bankName: "a", bankCode: "1", accountNumber: "0123456789", accountName: "n", updatedBy: "u",
      }).catch(() => {}),
    );

    expect(toast.error).toHaveBeenCalledWith("Account already exists", expect.anything());
    expect(toast.success).not.toHaveBeenCalled();
    expect(invalidate).toHaveBeenCalled();
  });
});

describe("useFundingBanks", () => {
  it("returns sorted banks with string codes", async () => {
    actions.getFundingBanks.mockResolvedValue({ data: banksResponse });
    const { wrapper } = setup();
    const { result } = renderHook(() => useFundingBanks(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((b) => b.code)).toEqual(["044", "058", "100004"]);
  });
});

describe("useAccountLookup", () => {
  it("does nothing until a bank is picked and 10 digits are typed", () => {
    const { wrapper } = setup();
    renderHook(() => useAccountLookup("", "0123456789"), { wrapper });
    renderHook(() => useAccountLookup("044", "012345678"), { wrapper });
    expect(actions.lookupFundingAccount).not.toHaveBeenCalled();
  });

  it("looks up once ready and returns data[0]", async () => {
    actions.lookupFundingAccount.mockResolvedValue({ data: lookupResponse });
    const { wrapper } = setup();
    const { result } = renderHook(() => useAccountLookup("999992", "9082455489"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(actions.lookupFundingAccount).toHaveBeenCalledWith({ accountNumber: "9082455489", bankCode: "999992" });
    expect(result.current.data?.account_name).toBe("JOHN DOE");
  });

  it("treats an empty data array as not found", async () => {
    actions.lookupFundingAccount.mockResolvedValue({ data: { data: [] } });
    const { wrapper } = setup();
    const { result } = renderHook(() => useAccountLookup("044", "0000000000"), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ message: "No account found for this bank and number." });
  });
});
