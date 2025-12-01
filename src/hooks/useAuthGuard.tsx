// hooks/useAuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthState";

export function useAuthGuard() {
  const router = useRouter();
  const { user, accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      const timeout = setTimeout(() => {
        router.replace("/signin");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [accessToken, hasHydrated, router]);

  return { user, isAuthenticated: !!user, hasHydrated };
}
