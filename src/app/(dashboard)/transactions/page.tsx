"use client";

import { useState } from "react";
import { CustomerSearchSidebar } from "@/components/transaction/customer-search-sidebar";
import { TransactionAddSidebar } from "@/components/transaction/transaction-add-sidebar";
import { ActiveCustomer } from "@/components/transaction/types";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import { mockTransactions } from "@/components/transaction/transaction-data";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TransactionFormProvider } from "@/components/transaction/transaction-form-provider";
import Header from "@/components/ui/Header";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<ActiveCustomer | null>(null);

  const handleCustomerSelect = (customer: ActiveCustomer) => {
    setSelectedCustomer(customer);
    setIsSearchOpen(false);
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setSelectedCustomer(null);
  };

  const handleBackToSearch = () => {
    setIsAddOpen(false);
    setIsSearchOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-8">
          <Header text="Transactions" />
        </div>
        <div className="lg:min-w-[1050px] xl:min-w-[1300px]">
          <TransactionsTable
            data={mockTransactions}
            onNewTransaction={() => setIsSearchOpen(true)}
          />
        </div>
      </div>

      <TransactionFormProvider>
        {/* Customer Search Sidebar */}
        <CustomerSearchSidebar
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onCustomerSelect={handleCustomerSelect}
        />

        {/* Transaction Add Sidebar */}

        <TransactionAddSidebar
          isOpen={isAddOpen}
          onClose={handleCloseAdd}
          customer={selectedCustomer}
          onBack={handleBackToSearch}
        />
      </TransactionFormProvider>
    </DashboardLayout>
  );
}
