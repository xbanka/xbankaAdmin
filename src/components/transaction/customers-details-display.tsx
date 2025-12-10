import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Customer } from "./types"

interface CustomerDetailsDisplayProps {
  customer: Customer
}

export function CustomerDetailsDisplay({ customer }: CustomerDetailsDisplayProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-[#E5E7EB] space-y-3">
      {/* Customer Header */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-teal-500 text-white text-lg font-semibold">
            {customer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-[#111827]">{customer.name}</h3>
          <p className="text-xs text-gray-500">Total Transactions: {customer.totalTransactions}</p>
        </div>
      </div>

      {/* Customer Details Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E7EB]">
        <div>
          <p className="text-xs text-gray-500 font-medium">Username</p>
          <p className="text-sm text-[#111827] font-medium truncate">{customer.username}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Email</p>
          <p className="text-sm text-[#111827] font-medium truncate">{customer.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Phone</p>
          <p className="text-sm text-[#111827] font-medium">{customer.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Affiliate</p>
          <p className="text-sm text-[#111827] font-medium">{customer.affiliateAttribution}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500 font-medium">Assigned Rep</p>
          <p className="text-sm text-[#111827] font-medium">{customer.assignedRep}</p>
        </div>
      </div>
    </div>
  )
}
