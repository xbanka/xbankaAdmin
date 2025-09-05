// hooks/useAuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export function useAuthGuard() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Detect when Zustand has rehydrated from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/auth/signin"); // ✅ absolute path
    }
  }, [isHydrated, user, router]);

  return { user, isAuthenticated: !!user, isHydrated };
}
