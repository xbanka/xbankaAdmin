
import { getIndividualPayout, processPayout, rejectPayout } from "@/lib/actions/payout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIndividualPayout = (payoutId: string | null) => {
  return useQuery({
   queryKey: ["individualPayout", payoutId],
    queryFn: ({ queryKey }) => getIndividualPayout(queryKey[1]!),
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
      toast.error(error.message);
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
      toast.error(error.message);
    },
  });
}
