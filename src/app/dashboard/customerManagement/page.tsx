"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, MoreHorizontal, Plus } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: "",
    notes: ""
  })

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (field: string, value: string) => {
    setNewCustomer(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveCustomer = () => {
    // Here you would typically send the data to your backend
    console.log("Saving customer:", newCustomer)
    
    // Reset form and close modal
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      occupation: "",
      notes: ""
    })
    setIsAddModalOpen(false)
    
    // You could also show a success message here
  }

  const handleCancelAdd = () => {
    // Reset form and close modal
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      occupation: "",
      notes: ""
    })
    setIsAddModalOpen(false)
  }

  return (
    <DashboardLayout title="Customer Management" breadcrumbs={[{ label: "Customers" }]}>
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-deep-blue">Customer List</CardTitle>
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
                    className=""
                    disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone}
                  >
                    Save Customer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelAdd}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Open Tickets</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.status === "Active" ? "default" : "secondary"}
                      className={customer.status === "Active" ? "bg-main-green" : "bg-yellow-500"}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.transactions}</TableCell>
                  <TableCell>
                    <Badge variant={customer.openTickets > 0 ? "destructive" : "secondary"}>
                      {customer.openTickets}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastActivity}</TableCell>
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
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                        <DropdownMenuItem>View Transactions</DropdownMenuItem>
                        <DropdownMenuItem>Support History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
