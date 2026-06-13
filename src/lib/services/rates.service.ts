import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CurrencyConfig } from "../types/rates-types";
import { getCryptoRates, postCryptoRates } from "../actions/rates";
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