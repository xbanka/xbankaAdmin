"use client"

import { useState, useMemo } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Customer } from "./types"

interface CustomerSearchSidebarProps {
  isOpen: boolean
  onClose: () => void
  onCustomerSelect: (customer: Customer) => void
  customers: Customer[]
  isLoading?: boolean
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Jane Smith",
    username: "@janesmith",
    email: "janesmith@gmail.com",
    phone: "09023456789",
    affiliateAttribution: "@Codixe",
    assignedRep: "Joe Prochter",
    totalTransactions: 12,
    lastTransactionDate: "Nov 5, 2025",
  },
  {
    id: "2",
    name: "John Doe",
    username: "@johndoe",
    email: "johndoe@example.com",
    phone: "08012345678",
    affiliateAttribution: "@TechPartner",
    assignedRep: "Sarah Johnson",
    totalTransactions: 8,
    lastTransactionDate: "Nov 3, 2025",
  },
  {
    id: "3",
    name: "Alice Johnson",
    username: "@alicej",
    email: "alice@company.com",
    phone: "07098765432",
    affiliateAttribution: "@Enterprise",
    assignedRep: "Mike Chen",
    totalTransactions: 15,
    lastTransactionDate: "Nov 4, 2025",
  },
]

export function CustomerSearchSidebar({
  isOpen,
  onClose,
  onCustomerSelect,
  customers = mockCustomers,
  isLoading = false,
}: CustomerSearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return []
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, customers])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#111827]">New Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 h-10"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">Loading customers...</div>
          ) : filteredCustomers.length === 0 && searchQuery ? (
            <div className="text-center py-8 text-gray-500">No customers found</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">Start typing to search for customers</div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => onCustomerSelect(customer)}
                  className="w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarFallback className="bg-teal-500 text-white">{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#111827] text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{customer.username}</p>
                      <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E7EB]">
          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
