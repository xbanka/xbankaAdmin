// components/providers/NotificationsSocketProvider.tsx
"use client";

import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { useAuthStore } from "@/store/useAuthState";
import { toast } from "sonner";

export function NotificationsSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read from the (reactive) auth store, not a one-time cookie read — this
  // provider is mounted once at the root layout and login is a client-side
  // navigation, so a plain `authToken.get()` here would keep whatever stale
  // token it saw on first mount until a full page reload.
  const token = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useNotificationsSocket({
    token,
    enabled: hasHydrated,
    onNewNotification: (n) => {
      toast(n.message);
    },
  });

  return <>{children}</>;
}