import { useQuery } from "@tanstack/react-query";
import { getCurrentAffiliate } from "../actions/userAction";

export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getCurrentAffiliate,
  });
};
