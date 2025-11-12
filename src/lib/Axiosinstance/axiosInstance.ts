import axios from "axios";

const AxiosInstance = axios.create({
  // baseURL: "https://xbankadashboardbackend-production.up.railway.app/",
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config) => {
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
        await AxiosInstance.get("/xbankastaff/refresh", {
          withCredentials: true,
        }); // backend uses cookie
        return AxiosInstance(originalRequest);

      } catch (refreshError) {
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
