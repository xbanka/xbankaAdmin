"use client"

import { X, ChevronLeft } from "lucide-react"
import type { TransactionRecord } from "./transaction-data"

interface CustomerTransactionsSidebarProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  customer: TransactionRecord | null
  transactions: TransactionRecord[]
}

export function CustomerTransactionsSidebar({
  isOpen,
  onClose,
  onBack,
  customer,
  transactions,
}: CustomerTransactionsSidebarProps) {
  if (!isOpen || !customer) return null

  // Filter transactions for this customer
  // const customerTransactions = transactions.filter((t) => t.customerName === customer.customerName)

  // const customerInitials = customer.customerName
  //   .split(" ")
  //   .map((n) => n[0])
  //   .join("")

  return (
    // <div
    //   className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 z-50 ${
    //     isOpen ? "translate-x-0" : "translate-x-full"
    //   } overflow-y-auto`}
    // >
    //   {/* Header */}
    //   <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
    //     <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
    //       <ChevronLeft className="h-5 w-5" />
    //       <span className="text-sm">Back</span>
    //     </button>
    //     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
    //       <X className="h-5 w-5" />
    //     </button>
    //   </div>

    //   {/* Customer Info */}
    //   <div className="p-4 bg-gray-50 border-b">
    //     <div className="flex items-start gap-3 mb-4">
    //       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
    //         {customerInitials}
    //       </div>
    //       <div className="flex-1">
    //         <h3 className="font-semibold text-[#111827] text-sm">{customer.customerName}</h3>
    //         <p className="text-xs text-gray-500">{customer.customerId}</p>
    //       </div>
    //     </div>
    //     <div className="space-y-2 text-xs">
    //       <div className="flex justify-between">
    //         <span className="text-gray-600">Total Transactions</span>
    //         <span className="font-medium">{customerTransactions.length}</span>
    //       </div>
    //       <div className="flex justify-between">
    //         <span className="text-gray-600">Total Amount</span>
    //         <span className="font-medium">{customer.amountOut || "N/A"}</span>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Transactions List */}
    //   <div className="p-4">
    //     <h4 className="font-semibold text-sm text-[#111827] mb-4">Transactions</h4>
    //     {customerTransactions.length === 0 ? (
    //       <p className="text-xs text-gray-500 text-center py-8">No transactions found</p>
    //     ) : (
    //       <div className="space-y-3">
    //         {customerTransactions.map((transaction) => (
    //           <div key={transaction.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
    //             <div className="flex justify-between items-start mb-2">
    //               <span className="text-xs font-medium text-teal-600">{transaction.transactionId}</span>
    //               <span
    //                 className={`text-xs px-2 py-1 rounded-full font-medium ${
    //                   transaction.status === "completed"
    //                     ? "bg-[#D1FAE5] text-[#37703F]"
    //                     : transaction.status === "failed"
    //                       ? "bg-[#FCE6E6] text-[#EF4444]"
    //                       : "bg-[#FFF8D8] text-[#B29504]"
    //                 }`}
    //               >
    //                 {transaction.status}
    //               </span>
    //             </div>
    //             <div className="space-y-1 text-xs">
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Service Type</span>
    //                 <span className="font-medium">{transaction.serviceType}</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Type</span>
    //                 <span className="font-medium">{transaction.transactionType}</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Amount In</span>
    //                 <span className="font-medium">{transaction.amountIn}</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Amount Out</span>
    //                 <span className="font-medium">{transaction.amountOut}</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Date</span>
    //                 <span className="font-medium">{transaction.dateCreated}</span>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div>ball</div>
  )
}
