import axios from "axios";

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
    if (
      error.response?.status === 401 &&
      originalRequest?.url?.includes("/api/auth/erp/refresh")
    ) {
      localStorage.removeItem("accessToken");

      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }

      return Promise.reject(error);
    }
    if (
      error.response?.status === 401 &&
      error.response?.data?.detail === "Refresh token missing"
    ) {
      localStorage.removeItem("accessToken");

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
        localStorage.removeItem("accessToken");
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
        ); // backend uses cookie

        const newAccessToken = refreshResponse.data?.access_token;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          };
        }
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      "Something went wrong" ||
      String(error);

    const customError = {
      success: false,
      status: error.response?.status || 500,
      message: apiMessage,
      raw: error, // keep raw error if you need debugging
    };

    return Promise.reject(customError);
  }
);

export default AxiosInstance;
