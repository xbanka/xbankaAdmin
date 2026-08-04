import AxiosInstance from "../Axiosinstance/axiosInstance";

export const getTransactionMetrics = async () => {
  const response = await AxiosInstance.get("/api/dashboard/erp/transactions/metrics");
  return response.data;
};

export const getCustomerMetrics = async () => {
  const response = await AxiosInstance.get("/api/dashboard/erp/customer/metrics");
  return response.data;
};