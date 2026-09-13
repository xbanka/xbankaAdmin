import { LoginLog, RoleChangeLog } from "@/components/audit-log/types";
import { useQuery } from "@tanstack/react-query";
import { getLoginLogs, getRoleChangeLogs } from "@/lib/actions/auditLogActions";

interface AuditLogParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRoleChange(raw: any): RoleChangeLog {
  return {
    id: raw.id,
    timestamp: raw.created_at,
    changedBy: raw.changed_by,
    staffName: `${raw.staff?.first_name ?? ""} ${raw.staff?.last_name ?? ""}`.trim(),
    staffId: raw.staff?.staff_code ?? "",
    roleFrom: raw.role_change?.previous_role ?? "",
    roleTo: raw.role_change?.new_role ?? "",
    reason: raw.reason ?? "",
    status: raw.status === "CONFIRMED" ? "confirmed" : "pending",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLogin(raw: any): LoginLog {
  return {
    id: raw.id,
    timestamp: raw.created_at,
    staffName: raw.staff ? `${raw.staff.first_name} ${raw.staff.last_name}`.trim() : "Unknown",
    staffId: raw.staff?.staff_code ?? "-",
    ipAddress: raw.ip_address ?? "-",
    details: raw.failure_reason ?? "-",
    status: raw.status === "SUCCESS" ? "success" : "failed",
  };
}

// The list endpoints return a plain array with no total count. Since the
// page size is fixed by `limit`, a page shorter than `limit` (or empty) is
// the last page; otherwise assume at least one more page exists.
function estimatePagination(page: number, limit: number, count: number) {
  const isLastPage = count < limit;
  return {
    hasNextPage: !isLastPage,
    total: isLastPage ? (page - 1) * limit + count : page * limit + 1,
  };
}

export function useGetRoleChangeLogs({ enabled = true, ...params }: AuditLogParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return useQuery({
    queryKey: ["audit-log", "role-changes", params],
    enabled,
    queryFn: async () => {
      const response = await getRoleChangeLogs({ search: params.search, status: params.status, page, limit });
      const logs = (response.data ?? []).map(mapRoleChange);
      const { total, hasNextPage } = estimatePagination(page, limit, logs.length);
      return { data: { logs, total, hasNextPage } };
    },
  });
}

export function useGetLoginLogs({ enabled = true, ...params }: AuditLogParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return useQuery({
    queryKey: ["audit-log", "logins", params],
    enabled,
    queryFn: async () => {
      const response = await getLoginLogs({ search: params.search, status: params.status, page, limit });
      const logs = (response.data ?? []).map(mapLogin);
      const { total, hasNextPage } = estimatePagination(page, limit, logs.length);
      return { data: { logs, total, hasNextPage } };
    },
  });
}
