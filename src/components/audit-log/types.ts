export interface RoleChangeLog {
  id: string;
  timestamp: string; // ISO string
  changedBy: string;
  staffName: string;
  staffId: string;
  roleFrom: string;
  roleTo: string;
  reason: string;
  status: "success" | "failed" | "pending";
}

export interface LoginLog {
  id: string;
  timestamp: string; // ISO string
  staffName: string;
  staffId: string;
  ipAddress: string;
  details: string; // e.g. failure reason, or "-" when nothing to note
  status: "success" | "failed" | "pending";
}