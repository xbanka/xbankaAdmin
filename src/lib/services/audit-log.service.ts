import { LoginLog, RoleChangeLog } from "@/components/audit-log/types";
import { useQuery } from "@tanstack/react-query";

// TODO: replace mock arrays + fetch delay with real API calls, e.g.
//   const { data } = await api.get(`/audit-log/role-changes?page=${page}`);
// Keep the hook signature the same so the page component doesn't change.

const MOCK_ROLE_CHANGES: RoleChangeLog[] = [
  {
    id: "1",
    timestamp: "2026-09-04T10:42:00Z",
    changedBy: "Joshua Adeniyi",
    staffName: "John Doe",
    staffId: "JD123451",
    roleFrom: "Manager",
    roleTo: "Admin",
    reason: "Promoted to team lead",
    status: "pending",
  },
  {
    id: "2",
    timestamp: "2026-09-02T15:27:00Z",
    changedBy: "Joshua Adeniyi",
    staffName: "Ronke Jane",
    staffId: "RJ324168",
    roleFrom: "Support",
    roleTo: "Operations",
    reason: "Coverage for operations",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2026-08-28T09:10:00Z",
    changedBy: "Joshua Adeniyi",
    staffName: "John Doe",
    staffId: "JD123451",
    roleFrom: "Admin",
    roleTo: "Manager",
    reason: "Role scope reduced",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2026-08-28T09:10:00Z",
    changedBy: "Joshua Adeniyi",
    staffName: "John Doe",
    staffId: "JD123451",
    roleFrom: "Manager",
    roleTo: "Viewer",
    reason: "Role scope reduced",
    status: "success",
  },
];

const MOCK_LOGINS: LoginLog[] = [
  {
    id: "1",
    timestamp: "2026-09-04T10:42:00Z",
    staffName: "John Doe",
    staffId: "JD123451",
    ipAddress: "12.122.344.567",
    details: "Failure reason",
    status: "failed",
  },
  {
    id: "2",
    timestamp: "2026-09-02T15:27:00Z",
    staffName: "Ronke Jane",
    staffId: "RJ324168",
    ipAddress: "12.122.344.567",
    details: "-",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2026-08-28T09:10:00Z",
    staffName: "John Doe",
    staffId: "JD123451",
    ipAddress: "12.122.344.567",
    details: "-",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2026-08-28T09:10:00Z",
    staffName: "John Doe",
    staffId: "JD123451",
    ipAddress: "12.122.344.567",
    details: "-",
    status: "success",
  },
];

interface AuditLogParams {
  search?: string;
  segment?: string;
  page?: number;
}

export function useGetRoleChangeLogs(params: AuditLogParams = {}) {
  return useQuery({
    queryKey: ["audit-log", "role-changes", params],
    queryFn: async () => {
      // TODO: swap for real request
      return { data: { logs: MOCK_ROLE_CHANGES, total: MOCK_ROLE_CHANGES.length } };
    },
  });
}

export function useGetLoginLogs(params: AuditLogParams = {}) {
  return useQuery({
    queryKey: ["audit-log", "logins", params],
    queryFn: async () => {
      // TODO: swap for real request
      return { data: { logs: MOCK_LOGINS, total: MOCK_LOGINS.length } };
    },
  });
}