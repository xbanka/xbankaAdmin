// roles.ts
export enum Role {
  ADMIN = "Admin",
  MANAGER = "Manager",
  FINANCE = "Finance",
  OPERATIONS = "Operations",
  COMPLIANCE = "Compliance",
  CUSTOMER_REP = "Customer Rep",
  STAFF = "Staff",
  VIEWER = "Viewer",
}

// permissions.ts
export enum Permission {
  /* ===================== TRANSACTIONS ===================== */
  VIEW_TRANSACTIONS = "transactions:view",
  CREATE_TRANSACTIONS = "transactions:create",
  VERIFY_TRANSACTIONS = "transactions:verify",
  SETTLE_TRANSACTIONS = "transactions:settle",
  REFUND_TRANSACTIONS = "transactions:refund",
  FLAG_TRANSACTIONS = "transactions:flag",
  FREEZE_TRANSACTIONS = "transactions:freeze",
  UPDATE_TRANSACTIONS = "transactions:update_status",
  MARK_COMPLETED_TRANSACTIONS = "transactions:mark_completed",

  /* ===================== CUSTOMERS ===================== */
  VIEW_CUSTOMERS = "customers:view",
  MANAGE_CUSTOMERS = "customers:manage",
  MANAGE_KYC = "customers:manage_kyc",
  FLAG_CUSTOMERS = "customers:flag",

  /* ===================== TASKS (NEW) ===================== */
  VIEW_TASKS = "tasks:view",
  CREATE_TASKS = "tasks:create",
  ASSIGN_TASKS = "tasks:assign",
  UPDATE_TASK_STATUS = "tasks:update_status",
  VIEW_TASK_PROGRESS = "tasks:view_progress",
  VIEW_TASK_ANALYTICS = "tasks:view_analytics",
  COMMENT_TASKS = "tasks:comment",
  ATTACH_TASK_DOCUMENTS = "tasks:attach_documents",
  CREATE_COMPLIANCE_TASKS = "tasks:create_compliance",

  /* ===================== AFFILIATE PAYMENTS ===================== */
  VIEW_PAYOUTS_AFFILIATE = "affiliate:view_payouts",
  APPROVE_PAYOUTS_AFFILIATE = "affiliate:approve_payouts",
  HOLD_PAYOUTS_AFFILIATE = "affiliate:hold_payouts",

  /* ===================== FINANCE ===================== */
  VIEW_PAYMENTS = "finance:view_payments",
  APPROVE_PAYMENTS = "finance:approve_payments",
  REJECT_PAYMENTS = "finance:reject_payments",
  FLAG_PAYMENTS = "finance:flag_payments",
  HOLD_PAYMENTS = "finance:hold_payments",
  RELEASE_PAYMENTS = "finance:release_payments",

  /* ===================== RECONCILIATION (NEW) ===================== */
  VIEW_RECONCILIATION = "reconciliation:view",

  /* ===================== DASHBOARD & REPORTS (NEW) ===================== */
  VIEW_DASHBOARD = "dashboard:view",
  VIEW_REPORTS = "reports:view",

  /* ===================== AUDIT (NEW) ===================== */
  VIEW_AUDIT_LOGS = "audit:view_logs",

  /* ===================== KYC (NEW) ===================== */
  VIEW_KYC = "kyc:view",
  APPROVE_KYC = "kyc:approve",
  REJECT_KYC = "kyc:reject",
  FLAG_KYC = "kyc:flag",
  UPLOAD_KYC_DOCUMENTS = "kyc:upload_documents",

  /* ===================== STAFF ===================== */
  VIEW_STAFF_LIST = "staff:view_list",
  ADD_STAFF = "staff:add",
  EDIT_STAFF_ROLES = "staff:edit_roles",

  /* ===================== SYSTEM ===================== */
  VIEW_SYSTEM_SETTINGS = "system:view_settings",
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),

  [Role.MANAGER]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
    Permission.VERIFY_TRANSACTIONS,
    Permission.SETTLE_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_PAYMENTS,
    Permission.APPROVE_PAYMENTS,
    Permission.VIEW_STAFF_LIST,
    Permission.EDIT_STAFF_ROLES,
    Permission.VIEW_SYSTEM_SETTINGS,
  ],

  [Role.FINANCE]: [
    Permission.VIEW_PAYMENTS,
    Permission.APPROVE_PAYMENTS,
    Permission.REJECT_PAYMENTS,
    Permission.HOLD_PAYMENTS,
    Permission.RELEASE_PAYMENTS,
    // Permission.VIEW_SUMMARIES,
  ],

  [Role.OPERATIONS]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
    Permission.VERIFY_TRANSACTIONS,
    // Permission.UPDATE_TRANSACTION_STATUS,
  ],

  [Role.CUSTOMER_REP]: [
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_TRANSACTIONS,
  ],

  [Role.COMPLIANCE]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.VERIFY_TRANSACTIONS,
    Permission.FLAG_TRANSACTIONS,
    Permission.VIEW_KYC,
    // Permission.UPDATE_KYC_STATUS,
  ],

  [Role.STAFF]: [
    Permission.VIEW_TASKS,
    Permission.ASSIGN_TASKS,
    Permission.UPDATE_TASK_STATUS,
  ],

  [Role.VIEWER]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_PAYMENTS,
  ],
};

