"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Search, User } from "lucide-react";
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
  CustomerSearchSidebarProps,
} from "@/lib/types/customer";
import { SidebarView, UserSummaryItem } from "./transaction-data";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

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
  const [view, setView] = useState<SidebarView>("search");

  // new user form local state
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [newUserErrors, setNewUserErrors] = useState<Partial<typeof newUser>>({});

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<TransactionFormValues>();

  const user = useUserStore((state) => state.user);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (user) {
      setValue("customer.assignedRep", `${user.first_name} ${user.last_name}`, {
        shouldValidate: true,
      });
    }
  }, [user, setValue]);

  const { data, isLoading: customerLoading } = useGetCustomer(searchQuery);
  console.log("CUSTOMER API RESPONSE", data);

  const rawData = data?.data;

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
  console.log("filteredUsers:", filteredUsers)

  const hasSearched = searchQuery.trim().length > 0;
  const noResultsFound = hasSearched && filteredUsers.length === 0 && !customerLoading;

  const handleActiveCustomer = (customer: (typeof filteredUsers)[number]) => {
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
    setValue("customer.isNewUser", false, { shouldValidate: true });
    setValue("customer.id", customer.id, { shouldValidate: true });
    setValue("customer.affiliateAttribution", customer.raw?.affiliate?.username ?? "", { shouldValidate: true });
    setSearchQuery("")
  };

  console.log("rendering", filteredUsers);

  const validateNewUser = () => {
    const errs: Partial<typeof newUser> = {};
    if (!newUser.firstName.trim()) errs.firstName = "Required";
    if (!newUser.lastName.trim()) errs.lastName = "Required";
    if (!newUser.email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) errs.email = "Invalid email";
    if (!newUser.phoneNumber.trim()) errs.phoneNumber = "Required";
    setNewUserErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNewUserContinue = () => {
    if (!validateNewUser()) return;
    // Store new user data in form context
    setValue("customer.isNewUser", true, { shouldValidate: true });
    setValue("customer.newUserData", newUser, { shouldValidate: true });

    // Set active customer so the sidebar shows customer details
    setActiveCustomer({
      id: "",
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      phone: newUser.phoneNumber,
      username: "-",
      affiliate: "-",
      totalTransactions: "-",
      joinedAt: new Date().toISOString(),
    });
    setView("search"); // back to showing customer detail + "+ Add Transaction"
    setSearchQuery("")
  };

  const onSubmit = (data: TransactionFormValues) => {
    if (!activeCustomer) return;
    onCustomerSelect(activeCustomer);
  };

  const handleClose = () => {
    setSearchQuery("");
    setActiveCustomer(null);
    setShowResults(false);
    setView("search");
    setNewUser({ firstName: "", lastName: "", email: "", phoneNumber: "" });
    setNewUserErrors({});
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveCustomer(null);
      setView("search");
      setNewUser({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setNewUserErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (view === "new-user") {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black/50" onClick={handleClose} />
        <div className="w-full md:w-[37%] bg-white shadow-lg flex flex-col h-full">
          <div className="flex items-center gap-3 p-6 border-b border-[#E5E7EB]">
            <button onClick={() => setView("search")} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-[#111827]">New Customer</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Customer not found. Fill in their details to continue.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-primary)]">First Name</label>
                <Input
                  placeholder="John"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser((p) => ({ ...p, firstName: e.target.value }))}
                  className={newUserErrors.firstName ? "border-[var(--error-border)]" : ""}
                />
                {newUserErrors.firstName && (
                  <p className="text-[10px] text-[var(--mainRed)]">{newUserErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-primary)]">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser((p) => ({ ...p, lastName: e.target.value }))}
                  className={newUserErrors.lastName ? "border-[var(--error-border)]" : ""}
                />
                {newUserErrors.lastName && (
                  <p className="text-[10px] text-[var(--mainRed)]">{newUserErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-primary)]">Email</label>
              <Input
                placeholder="john@example.com"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                className={newUserErrors.email ? "border-[var(--error-border)]" : ""}
              />
              {newUserErrors.email && (
                <p className="text-[10px] text-[var(--mainRed)]">{newUserErrors.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-primary)]">Phone Number</label>
              <Input
                placeholder="+2348012345678"
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser((p) => ({ ...p, phoneNumber: e.target.value }))}
                className={newUserErrors.phoneNumber ? "border-[var(--error-border)]" : ""}
              />
              {newUserErrors.phoneNumber && (
                <p className="text-[10px] text-[var(--mainRed)]">{newUserErrors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-[#E5E7EB] flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setView("search")}>
              Back
            </Button>
            <Button
              className="flex-1 bg-[var(--button-primary-bg)] text-white"
              onClick={handleNewUserContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main search view ──
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={handleClose} />
      <div className="w-full md:w-[37%] bg-white shadow-lg flex flex-col h-full">
        <SidebarHeader header="Log Manual Transaction" onClose={handleClose} />

        {/* Search */}
        <div className="p-6 pb-0">
          <p className="text-xs text-[var(--text-secondary)] mb-3">Search Customer</p>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Customer name or username"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) setActiveCustomer(null);
              }}
              className="pl-10 py-2 h-10"
            />
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">
              Search by customer name, username, phone number, or UID.
            </p>

            {/* Dropdown results */}
            {hasSearched && !activeCustomer && filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredUsers.map((customer: UserSummaryItem) => (
                  <button
                    key={customer.id}
                    onClick={() => handleActiveCustomer(customer)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pt-4">
          {/* No customer found state */}
          {noResultsFound && !activeCustomer ? (
            <div className="flex flex-col items-center justify-center h-48 my-14 gap-3">
              <User className="h-10 w-10 text-text-secondary" />
              <p className="text-[24px] text-text-primary font-[600]">No Customer Found</p>
              <button
                onClick={() => setView("new-user")}
                className="flex items-center gap-1 text-[12px] text-text-teal hover:underline font-medium cursor-pointer"
              >
                Create New Customer <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : !activeCustomer && !hasSearched ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Start typing to search for customers
            </div>
          ) : activeCustomer ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TransactionCustomerDetailsField label="Customer Name" body={activeCustomer.name} />
              <div className="flex items-center gap-4">
                <TransactionCustomerDetailsField label="Phone Number" body={activeCustomer.phone} />
                <TransactionCustomerDetailsField label="Email" body={activeCustomer.email} />
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  label="Affiliate Attribution"
                  id="customer.affiliateAttribution"
                  register={register}
                  readOnly
                />
                <FormField
                  label="Assigned Rep"
                  id="customer.assignedRep"
                  register={register}
                  error={errors.customer?.assignedRep}
                  readOnly
                />
              </div>
              <Button
                className="w-full mt-8 text-[var(--abstractCyan)] bg-transparent border border-dashed border-[#C2C7CF] hover:text-black"
                type="submit"
              >
                + Add Transaction
              </Button>
            </form>
          ) : null}
        </div>

        <div className="p-6 border-t border-[#E5E7EB]">
          <Button onClick={handleClose} variant="outline" className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

  // return (
  //   <div className="fixed inset-0 z-50 flex">
  //     {/* Overlay */}
  //     <div className="flex-1 bg-black/50" onClick={handleClose} />
  
  //     {/* Sidebar */}
  //     <div className="w-full md:w-[37%] bg-white shadow-lg flex flex-col h-full">
  //       {/* Header */}
  //       <SidebarHeader header="New Transaction" onClose={handleClose} />
  
  //       {/* Search Input */}
  //       <div className="p-6">
  //         <div className="relative">
  //           <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
  //           <Input
  //             placeholder="Search for customer name or username"
  //             value={searchQuery}
  //             onChange={(e) => {
  //               const value = e.target.value;
  
  //               setSearchQuery(value);
  
  //               if (value.trim()) {
  //                 setActiveCustomer(null);
  //                 setShowResults(true);
  //               }
  //             }}
  //             className="pl-10 py-2 h-10"
  //           />
  
  //           {searchQuery && !activeCustomer && filteredUsers.length > 0 && (
  //             <div className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
  //               {filteredUsers.map((customer: ActiveCustomer) => (
  //                 <button
  //                   key={customer.id}
  //                   onClick={() => {
  //                     console.log("clicked");
  //                     handleActiveCustomer(customer);
  //                   }}
  //                   className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
  //                 >
  //                   <div className="flex items-start gap-3">
  //                     <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
  //                       <User className="h-4 w-4 text-gray-500" />
  //                     </div>
  //                     <div className="flex-1 min-w-0">
  //                       <p className="font-semibold text-gray-900 text-sm">
  //                         {customer.name}
  //                       </p>
  //                       <div className="flex items-center gap-2 mt-0.5">
  //                         <span className="text-xs inline-block text-gray-600">
  //                           {customer.name}
  //                         </span>
  //                         <span className="text-xs inline-block text-gray-400">
  //                           •
  //                         </span>
  //                         <span className="text-xs inline-block text-gray-600 truncate">
  //                           {customer.email}
  //                         </span>
  //                         <span className="text-xs inline-block text-gray-400">
  //                           •
  //                         </span>
  //                         <span className="text-xs inline-block text-gray-600">
  //                           {customer.phone}
  //                         </span>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </button>
  //               ))}
  //             </div>
  //           )}
  
  //           {searchQuery && filteredUsers.length === 0 && !isLoading && (
  //             <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
  //               <p className="text-sm text-gray-500 text-center">
  //                 No customers found
  //               </p>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  
  //       {/* Customer List */}
  //       <div className="flex-1 overflow-y-auto px-6">
  //         {isLoading ? (
  //           <div className="flex items-center justify-center h-full text-gray-500">
  //             Loading customers...
  //           </div>
  //         ) : filteredUsers?.length === 0 && searchQuery ? (
  //           <div className="text-center py-8 text-gray-500">
  //             No customers found
  //           </div>
  //         ) : filteredUsers?.length === 0 ? (
  //           <div className="text-center py-8 text-gray-500 text-sm">
  //             Start typing to search for customers
  //           </div>
  //         ) : (
  //           activeCustomer && (
  //             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  //               <TransactionCustomerDetailsField
  //                 label="Customer Name"
  //                 body={activeCustomer?.name}
  //               />
  //               <div className="flex items-center gap-4">
  //                 <TransactionCustomerDetailsField
  //                   label="Phone Number"
  //                   body={activeCustomer?.phone}
  //                 />
  //                 <TransactionCustomerDetailsField
  //                   label="Email"
  //                   body={activeCustomer?.email}
  //                 />
  //               </div>
  //               <div className="flex items-center gap-4">
  //                 <FormField
  //                   label="Affiliate Attribution"
  //                   id="customer.affiliateAttribution"
  //                   register={register}
  //                   readOnly
  //                   // error={errors.root?.message}
  //                 />
  //                 <FormField
  //                   label="Assigned Rep"
  //                   id="customer.assignedRep"
  //                   // className="bg-gray-100 cursor-not-allowed"
  //                   register={register}
  //                   error={errors.customer?.assignedRep}
  //                   readOnly
  //                 />
  //                 {/* <TransactionCustomerDetailsField
  //                 label="Assigned Rep"
  //                 body={activeCustomer.assignedRep}
  //               /> */}
  //               </div>
  
  //               <Button
  //                 className="w-full mt-8 text-abstractCyan bg-transparent border border-dashed border-[#C2C7CF] hover:text-black"
  //                 type="submit"
  //               >
  //                 + Add Transaction
  //               </Button>
  //             </form>
  //           )
  //         )}
  //       </div>
  
  //       {/* Footer */}
  //       <div className="p-6 border-t border-[#E5E7EB]">
  //         <Button
  //           onClick={onClose}
  //           variant="outline"
  //           className="w-full bg-transparent"
  //         >
  //           Close
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // );
