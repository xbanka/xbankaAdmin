import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "../errors/handleApiError";
import {
  createManualTransaction,
  createTransactionAction,
  exportTransactions,
  getAllTransactions,
  getAllTransactionsAction,
  getAllTransactionsByCustomer,
  getTransactionById,
  getTransactionByIdAction,
  GetTransactionsParams,
  uploadTransactionAttachmentAction,
} from "../actions/transactions";
import { toast } from "sonner";
import { CreateTransactionPayload } from "@/components/transaction/transaction-data";
import { downloadBlob } from "../utils/downloadBlob";

export const useTransactions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: async () => {
      try {
        const response = await getAllTransactionsAction({ page, limit });
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      try {
        const response = await getTransactionByIdAction(transactionId);
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
    enabled: !!transactionId,
  });
};
export const useGetTransactionByCustomer = (customer_id: string) => {
  return useQuery({
    queryKey: ["transaction", customer_id],
    queryFn: async () => {
      try {
        const response = await getAllTransactionsByCustomer(customer_id);
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
    enabled: !!customer_id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransactionAction(payload),
    onSuccess: () => {
      toast.success("Transaction created successfully");
      // ✅ Invalidate transactions list (all pages & limits)
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      // ✅ Invalidate individual transaction queries
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
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

export const useGetAllTransactions = (params: GetTransactionsParams) => {
  return useQuery({
    queryKey: ["get-all-transactions", params],
    queryFn: async () => {
      try {
        const response = await getAllTransactions(params);
        return response;
      } catch (error) {
        handleApiError(error);
      }
    },
    placeholderData: (previousData) => previousData, // keep old page while fetching next
  });
};

export const useGetTransactionById = (transactionId: string | null) => {
  return useQuery({
    queryKey: ["get-transaction", transactionId],
    queryFn: async () => {
      try {
        const response = await getTransactionById(transactionId!);
        return response;
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!transactionId, // only fires when an ID is passed
  });
};

export const useExportTransactions = () => {
  return useMutation({
    mutationFn: exportTransactions,

    onSuccess: (blob) => {
      downloadBlob(blob, "transactions.xlsx");
      toast.success("Export started");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useCreateManualTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createManualTransaction,

    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-all-transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });

      console.log(queryClient.getQueryState(["transactions", 1, 10]));
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};
