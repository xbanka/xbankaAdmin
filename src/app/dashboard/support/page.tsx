"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { KanbanBoard, KanbanItem } from "@/components/layout/kanban-board"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, ExternalLink, AlertTriangle } from "lucide-react"

// interface taskProp {
//   id: string;
//   title: string;
//   description: string;
//   assignee: {
//     name: string;
//   };
//   priority: "high";
//   tags: string[];
//   dueDate: string; // ISO date string
// };

const ticketColumns = [
  {
    id: "new",
    title: "New",
    color: "bg-blue-500",
    items: [
      {
        id: "T001",
        title: "Payment Failed - Gift Card",
        description: "Customer unable to complete gift card purchase",
        assignee: { name: "John Doe" },
        priority: "high" as const,
        tags: ["payment", "gift-card"],
        dueDate: "2024-01-17",
      },
      {
        id: "T002",
        title: "Account Verification Issue",
        description: "Customer cannot verify phone number",
        priority: "medium" as const,
        tags: ["verification"],
        dueDate: "2024-01-18",
      },
    ],
  },
  {
    id: "assigned",
    title: "Assigned",
    color: "bg-yellow-500",
    items: [
      {
        id: "T003",
        title: "Crypto Transaction Stuck",
        description: "Bitcoin transaction pending for 2 hours",
        assignee: { name: "Jane Smith" },
        priority: "high" as const,
        tags: ["crypto", "bitcoin"],
        dueDate: "2024-01-16",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-sub-cyan",
    items: [
      {
        id: "T004",
        title: "Refund Request Review",
        description: "Customer requesting refund for failed bill payment",
        assignee: { name: "Mike Johnson" },
        priority: "medium" as const,
        tags: ["refund", "bills"],
        dueDate: "2024-01-17",
      },
    ],
  },
  {
    id: "escalated",
    title: "Escalated",
    color: "bg-main-red",
    items: [
      {
        id: "T005",
        title: "Fraud Investigation",
        description: "Suspicious transaction pattern detected",
        assignee: { name: "Sarah Wilson" },
        priority: "high" as const,
        tags: ["fraud", "investigation"],
        dueDate: "2024-01-16",
      },
    ],
  },
  {
    id: "resolved",
    title: "Resolved",
    color: "bg-main-green",
    items: [
      {
        id: "T006",
        title: "Password Reset Completed",
        description: "Customer successfully reset password",
        assignee: { name: "Tom Brown" },
        priority: "low" as const,
        tags: ["password", "resolved"],
        dueDate: "2024-01-15",
      },
    ],
  },
]

const escalations = [
  {
    id: "ESC001",
    ticketId: "T005",
    title: "Fraud Investigation",
    handler: "Sarah Wilson",
    rootCause: "API Error",
    status: "Ongoing",
    escalatedAt: "2024-01-16 09:30",
    priority: "Critical",
  },
  {
    id: "ESC002",
    ticketId: "T003",
    title: "Crypto Transaction Stuck",
    handler: "Mike Johnson",
    rootCause: "User Error",
    status: "Resolved",
    escalatedAt: "2024-01-15 14:20",
    priority: "High",
  },
]

export default function SupportCenter() {
  const [selectedTicket, setSelectedTicket] = useState<KanbanItem | null>(null)

  return (
    <DashboardLayout title="Support Center" breadcrumbs={[{ label: "Support" }]}>
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tickets">Ticket Board</TabsTrigger>
          <TabsTrigger value="escalations">Escalation Log</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search tickets..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-main-green hover:bg-main-green/90">New Ticket</Button>
          </div>

          <KanbanBoard columns={ticketColumns} onItemClick={(item: KanbanItem) => setSelectedTicket(item)} />

          {selectedTicket && (
            <Card className="bg-white mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ticket Details - {selectedTicket.id}</span>
                  <Badge className={selectedTicket.priority === "high" ? "bg-main-red" : "bg-yellow-500"}>
                    {selectedTicket.priority}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-deep-blue mb-2">Ticket Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span>{selectedTicket.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span>{selectedTicket.assignee?.name || "Unassigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{selectedTicket.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-deep-blue mb-2">Customer & Transaction</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>John Doe (CUST001)</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Transaction:</span>
                        <span>TXN001 - $250.00</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-deep-blue mb-2">Chat Logs</h4>
                  <div className="bg-off-white p-4 rounded-lg space-y-2 max-h-40 overflow-y-auto">
                    <div className="text-sm">
                      <span className="font-medium">Customer:</span> I can&apos;t complete my gift card purchase
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Agent:</span> I&apos;ll help you with that. Can you provide the error
                      message?
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-deep-blue mb-2">Internal Notes</h4>
                  {/* <Textarea placeholder="Add internal notes..." className="min-h-20" /> */}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Assign to Me</Button>
                  <Button variant="outline" className="text-main-red border-main-red bg-transparent">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                  <Button className="bg-main-green hover:bg-main-green/90">Update Status</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="escalations">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-deep-blue">Escalation Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escalations.map((escalation) => (
                  <Card key={escalation.id} className="bg-off-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-deep-blue">{escalation.title}</h4>
                        <Badge className={escalation.status === "Ongoing" ? "bg-yellow-500" : "bg-main-green"}>
                          {escalation.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Ticket ID:</span>
                          <div className="font-medium">{escalation.ticketId}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Handler:</span>
                          <div className="font-medium">{escalation.handler}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Root Cause:</span>
                          <div className="font-medium">{escalation.rootCause}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Escalated:</span>
                          <div className="font-medium">{escalation.escalatedAt}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
