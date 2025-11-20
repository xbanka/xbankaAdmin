// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Download, Filter } from "lucide-react"
// // import type { PayoutData } from "@/app/finance/page"

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
//       <div className="p-4 md:p-6 border-b border-gray-200">
//         <div className="flex items-center justify-between mb-4 md:mb-6">
//           <h2 className="text-base md:text-lg font-semibold text-foreground">Finance Overview</h2>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs md:text-sm">
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Export</span>
//             </Button>
//           </div>
//         </div>

//         {/* Tab buttons - scrollable on mobile */}
//         <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
//           {["All", "Pending", "Completed", "Declined"].map((tab) => (
//             <button
//               key={tab}
//               // eslint-disable-next-line @typescript-eslint/no-explicit-any
//               onClick={() => setActiveTab(tab.toLowerCase() as any)}
//               className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition whitespace-nowrap ${
//                 activeTab === tab.toLowerCase()
//                   ? "bg-primary text-white"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Search and filter - stack on mobile */}
//         <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               type="text"
//               placeholder="Search by ID or affiliate..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 h-10 text-sm"
//             />
//           </div>
//           <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs md:text-sm">
//             <Filter className="w-4 h-4" />
//             <span className="hidden sm:inline">Advanced filter</span>
//           </Button>
//         </div>
//       </div>

//       {/* Desktop Table View */}
//       <div className="hidden md:block overflow-x-auto">
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

//       {/* Mobile Card View */}
//       <div className="md:hidden">
//         {filteredData.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">No payouts found</div>
//         ) : (
//           <div className="space-y-3 p-4">
//             {filteredData.map((payout) => (
//               <div
//                 key={payout.id}
//                 onClick={() => onSelectPayout(payout)}
//                 className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 cursor-pointer hover:bg-gray-100 transition"
//               >
//                 {/* Request ID and Status */}
//                 <div className="flex items-start justify-between gap-2">
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium mb-1">Request ID</p>
//                     <p className="font-semibold text-sm text-foreground">{payout.requestId}</p>
//                   </div>
//                   <span
//                     className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(payout.status)}`}
//                   >
//                     <span>{getStatusIcon(payout.status)}</span>
//                     {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
//                   </span>
//                 </div>

//                 {/* Affiliate Info */}
//                 <div>
//                   <p className="text-xs text-gray-500 font-medium mb-1">Affiliate</p>
//                   <p className="font-medium text-sm text-foreground">{payout.affiliate}</p>
//                   <p className="text-xs text-gray-500">{payout.affiliateHandle}</p>
//                 </div>

//                 {/* Amount and Bank */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium mb-1">Amount</p>
//                     <p className="font-semibold text-sm text-foreground">₦{payout.amount.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium mb-1">Bank</p>
//                     <p className="font-medium text-sm text-foreground">{payout.designatedBank}</p>
//                   </div>
//                 </div>

//                 {/* Date and Reviewer */}
//                 <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium mb-1">Requested Date</p>
//                     <p className="text-sm text-foreground">{payout.requestedDate}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium mb-1">Reviewer</p>
//                     <p className="text-sm text-foreground">{payout.reviewer}</p>
//                   </div>
//                 </div>

//                 {/* View Details Button */}
//                 <Button
//                   onClick={() => onSelectPayout(payout)}
//                   className="w-full mt-2 bg-primary text-white hover:bg-primary/90 text-sm"
//                 >
//                   View Details
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Pagination - responsive */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
//         <p className="text-xs md:text-sm text-gray-600">
//           Page 1 of 3 • Showing {filteredData.length} of {data.length} payouts
//         </p>
//         <div className="flex gap-1 md:gap-2 overflow-x-auto">
//           <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
//             Previous
//           </Button>
//           <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
//             1
//           </Button>
//           <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
//             2
//           </Button>
//           <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
//             3
//           </Button>
//           <Button variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
