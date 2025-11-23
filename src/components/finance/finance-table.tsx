// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Download, Filter } from "lucide-react"
// import type { PayoutData } from "@/app/(dashboard)/finance/page"

// interface FinanceTableProps {
//   data: PayoutData[]
//   onSelectPayout: (payout: PayoutData) => void
// }

// export function FinanceTable({ data, onSelectPayout }: FinanceTableProps) {
//   const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "declined">("all")
//   const [searchTerm, setSearchTerm] = useState("")

//   const filteredData = data.filter((payout) => {
//     const matchesTab = activeTab === "all" || payout.status === activeTab
//     const matchesSearch =
//       payout.affiliate.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payout.requestId.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesTab && matchesSearch
//   })

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300"
//       case "completed":
//         return "bg-green-100 text-green-800 border-green-300"
//       case "declined":
//         return "bg-red-100 text-red-800 border-red-300"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-300"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "●"
//       case "completed":
//         return "✓"
//       case "declined":
//         return "✕"
//       default:
//         return "●"
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//       {/* Header with filters */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-foreground">Finance Overview</h2>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//               <Download className="w-4 h-4" />
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* Tab buttons */}
//         <div className="flex gap-2 mb-6">
//           {["All", "Pending", "Completed", "Declined"].map((tab) => (
//             <button
//               key={tab}
//               // eslint-disable-next-line @typescript-eslint/no-explicit-any
//               onClick={() => setActiveTab(tab.toLowerCase() as any)}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition ${
//                 activeTab === tab.toLowerCase()
//                   ? "bg-primary text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Search and filter */}
//         <div className="flex gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               type="text"
//               placeholder="Search by ID or affiliate name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 h-10"
//             />
//           </div>
//           <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//             <Filter className="w-4 h-4" />
//             Advanced filter
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Request ID</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Affiliate</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Amount</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Designated Bank</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Status</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Requested Date</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Reviewer</th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((payout) => (
//               <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer">
//                 <td className="px-6 py-4 text-sm font-medium text-foreground">{payout.requestId}</td>
//                 <td className="px-6 py-4 text-sm text-foreground">
//                   <div>
//                     <p className="font-medium">{payout.affiliate}</p>
//                     <p className="text-xs text-gray-500">{payout.affiliateHandle}</p>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium text-foreground">₦{payout.amount.toLocaleString()}</td>
//                 <td className="px-6 py-4 text-sm text-foreground">{payout.designatedBank}</td>
//                 <td className="px-6 py-4 text-sm">
//                   <span
//                     className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payout.status)}`}
//                   >
//                     <span>{getStatusIcon(payout.status)}</span>
//                     {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-foreground">{payout.requestedDate}</td>
//                 <td className="px-6 py-4 text-sm text-foreground">{payout.reviewer}</td>
//                 <td className="px-6 py-4 text-sm">
//                   <button onClick={() => onSelectPayout(payout)} className="text-primary hover:underline font-medium">
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
//         <p className="text-sm text-gray-600">
//           Page 1 of 3 • Showing {filteredData.length} of {data.length} payouts
//         </p>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm">
//             Previous
//           </Button>
//           <Button variant="outline" size="sm">
//             1
//           </Button>
//           <Button variant="outline" size="sm">
//             2
//           </Button>
//           <Button variant="outline" size="sm">
//             3
//           </Button>
//           <Button variant="outline" size="sm">
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
