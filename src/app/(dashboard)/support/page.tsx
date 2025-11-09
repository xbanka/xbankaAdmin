import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  HelpCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  Phone,
  Bitcoin,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function SupportPage() {
  const tickets = [
    {
      id: "TICK-001",
      title: "BTC Rate Inquiry - 0.5 BTC",
      status: "in-progress",
      priority: "medium",
      customer: "John Doe (+1234567890)",
      source: "WhatsApp",
      category: "Crypto Inquiry",
      created: "2 hours ago",
      agent: "Sarah Wilson",
      btcAmount: "0.5",
      currentRate: "$45,230",
      totalValue: "$22,615",
      conversationCount: 3,
    },
    {
      id: "TICK-002",
      title: "ETH Purchase - 2.5 ETH",
      status: "order-processing",
      priority: "high",
      customer: "Jane Smith (+9876543210)",
      source: "WhatsApp",
      category: "Order Processing",
      created: "1 hour ago",
      agent: "Mike Johnson",
      btcAmount: "2.5",
      currentRate: "$2,890",
      totalValue: "$7,225",
      conversationCount: 8,
    },
    {
      id: "TICK-003",
      title: "Payment Confirmation - BTC",
      status: "resolved",
      priority: "high",
      customer: "Alex Chen (+5555123456)",
      source: "WhatsApp",
      category: "Transaction Follow-up",
      created: "3 hours ago",
      agent: "David Lee",
      btcAmount: "1.0",
      currentRate: "$45,230",
      totalValue: "$45,230",
      conversationCount: 12,
    },
    {
      id: "TICK-004",
      title: "Rate Check - No Purchase",
      status: "closed",
      priority: "low",
      customer: "Maria Garcia (+7777888999)",
      source: "WhatsApp",
      category: "Inquiry Completed",
      created: "5 hours ago",
      agent: "Sarah Wilson",
      btcAmount: "0.25",
      currentRate: "$45,230",
      totalValue: "$11,307.50",
      conversationCount: 2,
    },
  ]

  const metrics = {
    whatsappEnquiries: 47,
    avgResponseTime: "2.3 min",
    conversionRate: "68%",
    btcSalesVolume: "12.8 BTC",
    revenueGenerated: "$578,240",
    activeAgents: 6,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <HelpCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "order-processing":
        return <TrendingUp className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "destructive"
      case "in-progress":
        return "default"
      case "order-processing":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <DashboardLayout title="Support Center" breadcrumbs={[{ label: "Support Center" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ERP</h2>
          <p className="text-muted-foreground">WhatsApp BTC Enquiry Management & Crypto Trading Support</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Enquiries</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.whatsappEnquiries}</div>
            <p className="text-xs text-muted-foreground">+12 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}</div>
            <p className="text-xs text-green-600">-0.5 min from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}</div>
            <p className="text-xs text-green-600">+5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Sales Volume</CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.btcSalesVolume}</div>
            <p className="text-xs text-green-600">+2.3 BTC from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.revenueGenerated}</div>
            <p className="text-xs text-green-600">+$45K from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeAgents}</div>
            <p className="text-xs text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Active Tickets</TabsTrigger>
          <TabsTrigger value="queue">Unassigned Queue</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="crypto-inquiry">Crypto Inquiry</SelectItem>
                <SelectItem value="order-processing">Order Processing</SelectItem>
                <SelectItem value="transaction-followup">Transaction Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp BTC Enquiry Tickets</CardTitle>
              <CardDescription>Real-time crypto trading support tickets with integrated pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{ticket.title}</span>
                          <Badge variant={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          <Badge variant="outline">{ticket.source}</Badge>
                          <Badge variant="secondary">{ticket.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {ticket.id} • {ticket.customer} • {ticket.created} • Agent: {ticket.agent}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Bitcoin className="w-3 h-3" />
                            <span>{ticket.btcAmount} BTC</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Rate: {ticket.currentRate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Total: {ticket.totalValue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{ticket.conversationCount} messages</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Queue</CardTitle>
              <CardDescription>New WhatsApp enquiries waiting for agent assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No unassigned tickets in queue</p>
                <p className="text-sm">All enquiries have been assigned to agents</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Records</CardTitle>
              <CardDescription>Linked crypto transactions from WhatsApp enquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">BTC Purchase - 1.0 BTC</div>
                      <div className="text-sm text-muted-foreground">TICK-003 • Alex Chen • Completed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$45,230.00</div>
                    <div className="text-sm text-green-600">Paid/Delivered</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">ETH Purchase - 2.5 ETH</div>
                      <div className="text-sm text-muted-foreground">TICK-002 • Jane Smith • Pending Payment</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$7,225.00</div>
                    <div className="text-sm text-blue-600">Awaiting Payment</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>WhatsApp vs other channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span>WhatsApp</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">47 enquiries</div>
                      <div className="text-sm text-green-600">68% conversion</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>Phone</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">23 enquiries</div>
                      <div className="text-sm text-blue-600">45% conversion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Response times and conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Sarah Wilson</span>
                    <div className="text-right">
                      <div className="font-medium">1.8 min avg</div>
                      <div className="text-sm text-green-600">75% conversion</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mike Johnson</span>
                    <div className="text-right">
                      <div className="font-medium">2.1 min avg</div>
                      <div className="text-sm text-green-600">72% conversion</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>David Lee</span>
                    <div className="text-right">
                      <div className="font-medium">2.5 min avg</div>
                      <div className="text-sm text-green-600">65% conversion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
