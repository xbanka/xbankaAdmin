import { useMutation, useQuery } from "@tanstack/react-query";
import { handleApiError } from "../errors/handleApiError";
import { createTransactionAction, getAllTransactionsAction, getTransactionByIdAction, uploadTransactionAttachmentAction } from "../actions/transactions";
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
        return handleApiError(err)
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
        return handleApiError(err)
      }
    },
    enabled: !!transactionId,
  });
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createTransactionAction(payload),
    onSuccess: () => {
      toast.success("Transaction created successfully");
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