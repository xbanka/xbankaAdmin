
import { getIndividualPayout, processPayout, rejectPayout } from "@/lib/actions/payout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleApiError } from "../errors/handleApiError";

export const useIndividualPayout = (payoutId: string | null) => {
  return useQuery({
   queryKey: ["individualPayout", payoutId],
    queryFn: async({ queryKey }) => {
      try{
        const response = await getIndividualPayout(queryKey[1]!)
        return response
      }catch(error){
        handleApiError(error)
      }
    },
    enabled: !!payoutId,
  });
};

export const useProcessPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payoutId: string) => processPayout(payoutId),

    onSuccess: (_data, payoutId) => {
      // Invalidate payouts list
      queryClient.invalidateQueries({ queryKey: ["payouts"] });

      // Invalidate individual payout
      queryClient.invalidateQueries({
        queryKey: ["individualPayout", payoutId],
      });
      toast.success("Payout confirmed")
    },

    onError: (error) => {
      handleApiError(error)
    },
  });
};

export const useRejectPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payoutId: string) => rejectPayout(payoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });

      // Invalidate individual payout
      queryClient.invalidateQueries({
        queryKey: ["individualPayout"],
      });
      toast.success("Payout rejected successfully");
    },
    onError: (error) => {
      handleApiError(error)
    },
  });
}
