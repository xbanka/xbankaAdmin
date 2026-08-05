import { useQuery } from "@tanstack/react-query";
import { getCustomerMetrics, getTransactionMetrics } from "../actions/dashboardActions";

export const useGetTransactionMetrics = () => {
  return useQuery({
    queryKey: ["transaction-metrics"],
    queryFn: getTransactionMetrics,
    retry: false,
  });
};

export const useGetCustomerMetrics = () => {
  return useQuery({
    queryKey: ["customer-metrics"],
    queryFn: getCustomerMetrics,
    retry: false,
  });
};