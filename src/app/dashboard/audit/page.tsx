"use client"

// import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Search, Download, Eye, Activity, BarChart3, Clock, CheckCircle } from "lucide-react"

// const activityLogs = [
//   {
//     id: "LOG001",
//     user: "Sarah Wilson",
//     action: "Approved refund",
//     target: "DIS001",
//     timestamp: "2024-01-16 14:30:25",
//     ipAddress: "192.168.1.100",
//     status: "Success",
//   },
//   {
//     id: "LOG002",
//     user: "Mike Johnson",
//     action: "Updated customer status",
//     target: "CUST001",
//     timestamp: "2024-01-16 13:45:12",
//     ipAddress: "192.168.1.101",
//     status: "Success",
//   },
//   {
//     id: "LOG003",
//     user: "Tom Brown",
//     action: "Failed login attempt",
//     target: "Admin Panel",
//     timestamp: "2024-01-16 12:20:08",
//     ipAddress: "192.168.1.102",
//     status: "Failed",
//   },
// ]

// const performanceMetrics = {
//   support: {
//     responseTime: "2.3 hrs",
//     resolutionRate: "94.2%",
//     ticketsResolved: 156,
//     avgRating: 4.7,
//   },
//   content: {
//     timeliness: "89%",
//     outputCount: 23,
//     avgWordsPerArticle: 1250,
//     seoScore: 85,
//   },
//   tasks: {
//     completionRate: "91%",
//     onTimeDelivery: "87%",
//     blockers: 3,
//     avgTaskTime: "2.1 days",
//   },
// }

// const complianceChecks = [
//   {
//     id: "COMP001",
//     rule: "Transactions over ₦500,000",
//     flaggedCount: 12,
//     status: "Review Required",
//     lastCheck: "2024-01-16 09:00",
//   },
//   {
//     id: "COMP002",
//     rule: "Multiple failed login attempts",
//     flaggedCount: 3,
//     status: "Monitored",
//     lastCheck: "2024-01-16 08:30",
//   },
//   {
//     id: "COMP003",
//     rule: "Suspicious transaction patterns",
//     flaggedCount: 7,
//     status: "Under Investigation",
//     lastCheck: "2024-01-16 10:15",
//   },
// ]

export default function AuditPerformance() {
  // const [searchTerm, setSearchTerm] = useState("")
  // const [filterUser, setFilterUser] = useState("all")
  // const [filterAction, setFilterAction] = useState("all")

  // const filteredLogs = activityLogs.filter((log) => {
  //   const matchesSearch =
  //     log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     log.user.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesUser = filterUser === "all" || log.user.toLowerCase().includes(filterUser)
  //   const matchesAction = filterAction === "all" || log.action.toLowerCase().includes(filterAction)
  //   return matchesSearch && matchesUser && matchesAction
  // })

  return (
    <DashboardLayout title="Audit & Performance" breadcrumbs={[{ label: "Audit & Performance" }]}>
      <h1>audit</h1>
      {/* <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance Dashboard</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-deep-blue">
                  <Activity className="h-5 w-5" />
                  Activity Logs
                </span>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search activity logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="tom">Tom Brown</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell className="text-sm font-mono">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge className={log.status === "Success" ? "bg-main-green" : "bg-main-red"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-deep-blue">
                  <BarChart3 className="h-5 w-5" />
                  Support Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4 text-sub-cyan" />
                    {performanceMetrics.support.responseTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Resolution Rate</span>
                  <span className="font-medium text-main-green">{performanceMetrics.support.resolutionRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tickets Resolved</span>
                  <span className="font-medium">{performanceMetrics.support.ticketsResolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Rating</span>
                  <span className="font-medium">{performanceMetrics.support.avgRating}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-deep-blue">
                  <BarChart3 className="h-5 w-5" />
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Timeliness</span>
                  <span className="font-medium text-main-green">{performanceMetrics.content.timeliness}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Output Count</span>
                  <span className="font-medium">{performanceMetrics.content.outputCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Words/Article</span>
                  <span className="font-medium">{performanceMetrics.content.avgWordsPerArticle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">SEO Score</span>
                  <span className="font-medium text-sub-cyan">{performanceMetrics.content.seoScore}/100</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-deep-blue">
                  <CheckCircle className="h-5 w-5" />
                  Task Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-medium text-main-green">{performanceMetrics.tasks.completionRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                  <span className="font-medium">{performanceMetrics.tasks.onTimeDelivery}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Blockers</span>
                  <span className="font-medium text-main-red">{performanceMetrics.tasks.blockers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Task Time</span>
                  <span className="font-medium">{performanceMetrics.tasks.avgTaskTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-deep-blue">
                  <CheckCircle className="h-5 w-5" />
                  Compliance Checks
                </span>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check) => (
                  <Card key={check.id} className="bg-off-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-deep-blue">{check.rule}</h4>
                        <Badge
                          className={
                            check.status === "Review Required"
                              ? "bg-main-red"
                              : check.status === "Under Investigation"
                                ? "bg-yellow-500"
                                : "bg-main-green"
                          }
                        >
                          {check.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Flagged Items:</span>
                          <div className="font-medium text-main-red">{check.flaggedCount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Check:</span>
                          <div className="font-medium">{check.lastCheck}</div>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </DashboardLayout>
  )
}
