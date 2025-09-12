"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/layout/data-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2Icon } from "lucide-react";
import {
  createNewCustomer,
  deleteCustomer,
  getCustomers,
} from "@/lib/actions/customerAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DialogLayout } from "@/components/layout/modalLayout";
import FormField from "@/components/layout/FormField";
import { SelectFieldLayout } from "@/components/layout/SelectFieldLayout";
import { createCustomerTypes } from "@/lib/actions/actionTypes";
import { toast } from "sonner";

// const customers = [
//   {
//     id: "CUST001",
//     name: "John Doe",
//     email: "john.doe@email.com",
//     phone: "+1234567890",
//     status: "Active",
//     transactions: 45,
//     openTickets: 2,
//     totalSpent: "$12,450",
//     lastActivity: "2024-01-15",
//   },
//   {
//     id: "CUST002",
//     name: "Jane Smith",
//     email: "jane.smith@email.com",
//     phone: "+1234567891",
//     status: "Pending",
//     transactions: 23,
//     openTickets: 0,
//     totalSpent: "$8,230",
//     lastActivity: "2024-01-14",
//   },
//   {
//     id: "CUST003",
//     name: "Mike Johnson",
//     email: "mike.johnson@email.com",
//     phone: "+1234567892",
//     status: "Active",
//     transactions: 67,
//     openTickets: 1,
//     totalSpent: "$18,900",
//     lastActivity: "2024-01-16",
//   },
// ];

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
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

  const { mutate, isPending: createCustomerPending } = useMutation({
    mutationFn: (data: createCustomerTypes) =>
      createNewCustomer(
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.status
      ),
    onSuccess: (result) => {
      if (!result.success) {
        // Show API error in alert
        //   setErrorMessage(result.message)
      } else {
        console.log("Signup success!", result.data);
        setOpen(false);
        toast.success("Customer created successfully");
        reset();
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      }
    },
    onError: (err) => {
      console.log("Signup failed:", err);
    },
  });

  const { mutate: deleteMutate, isPending: deleteCustomerPending } =
    useMutation({
      mutationFn: (id: string) => deleteCustomer(id),
      onSuccess: (result) => {
        if (!result.success) {
          // Show API error in alert
          //   setErrorMessage(result.message)
          toast.success("Failed trying to delete Customer");
        } else {
          console.log("Signup success!", result);
          setDeleteDialogOpen(false);
          toast.success("Transaction deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.refetchQueries({ queryKey: ["transactions"] });
        }
      },
      onError: (err) => {
        console.log("Signup failed:", err);
        toast.success("Failed trying to delete Customer");
      },
    });

  useEffect(() => {
    console.log(error);
  }, [error]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "ACTIVE",
    },
  });

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-main-green" : "bg-yellow-500";
  };

  const customerColumns = [
    { key: "id", label: "Customer ID" },
    { key: "firstName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    // { key: "transactions", label: "Transactions" },
    // {
    //   key: "openTickets",
    //   label: "Open Tickets",
    //   render: (value: number) => (
    //     <Badge variant={value > 0 ? "destructive" : "secondary"}>{value}</Badge>
    //   ),
    // },
    // {
    //   key: "totalSpent",
    //   label: "Total Spent",
    //   render: (value: string) => <span className="font-medium">{value}</span>,
    // },
    // { key: "lastActivity", label: "Last Activity" },
  ];

  const customerFilters = [
    {
      key: "status",
      placeholder: "Filter by status",
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const customerActions = [
    // {
    //   label: "View Profile",
    //   icon: <Eye className="h-4 w-4" />,
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   onClick: (row: any) => console.log("View profile", row),
    // },
    // {
    //   label: "Edit Customer",
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   onClick: (row: any) => console.log("Edit customer", row),
    // },
    // {
    //   label: "View Transactions",
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   onClick: (row: any) => console.log("View transactions", row),
    // },
    // {
    //   label: "Support History",
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   onClick: (row: any) => console.log("Support history", row),
    // },
    {
      label: "Delete",
      icon: <Trash2Icon className="h-4 w-4" />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => {
        setSelectedCustomerId(row.id);
        setDeleteDialogOpen(true);
      },
    },
  ];

  const customerTabFilters = [
    { key: "status", label: "All Customers", value: "all" },
    { key: "status", label: "Active Customers", value: "ACTIVE" },
    { key: "status", label: "Inactive Customers", value: "INACTIVE" },
  ];

  const onSubmit = (data: CustomerFormValues) => {
    mutate(data);
  };

  const handleDeleteCustomer = (id: string) => {
    console.log("dekete id", id);
    deleteMutate(id);
  };

  const headerActions = (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Customer
      </Button>
      <DialogLayout
        open={open}
        onOpenChange={setOpen}
        title="Add New Customer"
        className="sm:max-w-[500px]"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={createCustomerPending}
              type="submit"
              form="transaction-form"
            >
              {createCustomerPending ? "Creating Customer" : "Create Customer"}
            </Button>
          </div>
        }
      >
        {/* <DialogLayout.Trigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </DialogLayout.Trigger> */}
        <form
          id="transaction-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="firstName"
              label="First Name"
              placeholder="firstName"
              register={register}
              error={errors.firstName}
            />
            <FormField
              id="lastName"
              label="Last Name"
              placeholder="lastName"
              register={register}
              error={errors.lastName}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="email"
              label="Email"
              placeholder="email"
              register={register}
              error={errors.email}
            />
            <FormField
              id="phone"
              label="Phone"
              placeholder="phone"
              register={register}
              error={errors.phone}
            />
          </div>

          {/* Type & Status */}

          <SelectFieldLayout
            id="status"
            label="Status"
            options={["ACTIVE", "INACTIVE"]}
            placeholder="Select status"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(val) => setValue("status", val as any)}
            className="w-full"
            error={errors.status}
          />

          {/* Amount */}
        </form>
      </DialogLayout>
    </>
  );

  return (
    <DashboardLayout
      isPending={isPending}
      error={error?.message}
      title="Customer Management"
      breadcrumbs={[{ label: "Customers" }]}
    >
      <>
        <DataTable
          title="Customer List"
          data={data?.data ?? []}
          columns={customerColumns}
          searchKeys={["firstName", "email", "id"]}
          filters={customerFilters}
          actions={customerActions}
          headerActions={headerActions}
          getBadgeColor={getStatusColor}
          tabFilters={customerTabFilters}
          tabFilterKey="status"
        />
        <DialogLayout
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setSelectedCustomerId(null);
          }}
          title="Delete Customer"
          footer={
            <>
              {/* Cancel just closes the dialog */}
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false); // ✅ close on Cancel
                  setSelectedCustomerId(null); // ✅ clear selection
                }}
              >
                Cancel
              </Button>

              {/* Logout button calls handler */}
              <Button
                variant="destructive"
                // onClick={() => {
                //   if (selectedCustomerId) {
                //     handleDeleteCustomer(selectedCustomerId);
                //   }
                // }}
              >
                {deleteCustomerPending ? "Deleting..." : "Delete"}
              </Button>
            </>
          }
        >
          <p>Are you sure you want to delete this customer</p>
        </DialogLayout>
      </>
    </DashboardLayout>
  );
}
