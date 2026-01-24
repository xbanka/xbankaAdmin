import { Role } from "@/lib/enum/roles&permission.enum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface permission {
  name: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: {
    id: string;
    name: Role;
    permissions: permission[];
  };
  created_at: "string";
}

interface UserStore {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : (data as User),
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
