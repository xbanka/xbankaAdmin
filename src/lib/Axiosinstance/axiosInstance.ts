import axios from "axios";
import { toast } from "sonner";

const AxiosInstance = axios.create({
  baseURL: "https://api.xbankang.com/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

/* ------------------------------
   Refresh Token Locking
-------------------------------- */
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

const logout = () => {
  localStorage.removeItem("accessToken");
  if (typeof window !== "undefined") {
    window.location.replace("/signin");
  }
};

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    /* ---- Hard logout conditions (NO RETRY EVER) ---- */
    if (
      status === 401 &&
      (
        originalRequest?.url?.includes("/api/auth/erp/refresh") ||
        detail === "Refresh token missing" ||
        detail === "Invalid user type"
      )
    ) {
      logout();
      return Promise.reject(error);
    }

    /* ---- Ignore auth routes ---- */
    if (
      originalRequest?.url?.includes("/api/auth/erp/login") ||
      originalRequest?.url?.includes("/api/auth/erp/register") ||
      originalRequest?.url?.includes("/api/auth/erp/verify")
    ) {
      return Promise.reject(error);
    }

    /* ---- Single refresh attempt ---- */
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the ongoing refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(AxiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await AxiosInstance.post(
          "/api/auth/erp/refresh",
          {}
        );

        const newAccessToken = refreshResponse.data?.access_token;
        if (!newAccessToken) {
          throw new Error("No access token returned");
        }

        localStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /* ---- Normalized error ---- */
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      success: false,
      status: status || 500,
      message: apiMessage,
      raw: error,
    });
  }
);

export default AxiosInstance;
