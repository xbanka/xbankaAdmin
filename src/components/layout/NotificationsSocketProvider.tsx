// components/providers/NotificationsSocketProvider.tsx
"use client";

import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { authToken } from "@/lib/authToken";
import { toast } from "sonner";

export function NotificationsSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = authToken.get();

  useNotificationsSocket({
    token,
    onNewNotification: (n) => {
      toast(n.message);
    },
  });

  return <>{children}</>;
}