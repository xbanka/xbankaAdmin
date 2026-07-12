"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Repeat,
  Users,
  CheckSquare,
  Wallet,
  ArrowUp,
  Download,
  RefreshCw,
  Hourglass,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { metrics, statToneClass, urgentAttention, urgentStyles, workflowBarClass, workflowHealth, workflowIconClass } from "./dashboard-data"

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="p-4">
        {/* Welcome header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-deep-blue">Welcome to Xbanka ERP</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Check out overview information across all departments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm" className="flex items-center gap-2 bg-main-green text-white hover:bg-main-green/90">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
 
        {/* Metric cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-deep-blue">{metric.title}</span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-deep-blue">{metric.value}</span>
                    <span className="flex items-center gap-0.5 text-xs text-main-green font-medium">
                      <ArrowUp className="h-3 w-3" />
                      12% vs last week
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    {metric.stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                        <span className={`text-sm font-semibold ${statToneClass[stat.tone]}`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
 
        {/* Workflow Health + Needs Urgent Attention */}
        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-deep-blue">Workflow Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflowHealth.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="p-3 bg-off-white rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center ${workflowIconClass[item.tone]}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium text-deep-blue">{item.title}</span>
                        </div>
                        <span className="text-sm font-semibold text-deep-blue">{item.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${workflowBarClass[item.tone]}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {item.detail} · {item.detailSecondary}
                        </span>
                        <span className="text-main-green font-medium">↑ {item.trend}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
 
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-deep-blue">Needs Urgent Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentAttention.map((item) => {
                  const style = urgentStyles[item.tone]
                  return (
                    <div
                      key={item.title}
                      className={`p-3 rounded ${style.bg} border-l-4 ${style.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-medium ${style.text}`}>{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <span className={`text-lg font-bold ${style.text}`}>{item.count}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{item.detail}</span>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-1 text-xs font-medium ${style.text} hover:underline`}
                        >
                          {item.action}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}