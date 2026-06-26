import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CurrencyConfig, UpdateCryptoRatesArgs } from "../types/rates-types";
import {
  bulkAssignSegment,
  getAllSegments,
  getCryptoRates,
  postCryptoRates,
  UpdateAllSegments,
  updateBuyAndSpreadRates,
} from "../actions/rates";
import { handleApiError } from "../errors/handleApiError";
import { toast } from "sonner";

export const useGetCryptoRates = () => {
  return useQuery({
    queryKey: ["get-crypto-rates"],
    queryFn: async () => {
      try {
        const response = await getCryptoRates();
        return response;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
};

export const usePostCryptoRates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CurrencyConfig) => postCryptoRates(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-crypto-rates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-segments"],
      });
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useUpdateBuyAndSpreadRates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rateId, payload }: UpdateCryptoRatesArgs) =>
      updateBuyAndSpreadRates(rateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-crypto-rates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-segments"],
      });
      toast.success("Status updated successfully");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useGetAllSegments = () => {
  return useQuery({
    queryKey: ["get-all-segments"],
    queryFn: async () => {
      try {
        const response = await getAllSegments();
        return response;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
};

export const useUpdateAllSegments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateAllSegments,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-segments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-crypto-rates"],
      });
      toast.success("Bulk segment updated successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
};

export const useBulkAssignSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      segmentId,
      payload,
    }: {
      segmentId: string;
      payload: {
        assetIds: string[];
        setupNote: string;
      };
    }) => bulkAssignSegment(segmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-segments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-crypto-rates"],
      });
      toast.success("Bulk segment updated successfully");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
};
