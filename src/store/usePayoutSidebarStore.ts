import { create } from "zustand";

interface PayoutSidebarStore {
  isDetailsOpen: boolean;
  isConfirmOpen: boolean;
  selectedPayoutId: string | null;
  openDetailsSidebar: (id: string) => void;
  closeDetailsSidebar: () => void;
  openConfirmSidebar: () => void;
  closeConfirmSidebar: () => void;
}

export const usePayoutSidebarStore = create<PayoutSidebarStore>((set) => ({
  isDetailsOpen: false,
  isConfirmOpen: false,
  selectedPayoutId: null,


  openDetailsSidebar: (id) =>
    set({ selectedPayoutId: id, isDetailsOpen: true }),

  closeDetailsSidebar: () =>
    set({ isDetailsOpen: false }),

  openConfirmSidebar: () =>
    set({ isConfirmOpen: true }),

  closeConfirmSidebar: () =>
    set({ isConfirmOpen: false }),

}));
