import { useQuery } from "@tanstack/react-query";
import { getCurrentAffiliate } from "../actions/userAction";

export const PROFILE_QUERY_KEY = ["userProfile"] as const;

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getCurrentAffiliate,
    // Own role/permissions can change from outside this tab (another admin
    // confirming an override, a role change applying) — poll so header
    // actions and usePermissions don't go stale for a whole session.
    refetchInterval: 60_000,
  });
};
