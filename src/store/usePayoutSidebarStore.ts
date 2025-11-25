import { PayoutData } from "@/app/(dashboard)/finance/page";
import { create } from "zustand";

interface PayoutSidebarStore {
  isDetailsOpen: boolean;
  isConfirmOpen: boolean;
  payout: PayoutData | null;
  openDetailsSidebar: (data: PayoutData | null) => void;
  openConfirmSidebar: (data: PayoutData) => void;
  closeDetailsSidebar: () => void;
  closeConfirmSidebar: () => void;
  selectedPayoutId: string | null;
  setSelectedPayoutId: (id: string) => void;
}

export const usePayoutSidebarStore = create<PayoutSidebarStore>((set) => ({
  isDetailsOpen: false,
  isConfirmOpen: false,
  payout: null,

  selectedPayoutId: null,

  openDetailsSidebar: (data) =>
    set(() => ({
      payout: data,
      selectedPayoutId: data ? data.id : null,
      isDetailsOpen: true,
    })),

  closeDetailsSidebar: () =>
    set(() => ({
      isDetailsOpen: false,
    })),

  openConfirmSidebar: (data) =>
    set(() => ({ payout: data, isConfirmOpen: true })),

  closeConfirmSidebar: () =>
    set(() => ({ isConfirmOpen: false })),

  setSelectedPayoutId: (id) => set(() => ({ selectedPayoutId: id })),
}));
