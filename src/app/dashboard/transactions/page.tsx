"use client";

import type React from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/layout/data-table";
import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";
import { Eye, RefreshCw, AlertTriangle, Plus } from "lucide-react";

const transactions = [
  {
    id: "TXN001",
    customer: "John Doe",
    customerId: "CUST001",
    type: "Gift Card",
    amount: "$250.00",
    status: "Successful",
    gateway: "Flutterwave",
    timestamp: "2024-01-16 14:30:25",
    tickets: 0,
  },
  {
    id: "TXN002",
    customer: "Jane Smith",
    customerId: "CUST002",
    type: "Crypto",
    amount: "$1,200.00",
    status: "Pending",
    gateway: "Crypto API",
    timestamp: "2024-01-16 13:45:12",
    tickets: 1,
  },
  {
    id: "TXN003",
    customer: "Mike Johnson",
    customerId: "CUST003",
    type: "Bills",
    amount: "$89.50",
    status: "Failed",
    gateway: "Flutterwave",
    timestamp: "2024-01-16 12:20:08",
    tickets: 2,
  },
];

// const providerStats = [
//   {
//     name: "Flutterwave",
//     successRate: "94.2%",
//     totalTransactions: 1247,
//     errors: 12,
//     status: "Active",
//   },
//   {
//     name: "Crypto API",
//     successRate: "89.7%",
//     totalTransactions: 856,
//     errors: 23,
//     status: "Active",
//   },
//   {
//     name: "Bills Gateway",
//     successRate: "96.1%",
//     totalTransactions: 634,
//     errors: 8,
//     status: "Active",
//   },
// ];

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    customerId: "",
    type: "",
    amount: "",
    gateway: "",
    description: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New transaction data:", formData);
    setFormData({
      customer: "",
      customerId: "",
      type: "",
      amount: "",
      gateway: "",
      description: "",
    });
    setIsModalOpen(false);
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
    { key: "id", label: "Transaction ID" },
    {
      key: "customer",
      label: "Customer",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.customerId}</div>
        </div>
      ),
    },
    { key: "type", label: "Type" },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    { key: "status", label: "Status" },
    { key: "gateway", label: "Gateway" },
    {
      key: "timestamp",
      label: "Timestamp",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      key: "tickets",
      label: "Support Tickets",
      render: (value: number) => (
        <Badge variant={value > 0 ? "destructive" : "secondary"}>{value}</Badge>
      ),
    },
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
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={formData.customerId}
                onChange={(e) =>
                  handleInputChange("customerId", e.target.value)
                }
                placeholder="Enter customer ID"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="gift card">Gift Card</SelectItem>
                  <SelectItem value="bills">Bills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="$0.00"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateway">Payment Gateway</Label>
            <Select
              value={formData.gateway}
              onValueChange={(value) => handleInputChange("gateway", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flutterwave">Flutterwave</SelectItem>
                <SelectItem value="crypto api">Crypto API</SelectItem>
                <SelectItem value="bills gateway">Bills Gateway</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            {/* <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter transaction description"
              rows={3}
            /> */}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout
      title="Transaction Management"
      breadcrumbs={[{ label: "Transactions" }]}
    >
      <DataTable
        title="Transaction Master Table"
        data={transactions}
        columns={transactionColumns}
        searchKeys={["id", "customer"]}
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
