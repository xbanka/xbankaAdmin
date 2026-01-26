"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SidebarHeader from "../Sidebar/sidebar-header";
import TransactionCustomerDetailsField from "./transaction-customer-details-field";
import { useGetCustomer } from "@/lib/services/customer.service";
import { useFormContext } from "react-hook-form";
import FormField from "../layout/FormField";
import { ActiveCustomer, Customer } from "../../lib/types/transactionTypes";
import { TransactionFormValues } from "@/lib/schema/transaction.schema";
import { useUserStore } from "@/store/userStore";
import { CustomerSearchSidebarProps } from "@/lib/types/customer";

export function CustomerSearchSidebar({
  isOpen,
  onClose,
  onCustomerSelect,
  isLoading = false,
}: CustomerSearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCustomer, setActiveCustomer] = useState<ActiveCustomer | null>();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<TransactionFormValues>();

  const user = useUserStore((state) => state.user);

  

  useEffect(() => {
    if (user) {
      setValue("customer.assignedRep", `${user.first_name} ${user.last_name}`, {
        shouldValidate: true,
      });
    }
  }, [user, setValue]);

  const handleCustomerSelect = (customer: Customer) => {
    const assignedRep = user ? `${user.first_name} ${user.last_name}` : "";

    setValue(
      "customer",
      {
        id: customer.id,
        name: customer.first_name,
        email: customer.email,
        phone: customer.phone_no,
        assignedRep, // ✅ injected automatically
      },
      { shouldValidate: true }
    );
  };

  const { data, isLoading: customerLoading } = useGetCustomer(searchQuery);

  const handleActiveCustomer = (customer: ActiveCustomer) => {
    const fullCustomer = data?.data.find((c: Customer) => c.id === customer.id);
    const assignedRep = user ? `${user.first_name} ${user.last_name}` : "";

    if (!fullCustomer) return;

    const selectedCustomer = {
      id: fullCustomer.id,
      name: `${fullCustomer.first_name} ${fullCustomer.last_name}`,
      email: fullCustomer.email,
      phone: fullCustomer.phone_no,

      username: fullCustomer.username,
      affiliate: fullCustomer?.affiliate?.username,
      totalTransactions: fullCustomer.total_transactions,
      joinedAt: fullCustomer.created_at,
    };
    setValue(
      "customer",
      {
        id: fullCustomer.id,
        affiliateAttribution: fullCustomer?.affiliate?.username ?? "",
        assignedRep,
      },
      { shouldValidate: true }
    );
    setActiveCustomer(selectedCustomer);
    setSearchQuery("");
  };

  const customers = useMemo(() => {
    return (data?.data ?? []).map((c: Customer) => ({
      id: c.id,
      name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      phone: c.phone_no,
    }));
  }, [data]);

  const onSubmit = (data: TransactionFormValues) => {
    if (!activeCustomer) return;
    onCustomerSelect(activeCustomer);
  };

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
      <div className="w-full md:w-[37%] bg-white shadow-lg flex flex-col h-full">
        {/* Header */}
        <SidebarHeader header="New Transaction" onClose={onClose} />

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Search for customer name or username"
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
                          <span className="text-xs inline-block text-gray-600">
                            {customer.name}
                          </span>
                          <span className="text-xs inline-block text-gray-400">
                            •
                          </span>
                          <span className="text-xs inline-block text-gray-600 truncate">
                            {customer.email}
                          </span>
                          <span className="text-xs inline-block text-gray-400">
                            •
                          </span>
                          <span className="text-xs inline-block text-gray-600">
                            {customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && customers.length === 0 && !isLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                <p className="text-sm text-gray-500 text-center">
                  No customers found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto px-6">
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
          ) : (
            activeCustomer && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                 
                  <FormField
                    label="Affiliate Attribution"
                    id="customer.affiliateAttribution"
                    register={register}
                    readOnly
                    // error={errors.root?.message}
                  />
                  <FormField
                    label="Assigned Rep"
                    id="customer.assignedRep"
                    // className="bg-gray-100 cursor-not-allowed"
                    register={register}
                    error={errors.customer?.assignedRep}
                    readOnly
                  />
                  {/* <TransactionCustomerDetailsField
                  label="Assigned Rep"
                  body={activeCustomer.assignedRep}
                /> */}
                </div>

                <Button
                  className="w-full mt-8 text-abstractCyan bg-transparent border border-dashed border-[#C2C7CF] hover:text-black"
                  type="submit"
                >
                  + Add Transaction
                </Button>
              </form>
            )
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
