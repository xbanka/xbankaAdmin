import { createCustomer, getCustomers } from "@/lib/actions/customerAction";
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
