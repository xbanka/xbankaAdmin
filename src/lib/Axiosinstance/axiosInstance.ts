import axios from "axios";
import { authToken } from "../authToken";

const AxiosInstance = axios.create({
  baseURL: "https://api.xbankang.com/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = authToken.get();
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
    if (
      error.response?.status === 401 &&
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
    } else {
      apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.errors?.[0] ||
        error.message ||
        "Something went wrong";
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
  }
);

export default AxiosInstance;
