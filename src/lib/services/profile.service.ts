import { useQuery } from "@tanstack/react-query";
import { getCurrentAffiliate } from "../actions/userAction";
import { handleApiError } from "../errors/handleApiError";

export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const response = await getCurrentAffiliate();
        return response;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
};
