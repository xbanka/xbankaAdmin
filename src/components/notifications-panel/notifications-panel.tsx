"use client";

import { useEffect, useState } from "react";
import { X, Bell, UserPlus, Check, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markAsReadNotification } from "@/lib/actions/notificationsActions";
import { confirmRoleChange } from "@/lib/actions/auditLogActions";
import {
  NOTIFICATIONS_QUERY_KEY,
  useGetNotifications,
} from "@/lib/services/notification.service";
import LoaderSpinner from "../ui/loaderSpinner";
import { usePayoutSidebarStore } from "@/store/usePayoutSidebarStore";
import { useRateProposalSidebarStore } from "@/store/useRateProposalSidebarStore";
import { cn } from "@/lib/utils";
import {
  Affiliate,
  NotificationFilters,
  NotificationReferenceType,
  PayoutNotification,
} from "./notifications";

type TypeFilter = "ALL" | NotificationReferenceType;
type StatusFilter = "ALL" | "ACTIVE" | "RESOLVED";
type ReadFilter = "ALL" | "READ" | "UNREAD";

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PAYOUT", label: "Payouts" },
  { value: "RATE_PROPOSAL", label: "Rate Proposals" },
  { value: "STAFF_ACCOUNT", label: "Staff Accounts" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Any status" },
  { value: "ACTIVE", label: "Unresolved" },
  { value: "RESOLVED", label: "Resolved" },
];

const READ_OPTIONS: { value: ReadFilter; label: string }[] = [
  { value: "ALL", label: "Read & unread" },
  { value: "UNREAD", label: "Unread" },
  { value: "READ", label: "Read" },
];

const formatMethod = (m?: string) =>
  (m ?? "")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatAmount = (a?: number) =>
  a == null ? "—" : `₦${Number(a).toLocaleString()}`;

const formatReferenceType = (referenceType?: string) =>
  (referenceType ?? "")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const getAffiliateName = (affiliate?: Affiliate | null) => {
  if (!affiliate) return "System";

  if (affiliate.username) {
    return affiliate.username.startsWith("@")
      ? affiliate.username
      : `@${affiliate.username}`;
  }

  return `${affiliate.first_name} ${affiliate.last_name}`;
};

function timeAgo(iso?: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function emptyStateCopy(
  type: TypeFilter,
  status: StatusFilter,
  read: ReadFilter,
) {
  const noun =
    type === "ALL"
      ? "notifications"
      : `${formatReferenceType(type).toLowerCase()} notifications`;

  const qualifiers = [
    read === "UNREAD" ? "unread" : read === "READ" ? "read" : null,
    status === "ACTIVE" ? "unresolved" : status === "RESOLVED" ? "resolved" : null,
  ].filter(Boolean);

  return qualifiers.length
    ? `No ${qualifiers.join(", ")} ${noun}`
    : `No ${noun}`;
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [readFilter, setReadFilter] = useState<ReadFilter>("ALL");

  const queryClient = useQueryClient();

  // Each axis left on "ALL" is simply omitted from the request.
  const filters: NotificationFilters = {
    ...(typeFilter === "ALL" ? {} : { reference_type: typeFilter }),
    ...(statusFilter === "ALL" ? {} : { status: statusFilter }),
    ...(readFilter === "ALL" ? {} : { is_read: readFilter === "READ" }),
  };

  const hasActiveFilters =
    typeFilter !== "ALL" || statusFilter !== "ALL" || readFilter !== "ALL";

  const { data, error, isPending } = useGetNotifications(filters);
  const { openDetailsSidebar } = usePayoutSidebarStore();
  const { openSidebar: openRateProposalSidebar } =
    useRateProposalSidebarStore();

  const notifications: PayoutNotification[] = data?.data || [];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const markReadMutation = useMutation({
    mutationFn: markAsReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const confirmRoleChangeMutation = useMutation({
    mutationFn: confirmRoleChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["audit-log", "role-changes"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.message || "Failed to confirm role change.");
    },
  });

  const clearFilters = () => {
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setReadFilter("ALL");
  };

  const handleViewRequest = (notification: PayoutNotification) => {
    if (notification.reference_type === "STAFF_ACCOUNT") {
      if (!notification.reference_id) {
        console.error("Notification has no reference_id", notification);
        return;
      }

      // Self-confirmation workflow: confirming applies the staff member's
      // pending role change (and any pending permission overrides).
      confirmRoleChangeMutation.mutate({ id: notification.reference_id });
      markReadMutation.mutate({
        id: notification.id,
      });
      return;
    }

    const referenceId = notification.reference_id;

    if (!referenceId) {
      console.error("Notification has no reference_id", notification);
      return;
    }

    markReadMutation.mutate({
      id: notification.id,
    });

    if (notification.reference_type === "RATE_PROPOSAL") {
      openRateProposalSidebar(referenceId);
    } else {
      openDetailsSidebar(referenceId);
    }
  };

  return (
    <>
      {/* Click-outside catcher. Radix select menus portal above this, so
          picking a filter option doesn't close the panel. */}
      <div
        className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-x-3 top-16 z-50 flex flex-col overflow-hidden rounded-xl border border-[#E5E3E3] bg-white shadow-2xl",
          "sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[420px]",
          "max-h-[min(540px,calc(100vh-6rem))]",
        )}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E3E3] px-5 py-3.5">
          <h2 className="text-[16px] font-bold text-[#111827]">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close notifications"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Type filter */}
        <div className="flex flex-shrink-0 gap-2 overflow-x-auto border-b border-[#F0F0F0] px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TYPE_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                typeFilter === value
                  ? "border-abstractCyan bg-[#E6FBF7] text-abstractCyan"
                  : "border-transparent bg-transparent text-[#6B7280] hover:bg-[#F3F4F6]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status + read filters */}
        <div className="flex flex-shrink-0 items-center gap-2 border-b border-[#E5E3E3] px-4 py-2.5">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger
              size="sm"
              className="h-7 flex-1 rounded-lg border-[#E5E3E3] px-2.5 text-[12px] text-[#4B5563]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-[13px]">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={readFilter}
            onValueChange={(v) => setReadFilter(v as ReadFilter)}
          >
            <SelectTrigger
              size="sm"
              className="h-7 flex-1 rounded-lg border-[#E5E3E3] px-2.5 text-[12px] text-[#4B5563]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {READ_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-[13px]">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="whitespace-nowrap text-[12px] font-medium text-abstractCyan hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Scrollable list */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isPending && (
            <div className="flex items-center justify-center py-12">
              <LoaderSpinner />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center px-6 py-12 text-center">
              <p className="text-sm text-red-500">{error?.message}</p>
            </div>
          )}

          {!isPending && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center text-gray-400">
              <Bell className="h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                {emptyStateCopy(typeFilter, statusFilter, readFilter)}
              </p>
              <p className="text-xs text-gray-400">
                {hasActiveFilters
                  ? "Try widening your filters."
                  : "You're all caught up."}
              </p>
            </div>
          )}

          {!isPending && !error && notifications.length > 0 && (
            <ul className="divide-y divide-[#F0F0F0]">
              {notifications.map((notification: PayoutNotification) => {
                const unread = !notification.is_read;
                const isResolved = notification.status === "RESOLVED";
                const isConfirming =
                  (markReadMutation.isPending &&
                    markReadMutation.variables?.id === notification.id) ||
                  (confirmRoleChangeMutation.isPending &&
                    confirmRoleChangeMutation.variables?.id ===
                      notification.reference_id);
                const showConfirmCta = !(
                  isResolved &&
                  (notification.reference_type === "STAFF_ACCOUNT" ||
                    notification.reference_type === "RATE_PROPOSAL")
                );
                return (
                  <li
                    key={notification.id}
                    onClick={() => handleViewRequest(notification)}
                    className={cn(
                      "relative cursor-pointer px-5 py-3.5 transition-colors hover:bg-[#F9FAFB]",
                      "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-['']",
                      unread
                        ? "bg-[#F1FFFD] before:bg-abstractCyan"
                        : "bg-white before:bg-transparent",
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Type icon */}
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-abstractCyan">
                        {notification.reference_type === "STAFF_ACCOUNT" ? (
                          <UserPlus className="h-4.5 w-4.5" />
                        ) : notification.reference_type === "RATE_PROPOSAL" ? (
                          <TrendingUp className="h-4.5 w-4.5" />
                        ) : (
                          <span className="text-[15px] font-bold">₦</span>
                        )}
                      </span>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-[14px] font-semibold text-[#111827]">
                          {notification?.message}
                        </p>

                        {notification.reference_type === "RATE_PROPOSAL" ||
                        notification.reference_type === "STAFF_ACCOUNT" ? (
                          <p className="mt-0.5 text-[12px] leading-[18px] text-[#4B5563]">
                            <span className="text-[#6B7280]">Reference:</span>{" "}
                            {formatReferenceType(notification.reference_type)}
                          </p>
                        ) : (
                          <>
                            <p className="mt-0.5 text-[12px] leading-[18px] text-[#4B5563]">
                              <span className="text-[#6B7280]">Affiliate:</span>{" "}
                              {getAffiliateName(notification.affiliate)}
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-[#6B7280]">Amount:</span>{" "}
                              <span className="font-medium text-[#111827]">
                                {formatAmount(notification?.amount)}
                              </span>
                            </p>
                            <p className="text-[12px] leading-[18px] text-[#4B5563]">
                              <span className="text-[#6B7280]">Method:</span>{" "}
                              {formatMethod(notification?.method)}
                            </p>
                          </>
                        )}

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {showConfirmCta && (
                              <Button
                                size="sm"
                                disabled={isConfirming}
                                className="h-8 w-fit rounded-lg bg-[#17E1C5] px-3.5 text-[12px] font-semibold text-[#06251F] hover:bg-[#13C9B0] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewRequest(notification);
                                }}
                              >
                                {notification.reference_type ===
                                "RATE_PROPOSAL"
                                  ? "Review"
                                  : notification.reference_type ===
                                      "STAFF_ACCOUNT"
                                    ? "Confirm"
                                    : "View Request"}
                              </Button>
                            )}
                            {isResolved && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-light px-2.5 py-1 text-[11px] font-medium text-success-text">
                                <Check className="h-3 w-3" />
                                Resolved
                              </span>
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-[11px] text-[#9CA3AF]",
                              !showConfirmCta && !isResolved && "ml-auto",
                            )}
                          >
                            {timeAgo(
                              notification?.affiliate?.created_at ??
                                notification?.read_at,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
