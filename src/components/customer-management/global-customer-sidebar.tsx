"use client";

import { useCustomerSidebarStore } from "@/store/customer-sidebar-store";
import CustomerDetailsSidebar from "./customer-details-sidebar";


export function GlobalCustomerSidebar() {
  const { isOpen, customerId, closeCustomer } =
    useCustomerSidebarStore();

  return (
    <CustomerDetailsSidebar
      isOpen={isOpen}
      customerId={customerId}
      onClose={closeCustomer}
    />
  );
}