import { createCustomer, DeleteCustomer, getCustomerById, getCustomers } from "@/lib/actions/customerAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "sonner";
import { handleApiError } from "../errors/handleApiError";

export const useGetCustomer = (search: string) => {
  const debouncedSearch = useDebounce(search, 500);
  return useQuery({
    queryKey: ["customers", debouncedSearch],
    queryFn: () => {
      try{
        const response = getCustomers(debouncedSearch)
        return response
      }catch(error){
        handleApiError(error)
      }
    },
    enabled: debouncedSearch !== undefined,
  });
};

export const useGetCustomerById = (customerId?: string) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      try {
        return await getCustomerById(customerId!);
      } catch (error) {
        handleApiError(error);
      }
    },
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
