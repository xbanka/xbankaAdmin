"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/layout/data-table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw, AlertTriangle } from "lucide-react"

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
]

const providerStats = [
  {
    name: "Flutterwave",
    successRate: "94.2%",
    totalTransactions: 1247,
    errors: 12,
    status: "Active",
  },
  {
    name: "Crypto API",
    successRate: "89.7%",
    totalTransactions: 856,
    errors: 23,
    status: "Active",
  },
  {
    name: "Bills Gateway",
    successRate: "96.1%",
    totalTransactions: 634,
    errors: 8,
    status: "Active",
  },
]

export default function Transactions() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "bg-abstractCyan"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-mainRed"
      default:
        return "bg-gray-500"
    }
  }

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
    { key: "amount", label: "Amount", render: (value: string) => <span className="font-medium">{value}</span> },
    { key: "status", label: "Status" },
    { key: "gateway", label: "Gateway" },
    { key: "timestamp", label: "Timestamp", render: (value: string) => <span className="text-sm">{value}</span> },
    {
      key: "tickets",
      label: "Support Tickets",
      render: (value: number) => <Badge variant={value > 0 ? "destructive" : "secondary"}>{value}</Badge>,
    },
  ]

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
  ]

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
  ]

  return (
    <DashboardLayout title="Transaction Management" breadcrumbs={[{ label: "Transactions" }]}>
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="providers">Provider Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <DataTable
            title="Transaction Master Table"
            data={transactions}
            columns={transactionColumns}
            searchKeys={["id", "customer"]}
            filters={transactionFilters}
            actions={transactionActions}
            getBadgeColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="providers">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {providerStats.map((provider) => (
              <Card key={provider.name} className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-deep-blue">
                    {provider.name}
                    <Badge className={provider.status === "Active" ? "bg-main-green" : "bg-main-red"}>
                      {provider.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="text-sm font-medium text-main-green">{provider.successRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Transactions</span>
                      <span className="text-sm font-medium">{provider.totalTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Errors (24h)</span>
                      <span className="text-sm font-medium text-main-red">{provider.errors}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View Error Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
