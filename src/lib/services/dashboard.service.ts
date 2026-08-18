import { useQuery } from "@tanstack/react-query";
import {
  getCustomerMetrics,
  getTransactionMetrics,
} from "../actions/dashboardActions";

export const useGetTransactionMetrics = () => {
  return useQuery({
    queryKey: ["transaction-metrics"],
    queryFn: getTransactionMetrics,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetCustomerMetrics = () => {
  return useQuery({
    queryKey: ["customer-metrics"],
    queryFn: getCustomerMetrics,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
