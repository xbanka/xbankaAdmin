"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer } from "./types";
import SidebarHeader from "../Sidebar/sidebar-header";
import TransactionCustomerDetailsField from "./transaction-customer-details-field";

interface CustomerSearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: Customer) => void;
  customers?: Customer[];
  isLoading?: boolean;
}

// const mockCustomers: Customer[] = [
//   {
//     id: "1",
//     name: "Jane Smith",
//     username: "@janesmith",
//     email: "janesmith@gmail.com",
//     phone: "09023456789",
//     affiliateAttribution: "@Codixe",
//     assignedRep: "Joe Prochter",
//     totalTransactions: 12,
//     lastTransactionDate: "Nov 5, 2025",
//   },
//   {
//     id: "2",
//     name: "John Doe",
//     username: "@johndoe",
//     email: "johndoe@example.com",
//     phone: "08012345678",
//     affiliateAttribution: "@TechPartner",
//     assignedRep: "Sarah Johnson",
//     totalTransactions: 8,
//     lastTransactionDate: "Nov 3, 2025",
//   },
//   {
//     id: "3",
//     name: "Alice Johnson",
//     username: "@alicej",
//     email: "alice@company.com",
//     phone: "07098765432",
//     affiliateAttribution: "@Enterprise",
//     assignedRep: "Mike Chen",
//     totalTransactions: 15,
//     lastTransactionDate: "Nov 4, 2025",
//   },
// ];

export function CustomerSearchSidebar({
  isOpen,
  onClose,
  onCustomerSelect,
  customers,
  isLoading = false,
}: CustomerSearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveCustomer(null);
    }
  }, [isOpen]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return [];
    return customers?.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, customers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg flex flex-col h-full">
        {/* Header */}
        <SidebarHeader header="New Transaction" onClose={onClose} />

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers here"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCustomer(null);
              }}
              className="pl-10 py-2 h-10"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading customers...
            </div>
          ) : filteredCustomers?.length === 0 && searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              No customers found
            </div>
          ) : filteredCustomers?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Start typing to search for customers
            </div>
          ) : activeCustomer ? (
            <div className="space-y-4">
              <TransactionCustomerDetailsField
                label="Customer Name"
                body={activeCustomer.name}
              />
              <div className="flex items-center gap-4">
                <TransactionCustomerDetailsField
                label="Phone Number"
                body={activeCustomer.phone}
              />
              <TransactionCustomerDetailsField
                label="Email"
                body={activeCustomer.email}
              />
              </div>
              <div className="flex items-center gap-4">
                <TransactionCustomerDetailsField
                label="Affiliate Attribution"
                body={activeCustomer.affiliateAttribution}
              />
              <TransactionCustomerDetailsField
                label="Assigned Rep"
                body={activeCustomer.assignedRep}
              />
              </div>

              <Button
                className="w-full mt-8 text-abstractCyan bg-transparent border border-dashed border-[#C2C7CF] hover:text-black"
                onClick={() => onCustomerSelect(activeCustomer)}
              >
                + Add Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers?.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setActiveCustomer(customer)}
                  className="w-full text-left p-4 transition-colors cursor-pointer rounded-md border hover:bg-abstractCyan shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <p className="font-semibold text-[#111827] text-sm truncate">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {customer.affiliateAttribution}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-xs text-gray-400 truncate">
                      {customer.phone}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E7EB]">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-transparent"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
