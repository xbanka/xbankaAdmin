"use client";

import { useEffect, useRef, useState } from "react";
import { useGetNotifications } from "@/lib/services/notification.service";
import { PayoutNotification } from "@/components/notifications-panel/notifications";
import { RoleChangeConfirmModal } from "@/components/notifications-panel/role-change-confirm-modal";

/**
 * Pops up an immediate confirm/later modal for the staff member's own
 * pending role change. Reuses the same STAFF_ACCOUNT/ACTIVE notifications
 * query the websocket hook already invalidates on both push events
 * ("notification:new" for a brand new one, "notification:updated" once it's
 * resolved elsewhere) and its 60s poll safety net — so a live push and a
 * role change that happened while offline (caught up on next load) both
 * funnel through the same one code path below, no separate socket wiring.
 */
export function RoleChangeConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetNotifications({
    reference_type: "STAFF_ACCOUNT",
    status: "ACTIVE",
  });

  const [queue, setQueue] = useState<PayoutNotification[]>([]);
  // "Later" means "not now," not "never" — dismissed ids are session-only
  // (in-memory), so a fresh page load re-surfaces anything still pending.
  const dismissedIds = useRef<Set<string>>(new Set());
  const queuedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const incoming: PayoutNotification[] = data?.data ?? [];

    const fresh = incoming.filter(
      (n) => !dismissedIds.current.has(n.id) && !queuedIds.current.has(n.id),
    );
    if (fresh.length) {
      fresh.forEach((n) => queuedIds.current.add(n.id));
      setQueue((q) => [...q, ...fresh]);
    }

    // Drop anything no longer ACTIVE (e.g. confirmed from the bell in
    // another tab) so a stale popup can't linger.
    const stillActiveIds = new Set(incoming.map((n) => n.id));
    setQueue((q) => q.filter((n) => stillActiveIds.has(n.id)));
  }, [data]);

  const current = queue[0] ?? null;

  const drop = (id: string) => setQueue((q) => q.filter((n) => n.id !== id));

  return (
    <>
      {children}
      <RoleChangeConfirmModal
        notification={current}
        onLater={() => {
          if (!current) return;
          dismissedIds.current.add(current.id);
          drop(current.id);
        }}
        onConfirmed={() => current && drop(current.id)}
      />
    </>
  );
}
