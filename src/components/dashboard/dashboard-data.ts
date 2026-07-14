import {
  AlertTriangle,
  CheckSquare,
  Hourglass,
  Repeat,
  Users,
  Wallet,
} from "lucide-react";

// ── Metric cards ──────────────────────────────────────────
export const metrics = [
  {
    title: "Transaction",
    icon: Repeat,
    value: 132,
    success: 100,
    pending: 20,
    failed: 12,
  },
  {
    title: "Customers",
    icon: Users,
    value: 50,
    success: 100,
    pending: 20,
    failed: 12,
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    value: 100,
    success: 100,
    pending: 20,
    failed: 12,
  },
  {
    title: "Finance",
    icon: Wallet,
    value: 47,
    success: 100,
    pending: 20,
    failed: 12,
  },
];

export const statToneClass: Record<string, string> = {
  success: "text-main-green",
  warning: "text-yellow-600",
  danger: "text-main-red",
  neutral: "text-deep-blue",
};

// ── Workflow health ───────────────────────────────────────
export const workflowHealth = [
  {
    icon: Hourglass,
    tone: "danger",
    title: "Transactions stuck in pending",
    count: 21,
    progress: 60,
    detail: "14 awaiting review",
    detailSecondary: "7 flagged",
    trend: "+12% vs yesterday",
  },
  {
    icon: AlertTriangle,
    tone: "warning",
    title: "Task Overdue",
    count: "25%",
    progress: 25,
    detail: "15 assigned",
    detailSecondary: "4 unassigned",
    trend: "+12% vs yesterday",
  },
  {
    icon: Hourglass,
    tone: "warning",
    title: "Affiliate payout pending",
    count: 10,
    progress: 50,
    detail: "5 awaiting review",
    detailSecondary: "2 flagged · 3 declined",
    trend: "+12% vs yesterday",
  },
];

export const workflowIconClass: Record<string, string> = {
  danger: "bg-red-50 text-main-red",
  warning: "bg-yellow-50 text-yellow-600",
};

export const workflowBarClass: Record<string, string> = {
  danger: "bg-main-red",
  warning: "bg-yellow-500",
};

// ── Needs urgent attention ────────────────────────────────
export const urgentAttention = [
  {
    tone: "danger",
    title: "Transactions Pending > 24 hrs",
    subtitle: "High value transactions not treated",
    count: 16,
    detail: "Total value: ₦234,500.00",
    action: "View Details",
    href: "/transactions",
  },
  {
    tone: "warning",
    title: "Payment Awaiting Approval",
    subtitle: "Finance team review required",
    count: 22,
    detail: "Oldest: 2 days ago",
    action: "Review Queue",
    href: "/finance",
  },
  {
    tone: "info",
    title: "Overdue Tasks With No Owner",
    subtitle: "Critical tasks require assignment",
    count: 5,
    detail: "Avg Overdue: 4.2 days",
    action: "Assign Tasks",
    href: "/tasks",
  },
];

export const urgentStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  danger: { bg: "bg-red-50", border: "border-main-red", text: "text-main-red" },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    text: "text-yellow-700",
  },
  info: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700" },
};
