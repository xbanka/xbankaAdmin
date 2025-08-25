"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/layout/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const customers = [
  {
    id: "CUST001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    status: "Active",
    transactions: 45,
    openTickets: 2,
    totalSpent: "$12,450",
    lastActivity: "2024-01-15",
  },
  {
    id: "CUST002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1234567891",
    status: "Pending",
    transactions: 23,
    openTickets: 0,
    totalSpent: "$8,230",
    lastActivity: "2024-01-14",
  },
  {
    id: "CUST003",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1234567892",
    status: "Active",
    transactions: 67,
    openTickets: 1,
    totalSpent: "$18,900",
    lastActivity: "2024-01-16",
  },
]

export default function CustomerManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setNewCustomer((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveCustomer = () => {
    console.log("Saving customer:", newCustomer)
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      occupation: "",
      notes: "",
    })
    setIsAddModalOpen(false)
  }

  const handleCancelAdd = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      occupation: "",
      notes: "",
    })
    setIsAddModalOpen(false)
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-main-green" : "bg-yellow-500"
  }

  const customerColumns = [
    { key: "id", label: "Customer ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "transactions", label: "Transactions" },
    {
      key: "openTickets",
      label: "Open Tickets",
      render: (value: number) => <Badge variant={value > 0 ? "destructive" : "secondary"}>{value}</Badge>,
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    { key: "lastActivity", label: "Last Activity" },
  ]

  const customerFilters = [
    {
      key: "status",
      placeholder: "Filter by status",
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" },
      ],
    },
  ]

  const customerActions = [
    {
      label: "View Profile",
      icon: <Eye className="h-4 w-4" />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("View profile", row),
    },
    {
      label: "Edit Customer",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("Edit customer", row),
    },
    {
      label: "View Transactions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("View transactions", row),
    },
    {
      label: "Support History",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (row: any) => console.log("Support history", row),
    },
  ]

  const customerTabFilters = [
    { key: "status", label: "All Customers", value: "all" },
    { key: "status", label: "Active Customers", value: "active" },
    { key: "status", label: "Inactive Customers", value: "pending" },
  ]

  const headerActions = (
    <div className="flex gap-2">
      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
        <Filter className="h-4 w-4" />
        More Filters
      </Button>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter customer's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="customer@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+234 xxx xxx xxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerDob">Date of Birth</Label>
                <Input
                  id="customerDob"
                  type="date"
                  value={newCustomer.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customerOccupation">Occupation</Label>
                <Input
                  id="customerOccupation"
                  value={newCustomer.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Enter occupation"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={newCustomer.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter customer's address"
                className="min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="customerNotes">Notes</Label>
              <Input
                id="customerNotes"
                value={newCustomer.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes about the customer"
                className="min-h-20"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSaveCustomer}
              disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone}
            >
              Save Customer
            </Button>
            <Button variant="outline" onClick={handleCancelAdd} className="bg-transparent">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <DashboardLayout title="Customer Management" breadcrumbs={[{ label: "Customers" }]}>
      <DataTable
        title="Customer List"
        data={customers}
        columns={customerColumns}
        searchKeys={["name", "email", "id"]}
        filters={customerFilters}
        actions={customerActions}
        headerActions={headerActions}
        getBadgeColor={getStatusColor}
        tabFilters={customerTabFilters}
        tabFilterKey="status"
      />
    </DashboardLayout>
  )
}
