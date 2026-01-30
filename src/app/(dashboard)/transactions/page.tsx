"use client";

import { useState } from "react";
import { CustomerSearchSidebar } from "@/components/transaction/customer-search-sidebar";
import { TransactionAddSidebar } from "@/components/transaction/transaction-add-sidebar";
import { ActiveCustomer } from "@/lib/types/transactionTypes";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import {
  TransactionRecord,
} from "@/components/transaction/transaction-data";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TransactionFormProvider } from "@/components/transaction/transaction-form-provider";
import { CustomerTransactionsSidebar } from "@/components/transaction/customer-transactions-sidebar";
import { useGetTransactionByCustomer } from "@/lib/services/transaction.service";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<ActiveCustomer | null>(null);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [selectedTransactionCustomer, setSelectedTransactionCustomer] =
    useState<TransactionRecord | null>(null);

  const { data, isPending, error } = useGetTransactionByCustomer(selectedTransactionCustomer?.id ?? "")
  console.log("all customer transaction", data)

  const handleCustomerSelect = (customer: ActiveCustomer) => {
    setSelectedCustomer(customer);
    setIsSearchOpen(false);
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseSearchSidebar = () => {
    setIsSearchOpen(false)
    setSelectedCustomer(null);
  }

  const handleBackToSearch = () => {
    setIsAddOpen(false);
    setIsSearchOpen(true);
  };

  const handleCustomerDetailsOpen = (customer: TransactionRecord) => {
    setSelectedTransactionCustomer(customer);
    setIsCustomerDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <TransactionsTable
          onNewTransaction={() => setIsSearchOpen(true)}
          onCustomerDetailsOpen={handleCustomerDetailsOpen}
        />
      </div>

      <TransactionFormProvider>
        {/* Customer Search Sidebar */}
        <CustomerSearchSidebar
          isOpen={isSearchOpen}
          onClose={handleCloseSearchSidebar}
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
      {/* <CustomerTransactionsSidebar
        isOpen={isCustomerDetailsOpen}
        onClose={() => setIsCustomerDetailsOpen(false)}
        onBack={() => setIsCustomerDetailsOpen(false)}
        customer={selectedTransactionCustomer}
        transactions={mockTransactions}
      /> */}
    </DashboardLayout>
  );
}
