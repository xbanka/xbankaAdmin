import { FundingIntentLog, LoginLog, RoleChangeLog } from "@/components/audit-log/types";
import { useQuery } from "@tanstack/react-query";
import {
  getFundingIntentAuditLogs,
  getLoginLogs,
  getRoleChangeLogs,
} from "@/lib/actions/auditLogActions";
import { estimatePagination } from "@/lib/utils/pagination";

interface AuditLogParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface FundingIntentAuditParams extends AuditLogParams {
  action?: string;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFundingIntent(raw: any): FundingIntentLog {
  // override_amount is a decimal string; null means the declared amount was used.
  const override = raw.override_amount == null ? null : Number(raw.override_amount);

  return {
    id: raw.id,
    timestamp: raw.created_at,
    staffName: raw.staff ? `${raw.staff.first_name} ${raw.staff.last_name}`.trim() : "Unknown",
    staffId: raw.staff?.staff_code ?? "-",
    transactionId: raw.transaction_id,
    action: raw.action === "REJECTED" ? "rejected" : "completed",
    status: raw.status === "SUCCESS" ? "success" : "failed",
    failureReason: raw.failure_reason ?? null,
    bankReference: raw.bank_reference ?? null,
    overrideAmount: override !== null && Number.isFinite(override) ? override : null,
    reason: raw.reason ?? null,
    ipAddress: raw.ip_address ?? null,
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

export function useGetFundingIntentAuditLogs({
  enabled = true,
  ...params
}: FundingIntentAuditParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return useQuery({
    queryKey: ["audit-log", "funding-intents", params],
    enabled,
    queryFn: async () => {
      const response = await getFundingIntentAuditLogs({
        action: params.action,
        search: params.search,
        status: params.status,
        page,
        limit,
      });
      const logs = (response.data ?? []).map(mapFundingIntent);
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
