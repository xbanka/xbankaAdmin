import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CryptoCurrencyTypes,
  CurrencyConfig,
  UpdateCryptoRatesArgs,
} from "../types/rates-types";
import { getConfiguredSegmentIds, keepSegments } from "../utils/rates";
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

// Assets in the given segments only. An empty list means "no segments", so
// the request is skipped rather than sent unfiltered (which returns every
// asset). The key sits under "get-crypto-rates" so existing invalidations
// still refetch it.
export const useGetCryptoRates = (segmentIds: string[]) => {
  const ids = [...segmentIds].sort();
  return useQuery({
    queryKey: ["get-crypto-rates", ids],
    queryFn: () => getCryptoRates(ids),
    enabled: ids.length > 0,
    select: (res: { data?: CryptoCurrencyTypes[] }) => ({
      ...res,
      data: keepSegments(res?.data, ids),
    }),
  });
};

// The dashboard's spread schedule: segments where at least one asset has a
// non-zero spread, then the assets in those segments from the backend.
export const useSpreadSchedule = () => {
  const segments = useGetAllSegments();
  const segmentIds = getConfiguredSegmentIds(segments.data?.data);
  const rates = useGetCryptoRates(segmentIds);

  const hasSegments = segmentIds.length > 0;
  const rows: CryptoCurrencyTypes[] = hasSegments ? (rates.data?.data ?? []) : [];
  const isLoading = segments.isPending || (hasSegments && rates.isPending);
  const error = segments.error ?? (hasSegments ? rates.error : null);

  return {
    rows,
    isLoading,
    error,
    isEmpty: !isLoading && !error && rows.length === 0,
  };
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
      toast.success(result.message);

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
      toast.success(result.message);

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