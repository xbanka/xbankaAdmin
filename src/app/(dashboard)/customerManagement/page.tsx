"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Customer } from "@/components/transaction/types";
import { useGetCustomer } from "@/hooks/CustomerService";
import { Input } from "@/components/ui/input";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import NewCustomerModal from "@/components/CustomerManagement/NewCustomerModal";

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is too short"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CustomerManagement() {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, isLoading, isError, error } = useGetCustomer(search);

  const customers: Customer[] = data?.data ?? [];

  const onSubmit = (data: CustomerFormValues) => {
    // mutate(data);
    console.log(data);
  };

  
  const handleClose = () => {
    setOpenModal(false)
  }

  const columns = [
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "phone_no", header: "Phone Number" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-start">
          <Button onClick={() => setOpenModal(true)}>Add Customer</Button>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => null}>Search</Button>
          </div>
        </div>

        {/* Table */}
        <DataTableLayout<Customer>
          data={customers}
          columns={columns}
          rowKey={(item) => item.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message ?? "Failed to load customers"}
          emptyMessage="No customers found."
        />
      </div>
      <NewCustomerModal
        isOpen={openModal}
        onClose={handleClose}
      />
    </DashboardLayout>
  );
}
