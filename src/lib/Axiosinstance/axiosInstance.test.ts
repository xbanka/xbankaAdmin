import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

vi.mock("../authToken", () => ({
  authToken: { get: () => "access", set: vi.fn(), remove: vi.fn() },
}));

import AxiosInstance from "./axiosInstance";
import { authToken } from "../authToken";

/**
 * Drives the real interceptors through a fake adapter, so what's asserted is
 * exactly what goes over the wire.
 */
const calls: string[] = [];
let respond: (config: InternalAxiosRequestConfig) => { status: number; data: unknown };

beforeEach(() => {
  calls.length = 0;
  AxiosInstance.defaults.adapter = async (config) => {
    calls.push(config.url ?? "");
    const { status, data } = respond(config);
    const response = {
      status,
      data,
      statusText: "",
      headers: {},
      config,
    };
    if (status >= 400) {
      throw new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, response);
    }
    return response;
  };
});

describe("401 handling for 2FA codes", () => {
  it("does not refresh or retry when the 401 is a wrong 2FA code", async () => {
    respond = () => ({ status: 401, data: { detail: "Invalid code." } });

    await expect(
      AxiosInstance.post("/api/auth/erp/2fa/disable", { password: "pw", code: "000000" }),
    ).rejects.toMatchObject({ status: 401, message: "Invalid code." });

    // One request only: the bad code counts once toward the 5-attempt lockout.
    expect(calls).toEqual(["/api/auth/erp/2fa/disable"]);
  });

  it("same for regenerating recovery codes", async () => {
    respond = () => ({ status: 401, data: { detail: "Invalid code." } });

    await expect(
      AxiosInstance.post("/api/auth/erp/2fa/recovery-codes/regenerate", { code: "000000" }),
    ).rejects.toMatchObject({ status: 401 });
    expect(calls).toEqual(["/api/auth/erp/2fa/recovery-codes/regenerate"]);
  });

  it("still refreshes and retries an expired session", async () => {
    let first = true;
    respond = (config) => {
      if (config.url === "/api/auth/erp/refresh") {
        return { status: 200, data: { access_token: "fresh" } };
      }
      if (first) {
        first = false;
        return { status: 401, data: { detail: "Token expired" } };
      }
      return { status: 200, data: { ok: true } };
    };

    const res = await AxiosInstance.get("/api/erp/me");
    expect(res.data).toEqual({ ok: true });
    expect(calls).toEqual(["/api/erp/me", "/api/auth/erp/refresh", "/api/erp/me"]);
    // The retry reads the token back from the cookie this set.
    expect(authToken.set).toHaveBeenCalledWith("fresh");
  });

  it("never refreshes on the login code step", async () => {
    respond = () => ({ status: 401, data: { detail: "2FA session expired. Log in again." } });

    await expect(
      AxiosInstance.post("/api/auth/erp/login/2fa", { mfa_token: "m", code: "1" }),
    ).rejects.toMatchObject({ status: 401, message: "2FA session expired. Log in again." });
    expect(calls).toEqual(["/api/auth/erp/login/2fa"]);
  });
});
