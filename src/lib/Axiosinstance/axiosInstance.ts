import axios from "axios";
import Cookies from "js-cookie";

const AxiosInstance = axios.create({
  baseURL: "https://xbankadashboardbackend-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token"); // or sessionStorage/cookies
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // const token = localStorage.getItem("accessToken");
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
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
    // if (error.response) {
    //   // Server responded with a status outside 2xx
    //   console.error("API Error:", error.response.status, error.response.data);
    // } else if (error.request) {
    //   // No response received
    //   console.error("No response from server:", error.request);
    // } else {
    //   // Request setup triggered an error
    //   console.error("Request error:", error.message);
    // }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await AxiosInstance.get("/xbankastaff/refresh"); // backend uses cookie
        const newAccessToken = refreshRes.data.accessToken;

        // console.log("new accesstoken", newAccessToken)
        // localStorage.setItem("accessToken", newAccessToken);
        Cookies.set("accessToken", newAccessToken, {
          path: "/",
          sameSite: "strict", // use lax to allow refreshes
          // secure: process.env.NODE_ENV === "production", // only secure in prod
          secure: true, // only secure in prod
        });
        AxiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return AxiosInstance(originalRequest); // retry
      } catch (refreshError) {
        // localStorage.removeItem("accessToken");
        Cookies.remove("accessToken");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/signin";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;

// Response interceptor → handle 401 with refresh flow
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {

//     return Promise.reject(err);
//   }
// );

// export default api;
