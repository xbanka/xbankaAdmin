"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  NotificationFilters,
  PayoutNotification,
} from "@/components/notifications-panel/notifications";
import { NOTIFICATIONS_QUERY_KEY } from "@/lib/services/notification.service";

type NotificationEvent =
  | { event: "notification:new"; data: PayoutNotification }
  | { event: "notification:updated"; data: PayoutNotification };

const WS_URL = "wss://api.xbankang.com/api/erp/notifications/ws";
const BASE_RECONNECT_DELAY = 1000; // 1s
const MAX_RECONNECT_DELAY = 30000; // 30s cap

interface UseNotificationsSocketOptions {
  token: string | null | undefined;
  enabled?: boolean;
  onNewNotification?: (notification: PayoutNotification) => void;
}

export function useNotificationsSocket({
  token,
  enabled = true,
  onNewNotification,
}: UseNotificationsSocketOptions) {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const shouldReconnectRef = useRef(true);

  const handleMessage = useCallback(
    (raw: MessageEvent) => {
      let parsed: NotificationEvent;
      try {
        parsed = JSON.parse(raw.data);
      } catch (err) {
        console.error("Failed to parse notification payload", err);
        return;
      }

      const { event, data } = parsed;
      if (!data?.id) return;

      if (event === "notification:updated") {
        // Patch the notification everywhere it's cached — the panel keeps a
        // separate cache entry per filter combination, so an exact-key write
        // would only ever reach one of them.
        queryClient.setQueriesData<{ data: PayoutNotification[] } | undefined>(
          { queryKey: NOTIFICATIONS_QUERY_KEY },
          (old) => {
            if (!old?.data) return old;
            if (!old.data.some((n) => n.id === data.id)) return old;
            return {
              ...old,
              data: old.data.map((n) =>
                n.id === data.id ? { ...n, ...data } : n,
              ),
            };
          },
        );
        // A patched notification may now fall in or out of a filtered view
        // (e.g. it just became RESOLVED), so let the server re-decide.
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      }

      if (event === "notification:new") {
        // Patch every cached view whose filters the new notification actually
        // matches, synchronously — the bell dot, an open dropdown, and the
        // role-change popup queue all read this same cache, and none of them
        // should have to wait on a refetch (or the 60s poll) to notice a push
        // that already arrived. setQueriesData's updater doesn't expose the
        // query key, so we go query-by-query via getQueriesData instead.
        const cached = queryClient.getQueriesData<
          { data: PayoutNotification[] } | undefined
        >({ queryKey: NOTIFICATIONS_QUERY_KEY });

        cached.forEach(([queryKey, old]) => {
          if (!old?.data || old.data.some((n) => n.id === data.id)) return;

          const filters = queryKey[1] as NotificationFilters | undefined;
          const matches =
            (!filters?.reference_type ||
              filters.reference_type === data.reference_type) &&
            (!filters?.status || filters.status === data.status) &&
            (filters?.is_read === undefined ||
              filters.is_read === data.is_read);
          if (!matches) return;

          queryClient.setQueryData(queryKey, {
            ...old,
            data: [data, ...old.data],
          });
        });

        // Let the server re-decide filter membership in the background too,
        // in case our client-side filter matching above ever drifts from it.
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        onNewNotification?.(data);
      }
    },
    [queryClient, onNewNotification],
  );

  useEffect(() => {
    if (!enabled || !token) return;

    shouldReconnectRef.current = true;

    const connect = () => {
      const isReconnect = reconnectAttemptRef.current > 0;
      const socket = new WebSocket(
        `${WS_URL}?token=${encodeURIComponent(token)}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0;
        // If we were offline for a bit, refetch to catch anything the
        // socket missed while disconnected, rather than trusting the
        // gap to be empty.
        if (isReconnect) {
          queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        }
      };

      socket.onmessage = handleMessage;

      socket.onerror = (err) => {
        console.error("Notifications socket error", err);
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (!shouldReconnectRef.current) return;

        const attempt = reconnectAttemptRef.current + 1;
        reconnectAttemptRef.current = attempt;
        const delay = Math.min(
          BASE_RECONNECT_DELAY * 2 ** (attempt - 1),
          MAX_RECONNECT_DELAY,
        );
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [enabled, token, handleMessage, queryClient]);
}
