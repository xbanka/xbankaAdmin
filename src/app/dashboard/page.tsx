import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SummaryCard } from "@/components/layout/summary-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, AlertTriangle, Ticket, FileText, CheckSquare, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Daily Transactions"
          value="$24,580"
          icon={DollarSign}
          trend={{ value: "+12.5% from yesterday", isPositive: true }}
          className="bg-light-cyan border-abstract-cyan"
        />
        <SummaryCard
          title="Pending Escalations"
          value="8"
          icon={AlertTriangle}
          trend={{ value: "-2 from yesterday", isPositive: true }}
          className="bg-red-50 border-red-200"
        />
        <SummaryCard
          title="Open Tickets"
          value="23"
          icon={Ticket}
          trend={{ value: "+3 new today", isPositive: false }}
          className="bg-yellow-50 border-yellow-200"
        />
        <SummaryCard
          title="Articles Due"
          value="5"
          icon={FileText}
          trend={{ value: "This week", isPositive: true }}
          className="bg-blue-50 border-blue-200"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <CheckSquare className="h-5 w-5" />
              Tasks Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-off-white rounded">
                <span className="text-sm">Review customer escalations</span>
                <span className="text-xs text-main-red">High</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-off-white rounded">
                <span className="text-sm">Update transaction policies</span>
                <span className="text-xs text-sub-cyan">Medium</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-off-white rounded">
                <span className="text-sm">Weekly report preparation</span>
                <span className="text-xs text-main-green">Low</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-main-green">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Customers</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="text-sm font-medium">2.3 hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 bg-red-50 rounded border-l-4 border-main-red">
                <p className="text-xs text-main-red font-medium">Payment Gateway Down</p>
                <p className="text-xs text-muted-foreground">Flutterwave - 5 min ago</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
                <p className="text-xs text-yellow-700 font-medium">High Transaction Volume</p>
                <p className="text-xs text-muted-foreground">Crypto API - 12 min ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
