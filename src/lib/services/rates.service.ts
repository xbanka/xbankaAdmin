import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CurrencyConfig, UpdateCryptoRatesArgs } from "../types/rates-types";
import { getAllSegments, getCryptoRates, postCryptoRates, updateCryptoRates } from "../actions/rates";
import { handleApiError } from "../errors/handleApiError";

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
    },
    onError: (err) => {
      handleApiError(err);
    },
  });
};

export const useUpdatesCryptoRates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rateId, payload }: UpdateCryptoRatesArgs) => updateCryptoRates(rateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-crypto-rates"],
      });
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