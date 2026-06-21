"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SidebarHeader from "../Sidebar/sidebar-header";
import TransactionCustomerDetailsField from "./transaction-customer-details-field";
import { useGetCustomer } from "@/lib/services/customer.service";
import { useFormContext } from "react-hook-form";
import FormField from "../forms/FormField";
import { ActiveCustomer, Customer } from "../../lib/types/transactionTypes";
import { TransactionFormValues } from "@/lib/schema/transaction.schema";
import { useUserStore } from "@/store/userStore";
import {
  CustomerAccountItem,
  CustomerProps,
  CustomerSearchSidebarProps,
} from "@/lib/types/customer";

export function CustomerSearchSidebar({
  isOpen,
  onClose,
  onCustomerSelect,
  isLoading = false,
}: CustomerSearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<ActiveCustomer | null>(
    null,
  );

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

  // const handleCustomerSelect = (customer: Customer) => {
  //   const assignedRep = user ? `${user.first_name} ${user.last_name}` : "";

  //   setValue(
  //     "customer",
  //     {
  //       id: customer.id,
  //       name: customer.profile?.firstName,
  //       email: customer.email,
  //       phone: customer.profile?.phoneNumber,
  //       assignedRep, // ✅ injected automatically
  //     },
  //     { shouldValidate: true }
  //   );
  // };

  const { data, isLoading: customerLoading } = useGetCustomer(searchQuery);
  console.log("CUSTOMER API RESPONSE", data);

  const rawData = data?.data;
  console.log("raw", rawData);

  const customerItems = useMemo(() => {
    if (!rawData) return [];

    // Initial customer endpoint
    if ("items" in rawData) {
      return rawData.items;
    }

    // Search endpoint
    if (Array.isArray(rawData.data)) {
      console.log("rawData", rawData);
      return rawData.data;
    }

    return [];
  }, [rawData]);
  console.log("customerItems:", customerItems, data?.data?.data);
  console.log("FULL RESPONSE", data);
  console.log("CUSTOMER ITEMS", customerItems);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (customerItems ?? [])
      .filter((user: CustomerAccountItem) => {
        if (!query) return true;

        const firstName = user.profile?.firstName?.toLowerCase() ?? "";
        const lastName = user.profile?.lastName?.toLowerCase() ?? "";
        const email = user.email?.toLowerCase() ?? "";

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          `${firstName} ${lastName}`.includes(query) ||
          email.includes(query)
        );
      })
      .map((user: CustomerAccountItem) => ({
        id: user.id,
        name: user.profile?.firstName
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : "No Profile",
        email: user.email,
        phone: user.profile?.phoneNumber ?? "-",

        // keep original data attached
        raw: user,
      }));
  }, [customerItems, searchQuery]);

  useEffect(() => {
    console.log("isOpen changed:", isOpen);
  }, [isOpen]);

  useEffect(() => {
    console.log("activeCustomer changed:", activeCustomer);
  }, [activeCustomer]);

  console.log("RENDER", {
    activeCustomer,
    searchQuery,
  });

  // const customers = useMemo(() => {
  //   return (customerItems ?? []).map((user: CustomerAccountItem) => ({
  //     id: user.id,
  //     name: user.profile.firstName
  //       ? `${user.profile.firstName} ${user.profile.lastName}`
  //       : "No Profile",
  //     email: user.email,
  //     phone: user?.profile.phoneNumber ?? "-",
  //   }));
  // }, [customerItems]);

  const handleActiveCustomer = (customer: (typeof filteredUsers)[number]) => {
    console.log("clicked");
    setActiveCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      username: "-",
      affiliate: "-",
      totalTransactions: "-",
      joinedAt: customer.raw.createdAt,
    });
    setShowResults(false);
    // setSearchQuery("")
  };

  console.log("rendering", filteredUsers);

  const onSubmit = (data: TransactionFormValues) => {
    if (!activeCustomer) return;
    onCustomerSelect(activeCustomer);
  };

  const handleClose = () => {
    setSearchQuery("");
    setActiveCustomer(null);
    setShowResults(false);
    onClose();
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
      <div className="flex-1 bg-black/50" onClick={handleClose} />

      {/* Sidebar */}
      <div className="w-full md:w-[37%] bg-white shadow-lg flex flex-col h-full">
        {/* Header */}
        <SidebarHeader header="New Transaction" onClose={handleClose} />

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Search for customer name or username"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;

                setSearchQuery(value);

                if (value.trim()) {
                  setActiveCustomer(null);
                  setShowResults(true);
                }
              }}
              className="pl-10 py-2 h-10"
            />

            {searchQuery && !activeCustomer && filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredUsers.map((customer: ActiveCustomer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      console.log("clicked");
                      handleActiveCustomer(customer);
                    }}
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

            {searchQuery && filteredUsers.length === 0 && !isLoading && (
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
          ) : filteredUsers?.length === 0 && searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              No customers found
            </div>
          ) : filteredUsers?.length === 0 ? (
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
