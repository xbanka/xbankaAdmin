"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import {
  useGetRoleChangeLogs,
  useGetLoginLogs,
  useGetFundingIntentAuditLogs,
} from "@/lib/services/audit-log.service";
import { usePermissions } from "@/hooks/usePermissions";
import { useDebounce } from "@/hooks/useDebounce";
import { formatNaira } from "@/lib/utils/funding";
import { FundingIntentLog, LoginLog, RoleChangeLog } from "./types";
import { FundingIntentDetailSheet } from "./funding-intent-detail-sheet";
import { StatusBadge } from "../ui/status-badge";
import { RoleChangeCell } from "../staff/role-change-cell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const TABS = ["Role Changes", "Logins", "Funding Intents"] as const;
type Tab = (typeof TABS)[number];

const ROLE_CHANGE_STATUS_OPTIONS = [
  { value: "", label: "All status" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SUPERSEDED", label: "Superseded" },
];

const LOGIN_STATUS_OPTIONS = [
  { value: "", label: "All status" },
  { value: "SUCCESS", label: "Success" },
  { value: "FAILED", label: "Failed" },
];

const FUNDING_ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
];

function formatTimestamp(iso: string) {
  const date = new Date(iso);

  const day = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day}, ${time}`;
}

function StaffCell({ name, staffId }: { name: string; staffId: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-text-primary-font-color">{name}</span>
      <span className="text-xs text-secondary-text">{staffId}</span>
    </div>
  );
}

export default function AuditLogPage() {
  const { hasPermission } = usePermissions();
  const canViewAuditLogs = hasPermission("audit:view_logs");

  const [activeTab, setActiveTab] = useState<Tab>("Role Changes");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<FundingIntentLog | null>(null);
  const limit = 10;
  const debouncedSearch = useDebounce(search, 400);

  const isRoleChanges = activeTab === "Role Changes";
  const isLogins = activeTab === "Logins";
  const isFundingIntents = activeTab === "Funding Intents";
  const statusOptions = isRoleChanges ? ROLE_CHANGE_STATUS_OPTIONS : LOGIN_STATUS_OPTIONS;
  const statusLabelSelected =
    statusOptions.find((o) => o.value === statusFilter)?.label ?? "All status";
  const actionLabelSelected =
    FUNDING_ACTION_OPTIONS.find((o) => o.value === actionFilter)?.label ?? "All actions";

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setStatusFilter("");
    setActionFilter("");
    setPage(1);
  };

  const roleChangesQuery = useGetRoleChangeLogs({
    search,
    status: statusFilter,
    page,
    limit,
    enabled: canViewAuditLogs && isRoleChanges,
  });
  const loginsQuery = useGetLoginLogs({
    search,
    status: statusFilter,
    page,
    limit,
    enabled: canViewAuditLogs && isLogins,
  });
  const fundingIntentsQuery = useGetFundingIntentAuditLogs({
    search: debouncedSearch,
    action: actionFilter,
    status: statusFilter,
    page,
    limit,
    enabled: canViewAuditLogs && isFundingIntents,
  });

  const roleChangeColumns = useMemo(
    () => [
      {
        key: "timestamp" as const,
        header: "Timestamp",
        render: (item: RoleChangeLog) => formatTimestamp(item.timestamp),
      },
      {
        key: "changedBy" as const,
        header: "Changed by",
      },
      {
        key: "staff" as const,
        header: "Staff",
        render: (item: RoleChangeLog) => (
          <StaffCell name={item.staffName} staffId={item.staffId} />
        ),
      },
      {
        key: "roleChange" as const,
        header: "Role Change",
        render: (item: RoleChangeLog) => (
          <RoleChangeCell from={item.roleFrom} to={item.roleTo} />
        ),
      },
      {
        key: "reason" as const,
        header: "Reason",
        hiddenOnMobile: true,
        render: (item: RoleChangeLog) => (
          <span className="text-secondary-text">{item.reason}</span>
        ),
      },
      {
        key: "status" as const,
        header: "Status",
        render: (item: RoleChangeLog) => <StatusBadge label={statusLabel(item.status)} />,
      },
    ],
    [],
  );

  const loginColumns = useMemo(
    () => [
      {
        key: "timestamp" as const,
        header: "Timestamp",
        render: (item: LoginLog) => formatTimestamp(item.timestamp),
      },
      {
        key: "staff" as const,
        header: "Staff",
        render: (item: LoginLog) => <StaffCell name={item.staffName} staffId={item.staffId} />,
      },
      {
        key: "ipAddress" as const,
        header: "IP Address",
      },
      {
        key: "details" as const,
        header: "Details",
        hiddenOnMobile: true,
        render: (item: LoginLog) => (
          <span className="text-secondary-text">{item.details}</span>
        ),
      },
      {
        key: "status" as const,
        header: "Status",
        render: (item: LoginLog) => <StatusBadge label={statusLabel(item.status)} />,
      },
    ],
    [],
  );

  const fundingIntentColumns = useMemo(
    () => [
      {
        key: "timestamp" as const,
        header: "Date",
        render: (item: FundingIntentLog) => formatTimestamp(item.timestamp),
      },
      {
        key: "staff" as const,
        header: "Staff",
        render: (item: FundingIntentLog) => (
          <StaffCell name={item.staffName} staffId={item.staffId} />
        ),
      },
      {
        key: "action" as const,
        header: "Action",
        render: (item: FundingIntentLog) => (
          <span className="text-text-primary-font-color">
            {item.action === "completed" ? "Completed" : "Rejected"}
          </span>
        ),
      },
      {
        key: "status" as const,
        header: "Outcome",
        render: (item: FundingIntentLog) => (
          <div className="flex flex-col items-start gap-1">
            <StatusBadge label={statusLabel(item.status)} />
            {item.failureReason && (
              <span
                title={item.failureReason}
                className="max-w-[220px] truncate text-xs text-secondary-text"
              >
                {item.failureReason}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "transactionId" as const,
        header: "Transaction",
        hiddenOnMobile: true,
        render: (item: FundingIntentLog) => (
          <span title={item.transactionId} className="font-mono text-xs text-secondary-text">
            {item.transactionId.slice(0, 8)}
          </span>
        ),
      },
      {
        key: "bankReference" as const,
        header: "Bank ref",
        hiddenOnMobile: true,
        render: (item: FundingIntentLog) => item.bankReference ?? "—",
      },
      {
        key: "overrideAmount" as const,
        header: "Amount override",
        hiddenOnMobile: true,
        render: (item: FundingIntentLog) =>
          item.overrideAmount === null ? "—" : formatNaira(item.overrideAmount),
      },
      {
        key: "reason" as const,
        header: "Reason",
        hiddenOnMobile: true,
        render: (item: FundingIntentLog) => (
          <span className="text-secondary-text">{item.reason ?? "—"}</span>
        ),
      },
      {
        key: "actions" as const,
        header: "",
        render: (item: FundingIntentLog) => (
          <button
            type="button"
            onClick={() => setSelectedIntent(item)}
            className="text-sm font-medium text-text-teal hover:underline"
          >
            View
          </button>
        ),
      },
    ],
    [],
  );

  const activeQuery = isRoleChanges
    ? roleChangesQuery
    : isLogins
      ? loginsQuery
      : fundingIntentsQuery;
  const rows = activeQuery.data?.data.logs ?? [];
  const totalCount = activeQuery.data?.data.total ?? rows.length;
  const totalPages = activeQuery.data?.data.pages;

  // A page past the end is a 200 with no rows (e.g. a refetch after the data
  // shrank); step back to the last real page.
  useEffect(() => {
    if (totalPages && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);
  const activeColumns = isRoleChanges
    ? roleChangeColumns
    : isLogins
      ? loginColumns
      : fundingIntentColumns;
  const emptyMessage = isRoleChanges
    ? "No role changes found."
    : isLogins
      ? "No login activity found."
      : "No funding intent activity found.";

  if (!canViewAuditLogs) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <p className="text-sm text-secondary-text">
            You don&apos;t have permission to view audit logs.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-primary-font-color mb-2">Audit Log</h1>
          </div>

          <UnderlineTabs tabs={TABS} value={activeTab} onChange={(v) => switchTab(v as Tab)} className="mb-4" />

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input focus:outline-none focus:border-input-border-focus"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-input text-text-primary-font-color"
                >
                  {statusLabelSelected}
                  <ChevronDown className="w-4 h-4 text-secondary-text" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value || "all"}
                    onSelect={() => {
                      setStatusFilter(option.value);
                      setPage(1);
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isFundingIntents && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-input text-text-primary-font-color"
                  >
                    {actionLabelSelected}
                    <ChevronDown className="w-4 h-4 text-secondary-text" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {FUNDING_ACTION_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value || "all"}
                      onSelect={() => {
                        setActionFilter(option.value);
                        setPage(1);
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <DataTableLayout<RoleChangeLog | LoginLog | FundingIntentLog>
            data={rows}
            columns={activeColumns as never}
            isLoading={activeQuery.isPending}
            isError={activeQuery.isError}
            errorMessage="Failed to load audit log."
            rowKey={(item) => (item as RoleChangeLog | LoginLog | FundingIntentLog).id}
            emptyMessage={emptyMessage}
            currentPage={page}
            onPageChange={setPage}
            totalCount={totalCount}
            itemsPerPage={limit}
          />
        </div>
      </div>
      <FundingIntentDetailSheet log={selectedIntent} onClose={() => setSelectedIntent(null)} />
    </DashboardLayout>
  );
}

function statusLabel(
  status: RoleChangeLog["status"] | LoginLog["status"] | FundingIntentLog["status"],
) {
  switch (status) {
    case "success":
      return "Success";
    case "failed":
      return "Failed";
    case "pending":
      return "Pending confirmation";
    case "confirmed":
      return "Confirmed";
    case "superseded":
      return "Superseded";
    default:
      return status;
  }
}