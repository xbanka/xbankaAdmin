
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
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
          user: state.user
            ? { ...state.user, ...data }
            : (data as User),
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
