"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Download,
  RefreshCw,
  ArrowRight,
  Banknote,
  UsersIcon,
  WalletIcon,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import {
  metrics,
  urgentAttention,
  urgentStyles,
  workflowBarClass,
  workflowHealth,
  workflowIconClass,
} from "./dashboard-data";
import { CardLayout } from "../ui/card-layout";
import { DetailCard } from "./detail-card";
import { cn } from "@/lib/utils";
import {
  useGetCustomerMetrics,
  useGetTransactionMetrics,
} from "@/lib/services/dashboard.service";

export const DashboardHomePage = () => {
  const {
    data: transactionMetrics,
    isLoading: transactionLoading,
    refetch: refetchTransactionMetrics,
    isFetching: isRefetchingTransactionMetrics,
  } = useGetTransactionMetrics();
  console.log("Transaction Metrics:", transactionMetrics);

  const {
    data: customerMetrics,
    isLoading: customerLoading,
    refetch: refetchCustomerMetrics,
    isFetching: isRefetchingCustomerMetrics,
  } = useGetCustomerMetrics();

  const isRefreshing =
    isRefetchingTransactionMetrics || isRefetchingCustomerMetrics;

  const handleRefresh = () => {
    refetchTransactionMetrics();
    refetchCustomerMetrics();
  };

  const dashboardMetrics = [
    {
      title: "Transaction",
      icon: Banknote,
      value: transactionMetrics?.data.total ?? 0,
      // trend: "12% vs last week",
      stats: [
        {
          label: "Success",
          value: transactionMetrics?.data.success ?? 0,
          valueClassName: "text-main-green",
        },
        {
          label: "Pending",
          value: transactionMetrics?.data.pending ?? 0,
          valueClassName: "text-warning-text",
        },
        {
          label: "Failed",
          value: transactionMetrics?.data.failed ?? 0,
          valueClassName: "text-red-500",
        },
      ],
    },

    {
      title: "Customers",
      icon: UsersIcon,
      value: customerMetrics?.data.total ?? 0,
      // trend: "12% vs last week",
      stats: [
        {
          label: "New Today",
          value: customerMetrics?.data.newToday ?? 0,
        },
        {
          label: "KYC Pending",
          value: customerMetrics?.data.kycPending ?? 0,
        },
        {
          label: "Flagged",
          value: customerMetrics?.data.flagged ?? 0,
          valueClassName: "text-red-500",
        },
      ],
    },

    // Dummy Finance

    {
      title: "Finance",
      icon: WalletIcon,
      value: 47,
      // trend: "12% vs last week",
      stats: [
        {
          label: "Pending",
          value: 30,
        },
        {
          label: "On Hold",
          value: 10,
        },
        {
          label: "Flagged",
          value: 7,
          valueClassName: "text-red-500",
        },
      ],
    },

    // Dummy Tasks

    // {
    //   title: "Tasks",
    //   icon: ListTodo,
    //   value: 100,
    //   trend: "12% vs last week",
    //   stats: [
    //     {
    //       label: "Open",
    //       value: 60,
    //     },
    //     {
    //       label: "In Progress",
    //       value: 30,
    //     },
    //     {
    //       label: "Overdue",
    //       value: 10,
    //       valueClassName: "text-red-500",
    //     },
    //   ],
    // },
  ];
  return (
    <DashboardLayout title="Dashboard">
      <div className="p-4 space-y-6">
        {/* Welcome header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-deep-blue">
              Welcome to Xbanka ERP
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Check out overview information across all departments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent py-[10px] px-3"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 py-[10px] px-3"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <DetailCard
              key={metric.title}
              title={metric.title}
              Icon={metric.icon}
              value={metric.value}
              // trend={metric.trend}
              stats={metric.stats}
            />
          ))}
        </div>

        {/* Workflow Health + Needs Urgent Attention */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CardLayout className="space-y-4">
            <div>
              <h1 className="text-text-primary font-medium text-[16px] leading-6">
                Workflow Health
              </h1>
            </div>
            <div className="space-y-3 bg-card-secondary rounded-[12px] p-3">
              {workflowHealth.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-card-primary rounded-lg py-3 px-4 flex items-center gap-6"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-[36px] p-1 bg-warning-light flex items-center justify-center ${workflowIconClass[item.tone]}`}
                      >
                        <Icon className="h-5 w-5 text-warning-text" />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm leading-5 font-medium text-text-primary">
                            {item.title}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full ${workflowBarClass[item.tone]}`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="font-normal text-[12px] text-text-secondary">
                          {item.detail} · {item.detailSecondary}
                        </span>
                      </div>
                    </div>
                    <span className="text-main-green font-normal text-[12px]">
                      ↑ {item.trend}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardLayout>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-deep-blue">
                Needs Urgent Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentAttention.map((item) => {
                  const style = urgentStyles[item.tone];
                  return (
                    <div
                      key={item.title}
                      className={`p-3 rounded ${style.bg} border-l-4 ${style.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-medium ${style.text}`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className={`text-lg font-bold ${style.text}`}>
                          {item.count}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {item.detail}
                        </span>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-1 text-xs font-medium ${style.text} hover:underline`}
                        >
                          {item.action}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
