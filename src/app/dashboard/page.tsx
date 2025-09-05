"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricCarousel } from "@/components/layout/metric-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  AlertTriangle,
  CheckSquare,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  PieChart,
  User,
  Eye,
} from "lucide-react"
import Link from "next/link"


const recentTransactions = [
  {
    id: "TXN001",
    type: "received",
    customer: "John Doe",
    amount: "₦25,000",
    date: "2024-01-16",
    time: "14:30",
    description: "Gift Card Purchase",
  },
  {
    id: "TXN002",
    type: "sent",
    customer: "Jane Smith",
    amount: "₦12,500",
    date: "2024-01-16",
    time: "13:45",
    description: "Refund Processing",
  },
  {
    id: "TXN003",
    type: "received",
    customer: "Mike Johnson",
    amount: "₦89,500",
    date: "2024-01-16",
    time: "12:20",
    description: "Crypto Purchase",
  },
  {
    id: "TXN004",
    type: "received",
    customer: "Sarah Wilson",
    amount: "₦5,750",
    date: "2024-01-16",
    time: "11:15",
    description: "Bill Payment",
  },
  {
    id: "TXN005",
    type: "sent",
    customer: "Tom Brown",
    amount: "₦18,200",
    date: "2024-01-16",
    time: "10:30",
    description: "Dispute Refund",
  },
]

const topWriters = [
  {
    name: "Sarah Wilson",
    articles: 23,
    avatar: "SW",
    performance: "Excellent",
  },
  {
    name: "Mike Johnson",
    articles: 18,
    avatar: "MJ",
    performance: "Good",
  },
  {
    name: "Jane Smith",
    articles: 15,
    avatar: "JS",
    performance: "Good",
  },
  {
    name: "Tom Brown",
    articles: 12,
    avatar: "TB",
    performance: "Average",
  },
]

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard Overview">
      {/* Scrollable Metric Cards */}
      <MetricCarousel cardsPerView={4} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Recent Transactions */}
        <Card className="bg-white lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-deep-blue">
                <DollarSign className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <Link href="/transactions">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-off-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "received" ? "bg-abstractCyan" : "bg-mainRed"
                      }`}
                    >
                      {transaction.type === "received" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-deep-blue">{transaction.customer}</div>
                      <div className="text-sm text-muted-foreground">{transaction.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${transaction.type === "received" ? "text-main-green" : "text-main-red"}`}
                    >
                      {transaction.type === "received" ? "+" : "-"}
                      {transaction.amount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.date} {transaction.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Due Today */}
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

        {/* Earnings Chart */}
        <Card className="bg-white lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-deep-blue">
                <BarChart3 className="h-5 w-5" />
                Earnings Overview
              </CardTitle>
              <Select defaultValue="monthly">
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#14ae5c" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#14ae5c" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid background */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Area chart path */}
                <path
                  d="M 20 160 L 80 120 L 140 140 L 200 80 L 260 100 L 320 60 L 380 90 L 380 180 L 20 180 Z"
                  fill="url(#areaGradient)"
                  stroke="none"
                />

                {/* Line chart path */}
                <path
                  d="M 20 160 L 80 120 L 140 140 L 200 80 L 260 100 L 320 60 L 380 90"
                  fill="none"
                  stroke="#14ae5c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                <circle cx="20" cy="160" r="4" fill="#14ae5c" />
                <circle cx="80" cy="120" r="4" fill="#14ae5c" />
                <circle cx="140" cy="140" r="4" fill="#14ae5c" />
                <circle cx="200" cy="80" r="4" fill="#14ae5c" />
                <circle cx="260" cy="100" r="4" fill="#14ae5c" />
                <circle cx="320" cy="60" r="4" fill="#14ae5c" />
                <circle cx="380" cy="90" r="4" fill="#14ae5c" />

                {/* Month labels */}
                <text x="20" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  Jan
                </text>
                <text x="80" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  Feb
                </text>
                <text x="140" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  Mar
                </text>
                <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  Apr
                </text>
                <text x="260" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  May
                </text>
                <text x="320" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  Jun
                </text>
                <text x="380" y="195" textAnchor="middle" className="text-xs fill-gray-500">
                  Jul
                </text>
              </svg>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
                <span>₦8M</span>
                <span>₦6M</span>
                <span>₦4M</span>
                <span>₦2M</span>
                <span>₦0</span>
              </div>
            </div>

            {/* Summary stats */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-sm font-medium text-main-green">₦6.2M</div>
                <div className="text-xs text-muted-foreground">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-sub-cyan">+18.5%</div>
                <div className="text-xs text-muted-foreground">Growth</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-deep-blue">₦42.8M</div>
                <div className="text-xs text-muted-foreground">Total YTD</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top SEO Writers */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <User className="h-5 w-5" />
              Top SEO Writers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topWriters.map((writer) => (
                <div key={writer.name} className="flex items-center justify-between p-2 bg-off-white rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-abstract-cyan rounded-full flex items-center justify-center">
                      <span className="text-deep-blue font-bold text-xs">{writer.avatar}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{writer.name}</div>
                      <div className="text-xs text-muted-foreground">{writer.articles} articles</div>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs ${
                      writer.performance === "Excellent"
                        ? "bg-abstractCyan"
                        : writer.performance === "Good"
                          ? "bg-subCyan"
                          : "bg-yellow-500"
                    }`}
                  >
                    {writer.performance}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Article Status Pie Chart */}
        <Card className="bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-deep-blue">
              <PieChart className="h-5 w-5" />
              Article Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              {/* Simple pie chart representation */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Published - 45% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#14ae5c"
                    strokeWidth="20"
                    strokeDasharray="113 251"
                    strokeDashoffset="0"
                  />
                  {/* Pending - 25% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray="63 251"
                    strokeDashoffset="-113"
                  />
                  {/* Under Review - 20% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#0198af"
                    strokeWidth="20"
                    strokeDasharray="50 251"
                    strokeDashoffset="-176"
                  />
                  {/* Disapproved - 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#c00f0c"
                    strokeWidth="20"
                    strokeDasharray="25 251"
                    strokeDashoffset="-226"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-deep-blue">156</div>
                    <div className="text-sm text-muted-foreground">Total Articles</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-mainGreen rounded-full"></div>
                <span className="text-sm">Published (70)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Pending (39)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-subCyan rounded-full"></div>
                <span className="text-sm">Under Review (31)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-mainRed rounded-full"></div>
                <span className="text-sm">Disapproved (16)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
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
              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-xs text-blue-700 font-medium">Low Stock Alert</p>
                <p className="text-xs text-muted-foreground">Amazon Cards - 1 hr ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
