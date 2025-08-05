"use client"

// import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Eye, CheckCircle, XCircle, Clock, FileText } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// const disputes = [
//   {
//     id: "DIS001",
//     transactionId: "TXN001",
//     customerId: "CUST001",
//     customerName: "John Doe",
//     amount: "$250.00",
//     type: "Gift Card",
//     status: "Under Review",
//     reason: "Product not received",
//     submittedAt: "2024-01-16 10:30",
//     reviewer: "Sarah Wilson",
//     attachments: ["receipt.pdf", "screenshot.png"],
//   },
//   {
//     id: "DIS002",
//     transactionId: "TXN003",
//     customerId: "CUST003",
//     customerName: "Mike Johnson",
//     amount: "$89.50",
//     type: "Bills",
//     status: "Refunded",
//     reason: "Duplicate charge",
//     submittedAt: "2024-01-15 14:20",
//     reviewer: "Tom Brown",
//     refundedAt: "2024-01-16 09:15",
//     attachments: ["bank_statement.pdf"],
//   },
//   {
//     id: "DIS003",
//     transactionId: "TXN002",
//     customerId: "CUST002",
//     customerName: "Jane Smith",
//     amount: "$1,200.00",
//     type: "Crypto",
//     status: "Rejected",
//     reason: "Fraudulent claim",
//     submittedAt: "2024-01-14 16:45",
//     reviewer: "Mike Johnson",
//     rejectedAt: "2024-01-15 11:30",
//     attachments: [],
//   },
// ]

export default function RefundsDisputes() {
  // const [selectedDispute, setSelectedDispute] = useState<any>(null)
  // const [reviewNotes, setReviewNotes] = useState("")

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "refunded":
  //       return "bg-main-green"
  //     case "rejected":
  //       return "bg-main-red"
  //     case "under review":
  //       return "bg-yellow-500"
  //     default:
  //       return "bg-gray-500"
  //   }
  // }

  // const getStatusIcon = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "refunded":
  //       return <CheckCircle className="h-4 w-4" />
  //     case "rejected":
  //       return <XCircle className="h-4 w-4" />
  //     case "under review":
  //       return <Clock className="h-4 w-4" />
  //     default:
  //       return <Clock className="h-4 w-4" />
  //   }
  // }

  return (
    <DashboardLayout title="Refunds & Disputes" breadcrumbs={[{ label: "Refunds & Disputes" }]}>
     <h1>refunds</h1>
    </DashboardLayout>
  )
  // return (
  //   <DashboardLayout title="Refunds & Disputes" breadcrumbs={[{ label: "Refunds & Disputes" }]}>
  //     <Card className="bg-white">
  //       <CardHeader>
  //         <CardTitle className="text-deep-blue">Dispute Registry</CardTitle>
  //         <div className="flex gap-4 mt-4">
  //           <div className="relative flex-1">
  //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
  //             <Input placeholder="Search disputes..." className="pl-10" />
  //           </div>
  //           <Select>
  //             <SelectTrigger className="w-[150px]">
  //               <SelectValue placeholder="Status" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               <SelectItem value="all">All Status</SelectItem>
  //               <SelectItem value="new">New</SelectItem>
  //               <SelectItem value="under-review">Under Review</SelectItem>
  //               <SelectItem value="refunded">Refunded</SelectItem>
  //               <SelectItem value="rejected">Rejected</SelectItem>
  //             </SelectContent>
  //           </Select>
  //           <Select>
  //             <SelectTrigger className="w-[150px]">
  //               <SelectValue placeholder="Type" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               <SelectItem value="all">All Types</SelectItem>
  //               <SelectItem value="gift-card">Gift Card</SelectItem>
  //               <SelectItem value="crypto">Crypto</SelectItem>
  //               <SelectItem value="bills">Bills</SelectItem>
  //             </SelectContent>
  //           </Select>
  //         </div>
  //       </CardHeader>
  //       <CardContent>
  //         <Table>
  //           <TableHeader>
  //             <TableRow>
  //               <TableHead>Dispute ID</TableHead>
  //               <TableHead>Transaction</TableHead>
  //               <TableHead>Customer</TableHead>
  //               <TableHead>Amount</TableHead>
  //               <TableHead>Type</TableHead>
  //               <TableHead>Status</TableHead>
  //               <TableHead>Reason</TableHead>
  //               <TableHead>Submitted</TableHead>
  //               <TableHead>Reviewer</TableHead>
  //               <TableHead>Actions</TableHead>
  //             </TableRow>
  //           </TableHeader>
  //           <TableBody>
  //             {disputes.map((dispute) => (
  //               <TableRow key={dispute.id}>
  //                 <TableCell className="font-medium">{dispute.id}</TableCell>
  //                 <TableCell>{dispute.transactionId}</TableCell>
  //                 <TableCell>
  //                   <div>
  //                     <div className="font-medium">{dispute.customerName}</div>
  //                     <div className="text-sm text-muted-foreground">{dispute.customerId}</div>
  //                   </div>
  //                 </TableCell>
  //                 <TableCell className="font-medium">{dispute.amount}</TableCell>
  //                 <TableCell>{dispute.type}</TableCell>
  //                 <TableCell>
  //                   <Badge className={`${getStatusColor(dispute.status)} flex items-center gap-1 w-fit`}>
  //                     {getStatusIcon(dispute.status)}
  //                     {dispute.status}
  //                   </Badge>
  //                 </TableCell>
  //                 <TableCell>{dispute.reason}</TableCell>
  //                 <TableCell className="text-sm">{dispute.submittedAt}</TableCell>
  //                 <TableCell>{dispute.reviewer}</TableCell>
  //                 <TableCell>
  //                   <Dialog>
  //                     <DialogTrigger asChild>
  //                       <Button variant="ghost" size="sm" onClick={() => setSelectedDispute(dispute)}>
  //                         <Eye className="h-4 w-4" />
  //                       </Button>
  //                     </DialogTrigger>
  //                     <DialogContent className="max-w-4xl">
  //                       <DialogHeader>
  //                         <DialogTitle>Dispute Details - {dispute.id}</DialogTitle>
  //                       </DialogHeader>
  //                       {selectedDispute && (
  //                         <div className="space-y-6">
  //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //                             <div>
  //                               <h4 className="font-medium text-deep-blue mb-3">Dispute Information</h4>
  //                               <div className="space-y-2 text-sm">
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Transaction ID:</span>
  //                                   <span className="font-medium">{selectedDispute.transactionId}</span>
  //                                 </div>
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Amount:</span>
  //                                   <span className="font-medium">{selectedDispute.amount}</span>
  //                                 </div>
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Type:</span>
  //                                   <span>{selectedDispute.type}</span>
  //                                 </div>
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Reason:</span>
  //                                   <span>{selectedDispute.reason}</span>
  //                                 </div>
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Submitted:</span>
  //                                   <span>{selectedDispute.submittedAt}</span>
  //                                 </div>
  //                               </div>
  //                             </div>
  //                             <div>
  //                               <h4 className="font-medium text-deep-blue mb-3">Customer Information</h4>
  //                               <div className="space-y-2 text-sm">
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Name:</span>
  //                                   <span className="font-medium">{selectedDispute.customerName}</span>
  //                                 </div>
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Customer ID:</span>
  //                                   <span>{selectedDispute.customerId}</span>
  //                                 </div>
  //                                 <div className="flex justify-between">
  //                                   <span className="text-muted-foreground">Status:</span>
  //                                   <Badge className={getStatusColor(selectedDispute.status)}>
  //                                     {selectedDispute.status}
  //                                   </Badge>
  //                                 </div>
  //                               </div>
  //                             </div>
  //                           </div>

  //                           {selectedDispute.attachments.length > 0 && (
  //                             <div>
  //                               <h4 className="font-medium text-deep-blue mb-3">Attachments</h4>
  //                               <div className="flex gap-2">
  //                                 {selectedDispute.attachments.map((attachment: string, index: number) => (
  //                                   <Button
  //                                     key={index}
  //                                     variant="outline"
  //                                     size="sm"
  //                                     className="flex items-center gap-2 bg-transparent"
  //                                   >
  //                                     <FileText className="h-4 w-4" />
  //                                     {attachment}
  //                                   </Button>
  //                                 ))}
  //                               </div>
  //                             </div>
  //                           )}

  //                           <div>
  //                             <h4 className="font-medium text-deep-blue mb-3">Reviewer Notes</h4>
  //                             {/* <Textarea
  //                               placeholder="Add reviewer notes..."
  //                               value={reviewNotes}
  //                               onChange={(e) => setReviewNotes(e.target.value)}
  //                               className="min-h-24"
  //                             /> */}
  //                           </div>

  //                           {selectedDispute.status === "Under Review" && (
  //                             <div className="flex gap-3">
  //                               <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
  //                                 <CheckCircle className="h-4 w-4" />
  //                                 Approve Refund
  //                               </Button>
  //                               <Button
  //                                 variant="outline"
  //                                 className="text-main-red border-main-red flex items-center gap-2 bg-transparent"
  //                               >
  //                                 <XCircle className="h-4 w-4" />
  //                                 Reject Dispute
  //                               </Button>
  //                               <Button variant="outline">Request More Info</Button>
  //                             </div>
  //                           )}
  //                         </div>
  //                       )}
  //                     </DialogContent>
  //                   </Dialog>
  //                 </TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </CardContent>
  //     </Card>
  //   </DashboardLayout>
  // )
}