import { permission } from "@/store/userStore";
import { Role } from "./enum/roles&permission.enum";

// rolePermissions.ts
export const rolePermissions = {
  SUPER_ADMIN: [
    "/",
    "/customerManagement",
    "/transactions",
    "/support",
    "/refunds",
    "/content",
    "/tasks",
    "/audit",
    "/inventory",
    "/admin",
  ],
  CUSTOMER_SUPPORT: [
    "/dashboard",
    "/customerManagement",
    "/transactions",
    "/admin",
  ],
  SEO_WRITER: ["/content", "/tasks"],
  ADMIN: [
    "/dashboard",
    "/customerManagement",
    "/transactions",
    "/support",
    "/refunds",
    "/content",
    "/tasks",
    "/audit",
    "/inventory",
    // ❌ no admin panel
  ],
} as const;

export type Permission =
  (typeof PERMISSION_CATEGORIES)[keyof typeof PERMISSION_CATEGORIES][number];

export type ApiPermission =
  (typeof UI_TO_API_PERMISSION_MAP)[keyof typeof UI_TO_API_PERMISSION_MAP];


export const ROLE_CONFIG: Record<
  Role,
  {
    defaultPermissions: Permission[];
    optionalPermissions: Permission[];
    neverAllowedPermissions: Permission[];
  }
> = {
  Admin: {
    defaultPermissions: [
      "transactions_viewTransactions",
      "transactions_verifyTransactions",
      "customers_viewCustomers",
      "customers_editDetails",
      "kyc_viewKycData",
      "kyc_updateKycStatus",
      "tasks_viewTasks",
      "tasks_createTasks",
      "tasks_assignTasks",
      "tasks_updateTaskStatus",
      "tasks_viewTaskProgress",
      "staff_viewStaffList",
      "staff_addStaff",
      "staff_editPermissions",
      "staff_suspendActivate",
      "audit_viewAuditLogs",
    ],
    optionalPermissions: [
      "kyc_approveKyc",
      "kyc_rejectKyc",
      "tasks_deleteTasks",
      "reports_exportOperational",
      "reconciliation_viewRecords",
    ],
    neverAllowedPermissions: [
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "transactions_settleTransactions",
      "systemSettings_editSettings",
      "audit_exportAuditLogs",
      "staff_createSuperAdmin",
      "finance_bypassApprovals",
    ],
  },
  Manager: {
    defaultPermissions: [
      "transactions_viewTransactions",
      "customers_viewCustomers",
      "kyc_viewKycStatus",
      "tasks_viewTasks",
      "tasks_assignTasks",
      "tasks_updateTaskStatus",
      "tasks_viewTaskAnalytics",
    ],
    optionalPermissions: [
      "transactions_verifyTransactions",
      "kyc_viewKycDocuments",
      "tasks_commentTasks",
    ],
    neverAllowedPermissions: [
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "transactions_createTransactions",
      "transactions_settleTransactions",
      "staff_editPermissions",
      "finance_viewProfit",
      "systemSettings_editSettings",
      "audit_viewAuditLogs",
    ],
  },
  Finance: {
    defaultPermissions: [
      "transactions_viewTransactions",
      "finance_viewPayments",
      "finance_approvePayments",
      "finance_rejectPayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "finance_flagPayments",
      "affiliate_viewPayouts",
      "affiliate_approvePayouts",
      "affiliate_holdPayouts",
      "reconciliation_viewRecords",
      "kyc_viewKycStatus",
      "tasks_viewTasks",
      "tasks_commentTasks",
    ],
    optionalPermissions: [
      "finance_retryPayments",
      "finance_reverseSettlements",
      "affiliate_adjustBalances",
      "reports_exportFinance",
    ],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "transactions_settleTransactions",
      "staff_editPermissions",
      "systemSettings_editSettings",
      "records_deleteRecords",
      "audit_bypassLogging",
    ],
  },
  Operations: {
    defaultPermissions: [
      "transactions_createTransactions",
      "transactions_updateStatus",
      "transactions_executeSettlements",
      "transactions_markCompleted",
      "customers_viewCustomers",
      "kyc_viewKycData",
      "kyc_uploadDocuments",
      "tasks_viewTasks",
      "tasks_updateTaskStatus",
      "tasks_commentTasks",
      "tasks_attachDocuments",
    ],
    optionalPermissions: [
      "transactions_mergeTransactions",
      "tasks_createTasks",
      "tasks_editDetails",
    ],
    neverAllowedPermissions: [
      "kyc_approveKyc",
      "kyc_rejectKyc",
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "finance_viewProfit",
      "staff_editPermissions",
      "systemSettings_editSettings"
    ],
  },
  Compliance: {
    defaultPermissions: [
      "transactions_viewTransactions",
      "transactions_flagTransactions",
      "transactions_freezeTransactions",
      "kyc_viewKycData",
      "kyc_approveKyc",
      "kyc_rejectKyc",
      "kyc_flagKyc",
      "tasks_viewTasks",
      "tasks_commentTasks",
      "tasks_createComplianceTasks",
      "audit_viewAuditLogs",
    ],
    optionalPermissions: [
      "finance_viewSummaries",
      "transactions_recommendReversal",
    ],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "transactions_settleTransactions",
      "finance_approvePayments",
      "systemSettings_editSettings",
    ],
  },
  "Customer Rep": {
    defaultPermissions: [
      "transactions_createTransactions",
      "transactions_viewAssignedTransactions",
      "customers_viewAssignedCustomers",
      "customers_updateCustomerInfo",
      "kyc_uploadDocuments",
      "kyc_viewKycStatus",
      "tasks_viewAssignedTasks",
      "tasks_updateTaskStatus",
      "tasks_commentTasks",
    ],
    optionalPermissions: [],
    neverAllowedPermissions: [
      "kyc_approveKyc",
      "kyc_rejectKyc",
      "transactions_verifyTransactions",
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "transactions_settleTransactions",
      "finance_viewPayments",
      "systemSettings_editSettings",
    ],
  },
  Staff: {
    defaultPermissions: [
      "tasks_viewAssignedTasks",
      "tasks_updateTaskStatus",
      "transactions_viewLimitedTransactions",
    ],
    optionalPermissions: ["tasks_commentTasks"],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "finance_approvePayments",
      "finance_viewPayments",
      "staff_editPermissions",
      "systemSettings_editSettings",
    ],
  },
  Viewer: {
    defaultPermissions: [
      "dashboards_viewReadOnly",
      "reports_viewReadOnly",
      "tasks_viewBoardReadOnly",
    ],
    optionalPermissions: ["reports_exportReadOnly"],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "transactions_updateStatus",
      "finance_approvePayments",
      "kyc_viewKycDocuments",
      "systemSettings_editSettings",
    ],
  },
};

export const PERMISSION_CATEGORIES = {
  Transactions: [
    "transactions_viewTransactions",
    "transactions_viewAssignedTransactions",
    "transactions_viewLimitedTransactions",
    "transactions_createTransactions",
    "transactions_verifyTransactions",
    "transactions_updateStatus",
    "transactions_settleTransactions",
    "transactions_executeSettlements",
    "transactions_markCompleted",
    "transactions_flagTransactions",
    "transactions_freezeTransactions",
    "transactions_mergeTransactions",
    "transactions_recommendReversal",
  ],

  Finance: [
    "finance_viewPayments",
    "finance_approvePayments",
    "finance_rejectPayments",
    "finance_holdPayments",
    "finance_releasePayments",
    "finance_flagPayments",
    "finance_retryPayments",
    "finance_reverseSettlements",
    "finance_viewProfit",
    "finance_viewSummaries",
    "finance_bypassApprovals",
  ],

  Affiliate: [
    "affiliate_viewPayouts",
    "affiliate_approvePayouts",
    "affiliate_holdPayouts",
    "affiliate_adjustBalances",
  ],

  Customers: [
    "customers_viewCustomers",
    "customers_manageCustomers",
    "customers_viewAssignedCustomers",
    "customers_updateCustomerInfo",
    "customers_editDetails",
  ],

  KYC: [
    "kyc_viewKycStatus",
    "kyc_viewKycData",
    "kyc_viewKycDocuments",
    "kyc_updateKycStatus",
    "kyc_uploadDocuments",
    "kyc_approveKyc",
    "kyc_rejectKyc",
    "kyc_flagKyc",
  ],

  Tasks: [
    "tasks_viewTasks",
    "tasks_viewAssignedTasks",
    "tasks_viewTaskProgress",
    "tasks_viewTaskAnalytics",
    "tasks_viewBoardReadOnly",
    "tasks_createTasks",
    "tasks_createComplianceTasks",
    "tasks_assignTasks",
    "tasks_updateTaskStatus",
    "tasks_editDetails",
    "tasks_commentTasks",
    "tasks_attachDocuments",
    "tasks_deleteTasks",
  ],

  "Staff & Access": [
    "staff_viewStaffList",
    "staff_addStaff",
    "staff_editPermissions",
    "staff_suspendActivate",
    "staff_createSuperAdmin",
  ],

  Audit: [
    "audit_viewAuditLogs",
    "audit_exportAuditLogs",
    "audit_bypassLogging",
  ],

  Reports: [
    "reports_viewReadOnly",
    "reports_exportReadOnly",
    "reports_exportOperational",
    "reports_exportFinance",
  ],

  Reconciliation: ["reconciliation_viewRecords"],

  Dashboards: ["dashboards_viewReadOnly"],

  SystemSettings: ["systemSettings_editSettings"],

  Other: ["records_deleteRecords"],
} as const;

export const getRolePermissionDefaults = (role: Role) => {
  const config = ROLE_CONFIG[role];

  const values: Record<string, boolean> = {};

  config.defaultPermissions.forEach((p) => {
    values[p] = true; // 👈 checked
  });

  config.optionalPermissions.forEach((p) => {
    values[p] = false; // 👈 unchecked
  });

  return values;
};

export const UI_TO_API_PERMISSION_MAP: Record<Permission, string> = {
  // Transactions
  transactions_viewTransactions: "transactions:view",
  transactions_createTransactions: "transactions:create",
  transactions_verifyTransactions: "transactions:verify",
  transactions_settleTransactions: "transactions:settle",
  transactions_flagTransactions: "transactions:flag",
  transactions_freezeTransactions: "transactions:freeze",
  transactions_updateStatus: "transactions:update_status",
  transactions_markCompleted: "transactions:mark_complete",
  transactions_mergeTransactions: "transactions:merge",
  transactions_recommendReversal: "transactions:recommend_reversal",
  transactions_executeSettlements: "transactions:execute",
  transactions_viewAssignedTransactions: "transactions:view_assigned",
  transactions_viewLimitedTransactions: "transactions:view_limited",

  // Customers
  customers_viewCustomers: "customers:view",
  customers_manageCustomers: "customers:manage",
  customers_viewAssignedCustomers: "customers:view_assigned",
  customers_editDetails: "customers:edit",
  customers_updateCustomerInfo: "customers:update",

  // Finance
  finance_viewPayments: "finance:view_payments",
  finance_approvePayments: "finance:approve_payments",
  finance_rejectPayments: "finance:reject_payments",
  finance_flagPayments: "finance:flag_payments",
  finance_holdPayments: "finance:hold_payments",
  finance_releasePayments: "finance:release_payments",
  finance_retryPayments: "finance:retry_payments",
  finance_reverseSettlements: "finance:reverse_settlements",
  finance_viewSummaries: "finance:view_summaries",
  finance_viewProfit: "finance:view_profit",
  reports_exportFinance: "finance:export_reports",
  finance_bypassApprovals: "finance:bypass_approvals",

  // Affiliate (adjust balance moved here ✔)
  affiliate_viewPayouts: "affiliate:view_payouts",
  affiliate_approvePayouts: "affiliate:approve_payouts",
  affiliate_holdPayouts: "affiliate:hold_payouts",
  affiliate_adjustBalances: "affiliate:adjust_balance",

  // Staff
  staff_viewStaffList: "staff:view_list",
  staff_addStaff: "staff:add",
  staff_editPermissions: "staff:edit_permissions",
  staff_suspendActivate: "staff:suspend_activate",

  // Tasks
  tasks_viewTasks: "tasks:view",
  tasks_createTasks: "tasks:create",
  tasks_assignTasks: "tasks:assign",
  tasks_updateTaskStatus: "tasks:update_status",
  tasks_viewTaskProgress: "tasks:view_progress",
  tasks_viewTaskAnalytics: "tasks:view_analytics",
  tasks_commentTasks: "tasks:comment",
  tasks_attachDocuments: "tasks:attach_documents",
  tasks_createComplianceTasks: "tasks:create_compliance",
  tasks_editDetails: "tasks:edit_details",
  tasks_deleteTasks: "task:delete",
  tasks_viewAssignedTasks: "tasks:view_assigned",
  tasks_viewBoardReadOnly: "tasks:view_board",

  // KYC
  kyc_viewKycData: "kyc:view_data",
  kyc_viewKycStatus: "kyc:view_status",
  kyc_updateKycStatus: "kyc:update_status",
  kyc_uploadDocuments: "kyc:upload_documents",
  kyc_approveKyc: "kyc:approve",
  kyc_rejectKyc: "kyc:reject",
  kyc_flagKyc: "kyc:flag",
  kyc_viewKycDocuments: "kyc:view",

  // Audit
  audit_viewAuditLogs: "audit:view_logs",
  audit_exportAuditLogs: "audit:export_logs",
  audit_bypassLogging: "audit:bypass_logging",

  // Reports
  reports_viewReadOnly: "reports:view",
  reports_exportReadOnly: "Reports:export",
  reports_exportOperational: "reports:export_operational",

  // Reconciliation
  reconciliation_viewRecords: "reconciliation:view",

  // Dashboard
  dashboards_viewReadOnly: "dashboard:view",

  records_deleteRecords: "records:delete",

  // System
  systemSettings_editSettings: "system:edit_settings",
  
  staff_createSuperAdmin: "",
 
};

export const normalizePermissionsFromApi = (
  perms: permission[]
): Set<string> => {
  return new Set(perms.map((p) => p.name));
};

export const hasPermission = (
  permissionSet: Set<string>,
  required: string
): boolean => {
  return permissionSet.has(required);
};
