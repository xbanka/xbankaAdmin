import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CurrencyConfig, UpdateCryptoRatesArgs } from "../types/rates-types";
import {
  buildCryptoRatesParams,
  CryptoRatesFilters,
  hasCryptoRatesFilters,
  parseCryptoRates,
} from "../utils/rates";
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

// Crypto assets from crypto/all. With no filters it is every asset (the
// wizard relies on that). `initial` is the backend's flag for "no spread
// schedule set up yet" and is computed across all assets, so filters never
// change it. Keys all start with "get-crypto-rates", so the existing
// invalidations refetch filtered and unfiltered lists alike.
export const useGetCryptoRates = (filters?: CryptoRatesFilters) => {
  const params = buildCryptoRatesParams(filters);
  const filtered = hasCryptoRatesFilters(params);
  return useQuery({
    queryKey: filtered ? ["get-crypto-rates", params] : ["get-crypto-rates"],
    queryFn: () => getCryptoRates(filtered ? params : undefined),
    select: (res: { data?: Parameters<typeof parseCryptoRates>[0] }) =>
      parseCryptoRates(res?.data),
    // Keep the last list on screen while a new filter loads, so typing in
    // the search box does not flash the table into a loading state.
    placeholderData: keepPreviousData,
  });
};

// The dashboard's spread schedule. The empty state shows only when the
// backend says initial: true; otherwise the (possibly filtered) items are
// listed. An empty filtered list is "nothing matched", not the empty state.
export const useSpreadSchedule = (filters?: CryptoRatesFilters) => {
  const { data, isPending, isFetching, error } = useGetCryptoRates(filters);

  return {
    rows: data?.items ?? [],
    isLoading: isPending,
    isFetching,
    error,
    isEmpty: !isPending && !error && data?.initial === true,
    isFiltered: hasCryptoRatesFilters(buildCryptoRatesParams(filters)),
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