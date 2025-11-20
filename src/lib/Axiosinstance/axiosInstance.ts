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
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/erp/login") &&
      !originalRequest.url.includes("/api/auth/erp/register") &&
      !originalRequest.url.includes("/api/auth/erp/verify")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await AxiosInstance.post("/api/auth/erp/refresh", {
          withCredentials: true,
        }); // backend uses cookie
        console.log(refreshResponse);

        const newAccessToken = refreshResponse.data?.access_token;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return AxiosInstance({
          ...originalRequest,
          method: originalRequest.method || "get",
          data: originalRequest.data || undefined,
        });
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/signin";
        }
        console.log(refreshError);
        return Promise.reject(refreshError);
      }
    }
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data?.errors?.[0] ||
      null;

    const customError = {
      success: false,
      status: error.response?.status || 500,
      message:
        apiMessage ||
        (error.request
          ? "No response from server. Please try again later."
          : error.message || "Something went wrong"),
      raw: error, // keep raw error if you need debugging
    };

    return Promise.reject(customError);
  }
);

export default AxiosInstance;
