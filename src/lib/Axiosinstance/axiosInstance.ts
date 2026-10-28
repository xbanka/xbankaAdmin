import axios from "axios";
import { authToken } from "../authToken";
import { refreshAccessToken } from "../refresh-token";
import { useAuthStore } from "../../store/useAuthState";

/**
 * Picks the first usable string out of an error body.
 *
 * FastAPI answers a 422 with an *array* of validation objects in `detail`.
 * Handed straight to a toast, that array reaches React as a child and throws,
 * turning a bad request into a blank screen — so only strings qualify, and
 * anything else falls through to the generic message.
 */
const firstMessage = (...candidates: unknown[]): string | undefined =>
  candidates.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

console.log(AxiosInstance.defaults.baseURL);

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = authToken.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle errors globally
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest?.url?.includes("/api/auth/erp/refresh")
    ) {
      authToken.remove();

      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }

      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      error.response?.data?.detail === "Refresh token missing"
    ) {
      authToken.remove();

      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }

      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      error.response?.data?.detail === "Invalid user type"
    ) {
      if (typeof window !== "undefined") {
        authToken.remove();
        window.location.href = "/signin";
      }
      return Promise.reject(error);
    }
    // A wrong 2FA code on /2fa/disable or /2fa/recovery-codes/regenerate is a
    // 401 "Invalid code." on a perfectly valid session. Refreshing and
    // retrying would resend the same bad code and burn a second of the five
    // attempts before the 15-minute lockout, so it goes straight to the caller.
    const isWrong2faCode =
      error.response?.status === 401 &&
      error.response?.data?.detail === "Invalid code.";
    if (
      error.response?.status === 401 &&
      !isWrong2faCode &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/erp/login") &&
      !originalRequest.url.includes("/api/auth/erp/register") &&
      !originalRequest.url.includes("/api/auth/erp/verify")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await AxiosInstance.post(
          "/api/auth/erp/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.access_token;
        if (newAccessToken) {
          authToken.set(newAccessToken);
          // The notifications socket (and anything else on the auth store)
          // reads its token from the store, not the cookie — left unsynced,
          // it reconnects with the expired token in a 403 loop until reload.
          useAuthStore.getState().login(newAccessToken);
          // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          };
        }
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          authToken.remove();
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    // NETWORK / TIMEOUT HANDLING
    let apiMessage = "Something went wrong";
    let status = error.response?.status || 500;

    if (error.code === "ECONNABORTED") {
      apiMessage = "Network timeout. Please check your connection.";
      status = 408;
    } else if (!error.response) {
      apiMessage = "Network error. Please check your internet connection.";
      status = 503;
    } else if (
      error.response.data instanceof Blob &&
      error.response.data.type.includes("json")
    ) {
      // responseType: 'blob' requests get their error body blob-encoded too,
      // so it has to be read back out as text before it can be parsed as JSON.
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        apiMessage =
          firstMessage(
            parsed?.message,
            parsed?.error,
            parsed?.detail,
            parsed?.errors?.[0],
          ) || "Something went wrong";
      } catch {
        apiMessage = error.message || "Something went wrong";
      }
    } else {
      apiMessage =
        firstMessage(
          error.response?.data?.message,
          error.response?.data?.error,
          error.response?.data?.detail,
          error.response?.data?.errors?.[0],
          error.message,
        ) || "Something went wrong";
    }

    const customError = {
      success: false,
      status,
      message: apiMessage,
      raw: error,
    };
    // const apiMessage =
    //   error.response?.data?.message ||
    //   error.response?.data?.error ||
    //   error.response?.data?.detail ||
    //   error.response?.data?.errors?.[0] ||
    //   error.message ||
    //   "Something went wrong" ||
    //   String(error);

    // const customError = {
    //   success: false,
    //   status: error.response?.status || 500,
    //   message: apiMessage,
    //   raw: error, // keep raw error if you need debugging
    // };

    return Promise.reject(customError);
  },
);

export default AxiosInstance;
