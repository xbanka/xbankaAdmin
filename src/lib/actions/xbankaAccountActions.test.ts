import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, post, patch } = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }));
vi.mock("../Axiosinstance/axiosInstance", () => ({ default: { get, post, patch } }));

import {
  createXbankaAccount,
  getFundingBanks,
  getXbankaAccounts,
  lookupFundingAccount,
  updateXbankaAccount,
} from "./xbankaAccountActions";

const ID = "a48c1a83-63a5-4f2a-8e01-18386ebe021f";
const BASE = "/api/transactions/funding";

beforeEach(() => {
  [get, post, patch].forEach((m) => m.mockReset().mockResolvedValue({ data: {}, status: 200 }));
});

describe("xbanka account requests", () => {
  it("lists accounts with no params", async () => {
    await getXbankaAccounts();
    expect(get).toHaveBeenCalledWith(`${BASE}/xbanka-accounts`);
  });

  it("creates an account and accepts 200 as well as 201", async () => {
    post.mockResolvedValue({ data: { data: { id: ID } }, status: 200 });
    const payload = {
      bankName: "Access Bank",
      bankCode: "044",
      accountNumber: "0987654321",
      accountName: "XBANKA TECHNOLOGIES LTD",
      isPrimary: false,
      updatedBy: "ops@xbanka.com",
    };
    const res = await createXbankaAccount(payload);
    expect(post).toHaveBeenCalledWith(`${BASE}/xbanka-accounts`, payload);
    expect(res.success).toBe(true);
  });

  it("PATCHes only what it is given (make primary)", async () => {
    await updateXbankaAccount({ accountId: ID, payload: { isPrimary: true, updatedBy: "ops@xbanka.com" } });
    expect(patch).toHaveBeenCalledWith(`${BASE}/xbanka-accounts/${ID}`, {
      isPrimary: true,
      updatedBy: "ops@xbanka.com",
    });
  });

  it("PATCHes hide as just isActive + updatedBy", async () => {
    await updateXbankaAccount({ accountId: ID, payload: { isActive: false, updatedBy: "o" } });
    expect(patch.mock.calls[0][1]).toEqual({ isActive: false, updatedBy: "o" });
  });

  it("rethrows with the status so a 409 can be told apart", async () => {
    post.mockRejectedValue({ status: 409, message: "Account already exists" });
    await expect(
      createXbankaAccount({ bankName: "a", bankCode: "1", accountNumber: "0123456789", accountName: "n", updatedBy: "u" }),
    ).rejects.toEqual({ success: false, status: 409, message: "Account already exists" });
  });
});

describe("bank list and lookup requests", () => {
  it("fetches the banks", async () => {
    await getFundingBanks();
    expect(get).toHaveBeenCalledWith(`${BASE}/banks`);
  });

  it("looks up with the bank code as a string", async () => {
    await lookupFundingAccount({ accountNumber: "9082455489", bankCode: "044" });
    expect(post).toHaveBeenCalledWith(`${BASE}/accounts/lookup`, {
      accountNumber: "9082455489",
      bankCode: "044",
    });
  });
});
