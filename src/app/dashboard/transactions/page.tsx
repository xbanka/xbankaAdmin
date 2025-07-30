"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, MoreHorizontal, RefreshCw, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase().includes(typeFilter.toLowerCase())
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "bg-main-green"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-main-red"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout title="Transaction Management" breadcrumbs={[{ label: "Transactions" }]}>
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="providers">Provider Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-deep-blue">Transaction Master Table</CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="gift">Gift Card</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Support Tickets</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customer}</div>
                          <div className="text-sm text-muted-foreground">{transaction.customerId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="font-medium">{transaction.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </TableCell>
                      <TableCell>{transaction.gateway}</TableCell>
                      <TableCell className="text-sm">{transaction.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.tickets > 0 ? "destructive" : "secondary"}>
                          {transaction.tickets}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retry Transaction
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Escalate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-main-red">Refund</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
