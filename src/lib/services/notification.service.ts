import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../actions/notificationsActions";
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
