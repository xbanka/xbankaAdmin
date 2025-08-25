"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/layout/data-table";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, AlertTriangle } from "lucide-react";

const transactions = [
  {
    id: "TXN001",
    customer: "John Doe",
    customerId: "CUST001",
    type: "Gift Card",
    amount: "$250.00",
    status: "Successful",
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
    timestamp: "2024-01-16 12:20:08",
    tickets: 2,
  },
];

export default function Transactions() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "bg-abstractCyan";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-mainRed";
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

  return (
    <DashboardLayout
      title="Transaction Management"
      breadcrumbs={[{ label: "Transactions" }]}
    >
      <DataTable
      title="Transaction"
        data={transactions}
        columns={transactionColumns}
        searchKeys={["id", "customer"]}
        filters={transactionFilters}
        actions={transactionActions}
        getBadgeColor={getStatusColor}
      />
    </DashboardLayout>
  );
}
