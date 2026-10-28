import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("../Axiosinstance/axiosInstance", () => ({ default: { post } }));

import {
  disable2fa,
  enable2fa,
  regenerateRecoveryCodes,
  resetStaff2fa,
  start2faSetup,
  verifyLogin2fa,
} from "./twoFactorActions";

beforeEach(() => {
  post.mockReset().mockResolvedValue({ data: { ok: true }, status: 200 });
});

describe("2FA requests", () => {
  it("sends the second login step with credentials so the cookies land", async () => {
    await verifyLogin2fa({ mfa_token: "mfa", code: "123456" });
    expect(post).toHaveBeenCalledWith(
      "/api/auth/erp/login/2fa",
      { mfa_token: "mfa", code: "123456" },
      { withCredentials: true },
    );
  });

  it("starts setup with no body", async () => {
    await start2faSetup();
    expect(post).toHaveBeenCalledWith("/api/auth/erp/2fa/setup");
  });

  it("enables with the code", async () => {
    await enable2fa({ code: "123456" });
    expect(post).toHaveBeenCalledWith("/api/auth/erp/2fa/enable", { code: "123456" });
  });

  it("disables with password and code", async () => {
    await disable2fa({ password: "pw", code: "ABCDE-FGHJK" });
    expect(post).toHaveBeenCalledWith("/api/auth/erp/2fa/disable", {
      password: "pw",
      code: "ABCDE-FGHJK",
    });
  });

  it("regenerates recovery codes with a code", async () => {
    await regenerateRecoveryCodes({ code: "123456" });
    expect(post).toHaveBeenCalledWith("/api/auth/erp/2fa/recovery-codes/regenerate", {
      code: "123456",
    });
  });

  it("resets a staff member's 2FA, escaping the id", async () => {
    await resetStaff2fa("a/b");
    expect(post).toHaveBeenCalledWith("/api/staff/a%2Fb/2fa/reset");
  });

  it("returns the body wrapped like the other actions", async () => {
    post.mockResolvedValue({ data: { recovery_codes: ["A"] }, status: 200 });
    await expect(enable2fa({ code: "123456" })).resolves.toEqual({
      success: true,
      data: { recovery_codes: ["A"] },
      status: 200,
    });
  });

  it("rethrows status and message so screens can branch on them", async () => {
    post.mockRejectedValue({ status: 401, message: "Invalid code.", raw: {} });
    await expect(disable2fa({ password: "pw", code: "1" })).rejects.toEqual({
      success: false,
      status: 401,
      message: "Invalid code.",
    });
  });
});
