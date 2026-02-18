// export type ApiPermission = string;

import { PERMISSION_CATEGORIES } from "./rolePermissions";

export type UiPermission =
  (typeof PERMISSION_CATEGORIES)[keyof typeof PERMISSION_CATEGORIES][number];

export type ApiPermission =
  (typeof API_PERMISSIONS)[keyof typeof API_PERMISSIONS];

export const API_PERMISSIONS = {
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
  customers_addCustomer: "customers:add",

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

  staff_createSuperAdmin: "staff:create_super_admin",
};

export const UI_TO_API_PERMISSION_MAP: Record<UiPermission, string> = {
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
  transactions_refund: "transactions:refund",
  transactions_edit: "transactions:edit",

  // Customers
  customers_viewCustomers: "customers:view",
  customers_manageCustomers: "customers:manage",
  customers_viewAssignedCustomers: "customers:view_assigned",
  customers_editDetails: "customers:edit",
  customers_updateCustomerInfo: "customers:update",
  customers_addCustomer: "customers:add",

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
  finance_adjustBalance: "finance:adjust_balance",

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
  staff_editRoles: "staff:edit_roles",
staff_resetPassword: "staff:reset_password",

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
  tasks_deleteTasks: "tasks:delete",
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
  system_viewSettings: "system:view_settings",

  staff_createSuperAdmin: "",
};
