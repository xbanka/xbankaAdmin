export interface RoleChangeLog {
  id: string;
  timestamp: string; // ISO string
  changedBy: string;
  staffName: string;
  staffId: string;
  roleFrom: string;
  roleTo: string;
  reason: string;
  status: "pending" | "confirmed" | "superseded";
}

export interface FundingIntentLog {
  id: string;
  timestamp: string; // ISO string
  staffName: string;
  staffId: string;
  transactionId: string;
  action: "completed" | "rejected";
  status: "success" | "failed";
  failureReason: string | null; // "<http status>: <message>", only on failed rows
  bankReference: string | null;
  overrideAmount: number | null; // null when the declared amount was used
  fundingAccountId: string | null;
  attachmentUrls: string[]; // proof of payment; empty when none were sent
  reason: string | null;
  ipAddress: string | null;
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