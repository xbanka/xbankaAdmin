import AxiosInstance from "../Axiosinstance/axiosInstance";
import {
  CodePayload,
  Disable2faPayload,
  Login2faPayload,
  Login2faResponse,
  RecoveryCodesResponse,
  TotpSetup,
} from "../types/two-factor-types";

/**
 * Every 2FA call. CONFIRMED against the backend's "Staff two-factor
 * authentication (2FA) API" doc.
 *
 * Failures are rethrown as `{ status, message }` so screens can branch on the
 * status (`classifyCodeError`) instead of only toasting.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rethrow = (error: any): never => {
  throw {
    success: false,
    status: error.status,
    message: error.message,
  };
};

/**
 * Second login step. On success the server sets the `access_token` and
 * `refresh_token` cookies, exactly like a normal login.
 *
 * A 401 here never triggers a token refresh: the interceptor skips every
 * `/api/auth/erp/login*` URL.
 */
export const verifyLogin2fa = async (payload: Login2faPayload) => {
  try {
    const response = await AxiosInstance.post<Login2faResponse>(
      "/api/auth/erp/login/2fa",
      payload,
      { withCredentials: true },
    );
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return rethrow(error);
  }
};

/** Generates a fresh pending secret. Safe to call again; it replaces the old one. */
export const start2faSetup = async () => {
  try {
    const response = await AxiosInstance.post<TotpSetup>(
      "/api/auth/erp/2fa/setup",
    );
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return rethrow(error);
  }
};

/** Confirms the first code. Turns 2FA on and returns the recovery codes. */
export const enable2fa = async (payload: CodePayload) => {
  try {
    const response = await AxiosInstance.post<RecoveryCodesResponse>(
      "/api/auth/erp/2fa/enable",
      payload,
    );
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return rethrow(error);
  }
};

/** Wrong password is a 400; wrong code is a 401 that the interceptor leaves alone. */
export const disable2fa = async (payload: Disable2faPayload) => {
  try {
    const response = await AxiosInstance.post<{
      success: boolean;
      message: string;
    }>("/api/auth/erp/2fa/disable", payload);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return rethrow(error);
  }
};

/** Replaces all ten recovery codes. The old ones stop working immediately. */
export const regenerateRecoveryCodes = async (payload: CodePayload) => {
  try {
    const response = await AxiosInstance.post<RecoveryCodesResponse>(
      "/api/auth/erp/2fa/recovery-codes/regenerate",
      payload,
    );
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return rethrow(error);
  }
};

/** Super Admin only. Wipes someone's secret and recovery codes. */
export const resetStaff2fa = async (staffId: string) => {
  try {
    const response = await AxiosInstance.post<{ message: string }>(
      `/api/staff/${encodeURIComponent(staffId)}/2fa/reset`,
    );
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return rethrow(error);
  }
};
