"use client";

import { useState } from "react";
import { useGetNotifications } from "@/lib/services/notification.service";
import { RoleChangeConfirmModal } from "@/components/notifications-panel/role-change-confirm-modal";
import { PayoutNotification } from "@/components/notifications-panel/notifications";

/**
 * Pops up an immediate confirm/later modal for the staff member's own
 * pending role change. Source of truth is the notification feed's `action`
 * field — an ACTIVE STAFF_ACCOUNT notification with
 * `action.type === "CONFIRM_ROLE_CHANGE"` — NOT reference_type alone. That
 * feed also carries password-change events under the same reference_type,
 * which the backend marks with `action: null`, so this can't misfire on
 * those.
 *
 * useGetNotifications already refetches on the notifications websocket push
 * (via its shared query key) and on a 60s poll, so this popup updates in
 * real time with no separate wiring.
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

  const notifications: PayoutNotification[] = data?.data || [];
  const pending =
    notifications.find((n) => n.action?.type === "CONFIRM_ROLE_CHANGE") ??
    null;

  // "Later" means "not now," not "never" — dismissal is session-only
  // (in-memory), so a fresh page load re-surfaces anything still pending.
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const current = pending && pending.id !== dismissedId ? pending : null;

  return (
    <>
      {children}
      <RoleChangeConfirmModal
        notification={current}
        onLater={() => {
          if (current) setDismissedId(current.id);
        }}
        onConfirmed={() => {
          if (current) setDismissedId(current.id);
        }}
      />
    </>
  );
}
