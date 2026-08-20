import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  exportDashboardMetrics,
  getCustomerMetrics,
  getTransactionMetrics,
} from "../actions/dashboardActions";
import { downloadBlob } from "../utils/downloadBlob";
import { handleApiError } from "../errors/handleApiError";

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

export const useExportDashboardMetrics = () => {
  return useMutation({
    mutationFn: exportDashboardMetrics,

    onSuccess: (blob) => {
      downloadBlob(blob, "dashboard-metrics.xlsx");
      toast.success("Export started");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};
