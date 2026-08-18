import {
  createCustomer,
  DeleteCustomer,
  exportCustomers,
  getAllCustomers,
  getCustomerAssets,
  getCustomerById,
  getCustomerKyc,
  getCustomers,
  getCustomerTransactions,
  getCustomerVerification,
  toggleCustomerStatus,
} from "@/lib/actions/customerAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "sonner";
import { handleApiError } from "../errors/handleApiError";
import { GetCustomersParams } from "../types/customer";
import { downloadBlob } from "../utils/downloadBlob";

export const useGetAllCustomers = ({
  page = 1,
  limit = 10,
  search,
  status,
  startDate,
  endDate,
}: GetCustomersParams) => {
  const debouncedSearch = useDebounce(search ?? "", 500);

  return useQuery({
    queryKey: [
      "customers",
      page,
      limit,
      debouncedSearch,
      status,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getAllCustomers({
        page,
        limit,
        search: debouncedSearch || undefined,
        status,
        startDate,
        endDate,
      }),
  });
};

export const useGetCustomer = (search: string) => {
  const debouncedSearch = useDebounce(search, 500);
  return useQuery({
    queryKey: ["customers", debouncedSearch],
    queryFn: () => getCustomers(debouncedSearch),
    enabled: debouncedSearch !== undefined,
  });
};

export const useGetCustomerById = (customerId?: string) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId!),
    enabled: !!customerId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useEditCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useGetCustomerVerification = (customerId: string) => {
  return useQuery({
    queryKey: ["customer-verification", customerId],
    queryFn: () => getCustomerVerification(customerId!),
    enabled: !!customerId,
  });
};

export const useGetCustomerAssets = (customerId: string) => {
  return useQuery({
    queryKey: ["customer-assets", customerId],
    queryFn: () => getCustomerAssets(customerId!),
    enabled: !!customerId,
  });
};

export const useGetCustomerTransactions = (customerId: string, limit = 1) => {
  return useQuery({
    queryKey: ["customer-transactions", customerId, limit],
    queryFn: () => getCustomerTransactions(customerId!),
    enabled: !!customerId,
  });
};

export const useToggleCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCustomerStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-profile"],
      });

      toast.success("Customer status updated successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useExportCustomers = () => {
  return useMutation({
    mutationFn: exportCustomers,

    onSuccess: (blob) => {
      downloadBlob(blob, "customers.xlsx");
      toast.success("Export started");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useGetCustomerKyc = (customerId: string) => {
  return useQuery({
    queryKey: ["customer-kyc", customerId],
    queryFn: () => getCustomerKyc(customerId),
    enabled: !!customerId,
  });
};