// components/providers/NotificationsSocketProvider.tsx
"use client";

import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { authToken } from "@/lib/authToken";

export function NotificationsSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = authToken.get();

  useNotificationsSocket({
    token,
    onNewNotification: (n) => {
      // optional: toast, sound, browser Notification API, etc.
    },
  });

  return <>{children}</>;
}