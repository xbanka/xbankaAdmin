import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getTransactionMetrics = async () => {
  const response = await AxiosInstance.get("/api/dashboard/erp/transactions/metrics");
  return response.data;
};

export const getCustomerMetrics = async () => {
  const response = await AxiosInstance.get("/api/dashboard/erp/customer/metrics");
  return response.data;
};

export const exportDashboardMetrics = async () => {
  const response = await AxiosInstance.get("/api/dashboard/erp/metrics/export", {
    responseType: "blob",
    withCredentials: true,
  });

  return response.data as Blob;
};