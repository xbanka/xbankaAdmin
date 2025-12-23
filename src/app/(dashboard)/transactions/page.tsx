"use client";

import { useState } from "react";
import { CustomerSearchSidebar } from "@/components/transaction/customer-search-sidebar";
import { TransactionAddSidebar } from "@/components/transaction/transaction-add-sidebar";
import { ActiveCustomer } from "@/components/transaction/types";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import { mockTransactions } from "@/components/transaction/transaction-data";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TransactionFormProvider } from "@/components/transaction/transaction-form-provider";

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
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">
            Manage and track all your customer transactions
          </p>
        </div>
        <div className="max-w-[1050px] lg:w-full">
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
