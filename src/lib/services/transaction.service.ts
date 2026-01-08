import { useMutation, useQuery } from "@tanstack/react-query";
import { handleApiError } from "../errors/handleApiError";
import { createTransactionAction, getAllTransactionsAction, getTransactionByIdAction, uploadTransactionAttachmentAction } from "../actions/transactions";
import { toast } from "sonner";

export const useTransactions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: () => getAllTransactionsAction({ page, limit }),
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransactionByIdAction(transactionId),
    enabled: !!transactionId,
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (payload: any) => createTransactionAction(payload),
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