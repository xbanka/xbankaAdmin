"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";
import { MetricCarousel } from "@/components/dashboard/metric-carousel";
import { DashboardHomePage } from "@/components/dashboard/home-page";

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
];

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
];

export default function Dashboard() {
  return (
    <DashboardHomePage />
  );
}
