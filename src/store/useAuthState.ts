// store/useAuthStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JwtPayload } from "jwt-decode";
import { decodeAccessToken } from "@/lib/decodeToken";

interface DecodedToken extends JwtPayload {
  sub?: string;
  role?: string;
  exp?: number;
  type?: string;
}

interface AuthState {
  user: DecodedToken | null;
  accessToken: string | null;
  hasHydrated: boolean;
  login: (token: string) => void;
  clearUser: () => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      login: (token: string) => {
        try {
          const decoded = decodeAccessToken(token);
          set({ user: decoded, accessToken: token });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          set({ user: null, accessToken: null });
        }
      },
      clearUser: () => set({ user: null }),
      logout: () => {
        localStorage.removeItem("accessToken"); // ✅ clear from localStorage
        set({ user: null, accessToken: null }); // ✅ clear store
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // mark hydration finished
      },
    }
  )
);
