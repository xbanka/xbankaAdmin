"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SidebarHeader from "../Sidebar/sidebar-header";
import TransactionCustomerDetailsField from "./transaction-customer-details-field";
import { useGetCustomer } from "@/hooks/CustomerService";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";
import { ActiveCustomer, Customer } from "../../lib/types/transactionTypes";

interface CustomerSearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: ActiveCustomer) => void;
  isLoading?: boolean;
}

export function CustomerSearchSidebar({
  isOpen,
  onClose,
  onCustomerSelect,
  isLoading = false,
}: CustomerSearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCustomer, setActiveCustomer] = useState<ActiveCustomer | null>();

  const { setValue, register } = useFormContext();

  const handleCustomerSelect = (customer: Customer) => {
    setValue("customer", {
      id: customer.id,
      name: customer.first_name,
      email: customer.email,
      phone: customer.phone_no,
      affiliateAttribution: customer.affiliateAttribution ?? "",
      assignedRep: customer.assignedRep ?? "",
    });
  };

  const { data, isLoading: customerLoading } = useGetCustomer(searchQuery);

  const handleActiveCustomer = (customer: ActiveCustomer) => {
    setActiveCustomer(customer)
    console.log(customer)
    setSearchQuery("")
  }

  const customers = useMemo(() => {
    return (data?.data ?? []).map((c: Customer) => ({
      id: c.id,
      name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      phone: c.phone_no,
    }));
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveCustomer(null);
    }
  }, [isOpen]);

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
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Customer</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Customer name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 h-10"
            />

            {searchQuery && customers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
                {customers.map((customer: ActiveCustomer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleActiveCustomer(customer)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {customer.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-600">{customer.name}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600 truncate">{customer.email}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && customers.length === 0 && !isLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                <p className="text-sm text-gray-500 text-center">No customers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading customers...
            </div>
          ) : customers?.length === 0 && searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              No customers found
            </div>
          ) : customers?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Start typing to search for customers
            </div>
          ) : activeCustomer && (
            <div className="space-y-4">
              <TransactionCustomerDetailsField
                label="Customer Name"
                body={activeCustomer?.name}
              />
              <div className="flex items-center gap-4">
                <TransactionCustomerDetailsField
                  label="Phone Number"
                  body={activeCustomer?.phone}
                />
                <TransactionCustomerDetailsField
                  label="Email"
                  body={activeCustomer?.email}
                />
              </div>
              <div className="flex items-center gap-4">
                {/* <TransactionCustomerDetailsField
                  label="Affiliate Attribution"
                  body={activeCustomer.affiliateAttribution}
                /> */}
                <FormField
                  label="Affiliate Attribution"
                  id="customer.affiliateAttribution"
                  register={register}
                />
                <FormField
                  label="Assigned Rep"
                  id="customer.assignedRep"
                  register={register}
                />
                {/* <TransactionCustomerDetailsField
                  label="Assigned Rep"
                  body={activeCustomer.assignedRep}
                /> */}
              </div>

              <Button
                className="w-full mt-8 text-abstractCyan bg-transparent border border-dashed border-[#C2C7CF] hover:text-black"
                onClick={() => onCustomerSelect(activeCustomer)}
              >
                + Add Transaction
              </Button>
            </div>
          ) }
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
