import { PayoutData } from "@/app/(dashboard)/finance/page";
import { create } from "zustand";

interface PayoutSidebarStore {
  isDetailsOpen: boolean,
  isConfirmOpen: boolean,
  payout: PayoutData | null;
  openDetailsSidebar: (data: PayoutData) => void;
  openConfirmSidebar: (data: PayoutData) => void;
  closeDetailsSidebar: () => void;
  closeConfirmSidebar: () => void;
}

export const usePayoutSidebarStore = create<PayoutSidebarStore>((set) => ({
  isDetailsOpen: false,
  isConfirmOpen: false,
  payout: null,
  openDetailsSidebar: (data) => set({ isDetailsOpen: true, payout: data }),
  openConfirmSidebar: (data) => set({ isConfirmOpen: true, payout: data }),
  closeDetailsSidebar: () => set({ isDetailsOpen: false, payout: null }),
  closeConfirmSidebar: () => set({ isConfirmOpen: false, payout: null }),
}));
