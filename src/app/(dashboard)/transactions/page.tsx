"use client";

import { useState } from "react";
import { CustomerSearchSidebar } from "@/components/transaction/customer-search-sidebar";
import { TransactionAddSidebar } from "@/components/transaction/transaction-add-sidebar";
import { Customer } from "@/components/transaction/types";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import { mockTransactions } from "@/components/transaction/transaction-data";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TransactionFormProvider } from "@/components/transaction/transaction-form-provider";

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Jane Smith",
    username: "@janesmith",
    email: "janesmith@gmail.com",
    phone: "09023456789",
    affiliateAttribution: "@Codixe",
    assignedRep: "Joe Prochter",
    totalTransactions: 12,
    lastTransactionDate: "Nov 5, 2025",
  },
  {
    id: "2",
    name: "John Doe",
    username: "@johndoe",
    email: "johndoe@example.com",
    phone: "08012345678",
    affiliateAttribution: "@TechPartner",
    assignedRep: "Sarah Johnson",
    totalTransactions: 8,
    lastTransactionDate: "Nov 3, 2025",
  },
  {
    id: "3",
    name: "Alice Johnson",
    username: "@alicej",
    email: "alice@company.com",
    phone: "07098765432",
    affiliateAttribution: "@Enterprise",
    assignedRep: "Mike Chen",
    totalTransactions: 15,
    lastTransactionDate: "Nov 4, 2025",
  },
];

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const handleCustomerSelect = (customer: Customer) => {
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
      <div className="mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">
            Manage and track all your customer transactions
          </p>
        </div>

        {/* <div className="bg-white rounded-lg shadow p-8 text-center">
          <Button
            onClick={() => setIsSearchOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white h-12 px-8 inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Transaction
          </Button>

          <div className="mt-12 text-gray-500">
            <p className="text-lg font-medium">Click "New Transaction" to get started</p>
            <p className="text-sm mt-2">Search for a customer and create a new transaction</p>
          </div>
        </div> */}
        <TransactionsTable
          data={mockTransactions}
          onNewTransaction={() => setIsSearchOpen(true)}
        />
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
