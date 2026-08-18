import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CurrencyConfig, UpdateCryptoRatesArgs } from "../types/rates-types";
import {
  approveRateProposal,
  bulkAssignSegment,
  getAllSegments,
  getCryptoRates,
  getRateLogDetails,
  getRateLogs,
  getRateProposalDetails,
  getRateProposals,
  postCryptoRates,
  rejectRateProposal,
  UpdateAllSegments,
  updateBuyAndSpreadRates,
} from "../actions/rates";
import { handleApiError } from "../errors/handleApiError";
import { toast } from "sonner";

export const useGetCryptoRates = () => {
  return useQuery({
    queryKey: ["get-crypto-rates"],
    queryFn: getCryptoRates,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-crypto-rates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-segments"],
      });
      toast.success(data?.message || "Status updated successfully");
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useGetAllSegments = () => {
  return useQuery({
    queryKey: ["get-all-segments"],
    queryFn: getAllSegments,
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

export const UseGetRateProposals = () => {
  return useQuery({
    queryKey: ["rate-proposals"],
    queryFn: getRateProposals,
  });
};

export const UseGetRateProposalDetails = (id?: string) => {
  return useQuery({
    queryKey: ["rate-proposal-details", id],
    enabled: !!id,
    queryFn: () => getRateProposalDetails(id!),
  });
};

export const useApproveRateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) =>
      approveRateProposal(proposalId),

    onSuccess: (result) => {
      toast.success(result.data.message);

      queryClient.invalidateQueries({
        queryKey: ["rate-proposals"],
      });

      queryClient.invalidateQueries({
        queryKey: ["rate-logs"],
      });
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useRejectRateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) =>
      rejectRateProposal(proposalId),

    onSuccess: (result) => {
      toast.success(result.data.message);

      queryClient.invalidateQueries({
        queryKey: ["rate-proposals"],
      });

      queryClient.invalidateQueries({
        queryKey: ["rate-logs"],
      });
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const UseGetRateLogs = () => {
  return useQuery({
    queryKey: ["rate-logs"],
    queryFn: getRateLogs,
  });
};

export const UseGetRateLogDetails = (id?: string) => {
  return useQuery({
    queryKey: ["rate-log-details", id],
    enabled: !!id,
    queryFn: () => getRateLogDetails(id!),
  });
};