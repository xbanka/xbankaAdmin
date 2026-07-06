import { create } from "zustand";

interface CustomerSidebarStore {
  isOpen: boolean;
  customerId: string | null;

  openCustomer: (customerId: string) => void;
  closeCustomer: () => void;
}

export const useCustomerSidebarStore = create<CustomerSidebarStore>((set) => ({
  isOpen: false,
  customerId: null,

  openCustomer: (customerId) =>
    set({
      isOpen: true,
      customerId,
    }),

  closeCustomer: () =>
    set({
      isOpen: false,
      customerId: null,
    }),
}));