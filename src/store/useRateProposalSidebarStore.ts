import { create } from "zustand";

interface RateProposalSidebarStore {
  isOpen: boolean;
  selectedProposalId: string | null;
  openSidebar: (id: string) => void;
  closeSidebar: () => void;
}

export const useRateProposalSidebarStore = create<RateProposalSidebarStore>(
  (set) => ({
    isOpen: false,
    selectedProposalId: null,

    openSidebar: (id) => set({ selectedProposalId: id, isOpen: true }),

    closeSidebar: () => set({ isOpen: false }),
  }),
);
