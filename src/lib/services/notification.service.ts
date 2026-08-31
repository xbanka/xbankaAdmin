import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../actions/notificationsActions";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["allNotification"],
    queryFn: getNotifications,
    // Safety net in case the notifications websocket never connects (e.g.
    // server unreachable, CORS/proxy blocking the upgrade) — live pushes
    // still land instantly via the socket, this just guarantees we're never
    // more than a minute stale if that connection silently fails.
    refetchInterval: 60_000,
  });
};
