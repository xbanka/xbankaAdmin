import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getNotifications } from "../actions/notificationsActions";
import { confirmRoleChange } from "../actions/auditLogActions";
import { handleApiError } from "../errors/handleApiError";
import { NotificationFilters } from "@/components/notifications-panel/notifications";

export const NOTIFICATIONS_QUERY_KEY = ["allNotification"] as const;

export const useGetNotifications = (filters: NotificationFilters = {}) => {
  return useQuery({
    // Filters are part of the key so each combination caches separately.
    // ["allNotification"] stays a prefix of every entry, so invalidating it
    // still refreshes every filtered view at once.
    queryKey: [...NOTIFICATIONS_QUERY_KEY, filters],
    queryFn: () => getNotifications(filters),
    // Safety net in case the notifications websocket never connects (e.g.
    // server unreachable, CORS/proxy blocking the upgrade) — live pushes
    // still land instantly via the socket, this just guarantees we're never
    // more than a minute stale if that connection silently fails.
    refetchInterval: 60_000,
  });
};

/**
 * Self-confirmation for a staff member's own pending role change
 * (PENDING -> CONFIRMED). Shared by the notification bell dropdown and the
 * role-change popup modal so both stay in sync.
 */
export const useConfirmRoleChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmRoleChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["audit-log", "role-changes"] });
      // The confirming staff member's own role/permissions just changed, and
      // the Staff table's Role Change column reads the same data — both need
      // to drop the now-cleared role_change without a manual reload.
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["getAllStaff"] });
      toast.success("Role change confirmed.");
    },
    onError: (error) => handleApiError(error),
  });
};
