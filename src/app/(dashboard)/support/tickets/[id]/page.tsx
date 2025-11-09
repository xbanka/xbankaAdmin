// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { ArrowLeft, MessageCircle, Bitcoin, User, Phone, Send } from "lucide-react"
// import Link from "next/link"

export default function TicketDetailPage() {
  // Mock ticket data - in real app this would come from API
  // const ticket = {
  //   id: params.id,
  //   title: "BTC Rate Inquiry - 0.5 BTC",
  //   status: "in-progress",
  //   priority: "medium",
  //   customer: {
  //     name: "John Doe",
  //     phone: "+1234567890",
  //     whatsappProfile: "https://wa.me/1234567890",
  //   },
  //   source: "WhatsApp",
  //   category: "Crypto Inquiry",
  //   created: "2 hours ago",
  //   agent: "Sarah Wilson",
  //   btcAmount: "0.5",
  //   currentRate: "$45,230",
  //   totalValue: "$22,615",
  //   conversation: [
  //     {
  //       id: 1,
  //       sender: "customer",
  //       message: "What's your rate for 0.5 BTC?",
  //       timestamp: "2 hours ago",
  //       platform: "WhatsApp",
  //     },
  //     {
  //       id: 2,
  //       sender: "agent",
  //       message:
  //         "Hi John! Current BTC rate is $45,230. For 0.5 BTC, that would be $22,615. Rate is valid for 15 minutes. Would you like to proceed?",
  //       timestamp: "1 hour 58 minutes ago",
  //       platform: "ERP",
  //     },
  //     {
  //       id: 3,
  //       sender: "customer",
  //       message: "Let me think about it. Can you hold this rate for 30 minutes?",
  //       timestamp: "1 hour 45 minutes ago",
  //       platform: "WhatsApp",
  //     },
  //   ],
  //   pastTickets: [
  //     {
  //       id: "TICK-045",
  //       title: "BTC Purchase - 0.25 BTC",
  //       status: "completed",
  //       date: "2 days ago",
  //       amount: "$11,307.50",
  //     },
  //   ],
  // }

  return (
    <div>support detail page</div>
    // <div className="space-y-6">
    //   <div className="flex items-center space-x-4">
    //     <Link href="/dashboard/support">
    //       <Button variant="outline" size="sm">
    //         <ArrowLeft className="w-4 h-4 mr-2" />
    //         Back to Support
    //       </Button>
    //     </Link>
    //     <div>
    //       <h2 className="text-2xl font-bold tracking-tight">{ticket.title}</h2>
    //       <p className="text-muted-foreground">Ticket #{ticket.id}</p>
    //     </div>
    //   </div>

    //   <div className="grid gap-6 lg:grid-cols-3">
    //     <div className="lg:col-span-2 space-y-6">
    //       {/* Conversation History */}
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="flex items-center space-x-2">
    //             <MessageCircle className="w-5 h-5" />
    //             <span>WhatsApp Conversation</span>
    //           </CardTitle>
    //           <CardDescription>Live conversation with integrated ERP responses</CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="space-y-4 max-h-96 overflow-y-auto">
    //             {ticket.conversation.map((message) => (
    //               <div
    //                 key={message.id}
    //                 className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
    //               >
    //                 <div
    //                   className={`max-w-[80%] p-3 rounded-lg ${
    //                     message.sender === "agent" ? "bg-blue-500 text-white" : "bg-muted"
    //                   }`}
    //                 >
    //                   <p className="text-sm">{message.message}</p>
    //                   <div className="flex items-center justify-between mt-2 text-xs opacity-70">
    //                     <span>{message.platform}</span>
    //                     <span>{message.timestamp}</span>
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //           <Separator className="my-4" />
    //           <div className="flex space-x-2">
    //             {/* <Textarea placeholder="Type your response..." className="flex-1" rows={3} /> */}
    //             <Button>
    //               <Send className="w-4 h-4" />
    //             </Button>
    //           </div>
    //         </CardContent>
    //       </Card>

    //       {/* Live BTC Rate */}
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="flex items-center space-x-2">
    //             <Bitcoin className="w-5 h-5" />
    //             <span>Live Crypto Rates</span>
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="grid gap-4 md:grid-cols-2">
    //             <div className="p-4 border rounded-lg">
    //               <div className="flex items-center justify-between mb-2">
    //                 <span className="font-medium">Bitcoin (BTC)</span>
    //                 <Badge variant="secondary">Live</Badge>
    //               </div>
    //               <div className="text-2xl font-bold text-green-600">$45,230.00</div>
    //               <div className="text-sm text-muted-foreground">+2.3% (24h)</div>
    //             </div>
    //             <div className="p-4 border rounded-lg">
    //               <div className="flex items-center justify-between mb-2">
    //                 <span className="font-medium">Customer Request</span>
    //                 <Badge variant="outline">0.5 BTC</Badge>
    //               </div>
    //               <div className="text-2xl font-bold">$22,615.00</div>
    //               <div className="text-sm text-muted-foreground">Total value</div>
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     </div>

    //     <div className="space-y-6">
    //       {/* Ticket Details */}
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Ticket Details</CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm font-medium">Status</span>
    //             <Badge variant="default">{ticket.status}</Badge>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm font-medium">Priority</span>
    //             <Badge variant="default">{ticket.priority}</Badge>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm font-medium">Category</span>
    //             <Badge variant="secondary">{ticket.category}</Badge>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm font-medium">Source</span>
    //             <Badge variant="outline">{ticket.source}</Badge>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm font-medium">Agent</span>
    //             <span className="text-sm">{ticket.agent}</span>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm font-medium">Created</span>
    //             <span className="text-sm">{ticket.created}</span>
    //           </div>

    //           <Separator />

    //           <div className="space-y-2">
    //             <label className="text-sm font-medium">Update Status</label>
    //             <Select defaultValue={ticket.status}>
    //               <SelectTrigger>
    //                 <SelectValue />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="new">New</SelectItem>
    //                 <SelectItem value="in-progress">In Progress</SelectItem>
    //                 <SelectItem value="order-processing">Order Processing</SelectItem>
    //                 <SelectItem value="resolved">Resolved</SelectItem>
    //                 <SelectItem value="closed">Closed</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>

    //           <Button className="w-full">Update Ticket</Button>
    //         </CardContent>
    //       </Card>

    //       {/* Customer Info */}
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="flex items-center space-x-2">
    //             <User className="w-5 h-5" />
    //             <span>Customer Details</span>
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <div>
    //             <div className="font-medium">{ticket.customer.name}</div>
    //             <div className="text-sm text-muted-foreground flex items-center space-x-1">
    //               <Phone className="w-3 h-3" />
    //               <span>{ticket.customer.phone}</span>
    //             </div>
    //           </div>
    //           <Button variant="outline" className="w-full bg-transparent">
    //             <MessageCircle className="w-4 h-4 mr-2" />
    //             Open WhatsApp
    //           </Button>
    //         </CardContent>
    //       </Card>

    //       {/* Past Tickets */}
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Customer History</CardTitle>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="space-y-3">
    //             {ticket.pastTickets.map((pastTicket) => (
    //               <div key={pastTicket.id} className="p-3 border rounded-lg">
    //                 <div className="flex items-center justify-between mb-1">
    //                   <span className="text-sm font-medium">{pastTicket.title}</span>
    //                   <Badge variant="secondary" className="text-xs">
    //                     {pastTicket.status}
    //                   </Badge>
    //                 </div>
    //                 <div className="text-xs text-muted-foreground">{pastTicket.date}</div>
    //                 <div className="text-sm font-medium text-green-600">{pastTicket.amount}</div>
    //               </div>
    //             ))}
    //           </div>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </div>
  )
}
