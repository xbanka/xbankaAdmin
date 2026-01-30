import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "../errors/handleApiError";
import { createTransactionAction, getAllTransactionsAction, getAllTransactionsByCustomer, getTransactionByIdAction, uploadTransactionAttachmentAction } from "../actions/transactions";
import { toast } from "sonner";
import { CreateTransactionPayload } from "@/components/transaction/transaction-data";

export const useTransactions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: async() => {
      try{
        const response = await getAllTransactionsAction({ page, limit })
        return response
      }catch(err){
        handleApiError(err)
      }
    },
  });
};

export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async() => {
      try{
        const response = await getTransactionByIdAction(transactionId)
        return response
      }catch(err){
        handleApiError(err)
      }
    },
    enabled: !!transactionId,
  });
};
export const useGetTransactionByCustomer = (customer_id: string) => {
  return useQuery({
    queryKey: ["transaction", customer_id],
    queryFn: async() => {
      try{
        const response = await getAllTransactionsByCustomer(customer_id)
        return response
      }catch(err){
        handleApiError(err)
      }
    },
    enabled: !!customer_id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createTransactionAction(payload),
    onSuccess: () => {
      toast.success("Transaction created successfully");
      // ✅ Invalidate transactions list (all pages & limits)
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      // ✅ Invalidate individual transaction queries
      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useUploadTransactionAttachment = () => {
  return useMutation({
    mutationFn: uploadTransactionAttachmentAction,
    onSuccess: () => {
      toast.success("Attachment uploaded successfully");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};