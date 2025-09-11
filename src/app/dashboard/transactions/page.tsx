"use client";

import type React from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/layout/data-table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { Eye, RefreshCw, AlertTriangle, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/actions/actions";
import { formatDate } from "@/lib/formatDate";
import { generateTransactionId } from "@/lib/getTransactionId";
import { DialogLayout } from "@/components/layout/modalLayout";
import { SelectFieldLayout } from "@/components/layout/SelectFieldLayout";
import FormField from "@/components/layout/FormField";

const transactionSchema = z.object({
  transactionId: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is too short"),
  type: z.enum(["GIFT_CARD", "CRYPTO", "BILLS"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  status: z.enum(["PENDING", "SUCCESSFUL", "FAILED"]),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function Transactions() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      type: "BILLS",
      amount: undefined as unknown as number,
      status: "PENDING",
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  useEffect(() => {
    if (open) {
      setValue("transactionId", generateTransactionId());
    }
  }, [open, setValue]);

  const onSubmit = (data: TransactionFormValues) => {
    console.log("New Transaction:", data);
    reset();
    setOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "bg-main-green";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-main-red";
      default:
        return "bg-gray-500";
    }
  };

  const transactionColumns = [
    { key: "transactionId", label: "Transaction ID" },
    {
      key: "customer",
      label: "Customer",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: string, row: any) => (
        // <div className="font-medium">{value.firstName}</div>
        <div className="font-medium">{row.customer.firstName}</div>
      ),
    },
    { key: "type", label: "Type" },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Date Created",
      render: (value: string) => (
        <span className="text-sm">{formatDate(value)}</span>
      ),
    },
    // {
    //   key: "tickets",
    //   label: "Support Tickets",
    //   render: (value: number) => (
    //     <Badge variant={value > 0 ? "destructive" : "secondary"}>{value}</Badge>
    //   ),
    // },
  ];

  const transactionFilters = [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { value: "all", label: "All Status" },
        { value: "successful", label: "Successful" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      key: "type",
      placeholder: "Type",
      options: [
        { value: "all", label: "All Types" },
        { value: "gift card", label: "Gift Card" },
        { value: "crypto", label: "Crypto" },
        { value: "bills", label: "Bills" },
      ],
    },
  ];

  const transactionActions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("View details", row),
    },
    {
      label: "Retry Transaction",
      icon: <RefreshCw className="h-4 w-4" />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("Retry transaction", row),
    },
    {
      label: "Escalate",
      icon: <AlertTriangle className="h-4 w-4" />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("Escalate", row),
    },
    {
      label: "Refund",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("Refund", row),
      className: "text-main-red",
    },
  ];

  const transactionTabFilters = [
    { key: "type", label: "All", value: "all" },
    { key: "type", label: "Crypto", value: "crypto" },
    { key: "type", label: "Gift Card", value: "gift card" },
    { key: "type", label: "Bills", value: "bills" },
  ];

  const transactionHeaderActions = (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Transaction
      </Button>
    <DialogLayout
      open={open}
      onOpenChange={setOpen}
      title="Add New Transaction"
      className="sm:max-w-[500px]"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="transaction-form">
            Create Transaction
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
        {/* Hidden Transaction ID */}
        <input type="hidden" {...register("transactionId")} />

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
        <div className="grid grid-cols-2 gap-4">
          <SelectFieldLayout
            id="type"
            label="Transaction Type"
            options={["GIFT_CARD", "CRYPTO", "BILLS"]}
            placeholder="Select type"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(val) => setValue("type", val as any)}
            className="w-full"
            error={errors.type}
          />
          <SelectFieldLayout
            id="status"
            label="Status"
            options={["PENDING", "SUCCESSFUL", "FAILED"]}
            placeholder="Select status"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(val) => setValue("status", val as any)}
            className="w-full"
            error={errors.status}
          />
        </div>

        {/* Amount */}
          <FormField
            id="amount"
            label="Amount"
            placeholder="amount"
            register={register}
            error={errors.amount}
          />
      </form>
    </DialogLayout>
    </>
  );

  return (
    <DashboardLayout
      title="Transaction Management"
      breadcrumbs={[{ label: "Transactions" }]}
      isPending={isPending}
      error={error?.message}
    >
      <DataTable
        title="Transaction Master Table"
        data={data?.data ?? []}
        columns={transactionColumns}
        searchKeys={[
          "transactionId",
          "customer.firstName",
          "customer.lastName",
        ]}
        filters={transactionFilters}
        actions={transactionActions}
        getBadgeColor={getStatusColor}
        tabFilters={transactionTabFilters}
        tabFilterKey="type"
        headerActions={transactionHeaderActions}
      />
    </DashboardLayout>
  );
}
