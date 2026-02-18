import { ApiPermission } from "./permissions";

import { API_PERMISSIONS } from "./permissions";
import { Role } from "./rolePermissions";

export const ROLE_DEFAULTS: Record<Role, string[]> = {
  [Role.Super_ADMIN]: Object.values(API_PERMISSIONS),
  [Role.ADMIN]: [
    // Transactions
    API_PERMISSIONS.transactions_viewTransactions,
    API_PERMISSIONS.transactions_verifyTransactions,

    // Customers
    API_PERMISSIONS.customers_viewCustomers,
    API_PERMISSIONS.customers_editDetails,

    // KYC
    API_PERMISSIONS.kyc_viewKycData,
    API_PERMISSIONS.kyc_updateKycStatus,

    // Tasks
    API_PERMISSIONS.tasks_viewTasks,
    API_PERMISSIONS.tasks_createTasks,
    API_PERMISSIONS.tasks_assignTasks,
    API_PERMISSIONS.tasks_updateTaskStatus,
    API_PERMISSIONS.tasks_viewTaskProgress,

    // Staff
    API_PERMISSIONS.staff_viewStaffList,
    API_PERMISSIONS.staff_addStaff,
    API_PERMISSIONS.staff_editPermissions,
    API_PERMISSIONS.staff_suspendActivate,

    // Audit
    API_PERMISSIONS.audit_viewAuditLogs,
  ],

  [Role.MANAGER]: [
    API_PERMISSIONS.transactions_viewTransactions,

    API_PERMISSIONS.customers_viewCustomers,

    API_PERMISSIONS.kyc_viewKycStatus,

    API_PERMISSIONS.tasks_viewTasks,
    API_PERMISSIONS.tasks_assignTasks,
    API_PERMISSIONS.tasks_updateTaskStatus,
    API_PERMISSIONS.tasks_viewTaskAnalytics,
  ],

  [Role.FINANCE]: [
    API_PERMISSIONS.transactions_viewTransactions,

    API_PERMISSIONS.finance_viewPayments,
    API_PERMISSIONS.finance_approvePayments,
    API_PERMISSIONS.finance_rejectPayments,
    API_PERMISSIONS.finance_holdPayments,
    API_PERMISSIONS.finance_releasePayments,
    API_PERMISSIONS.finance_flagPayments,

    API_PERMISSIONS.affiliate_viewPayouts,
    API_PERMISSIONS.affiliate_approvePayouts,
    API_PERMISSIONS.affiliate_holdPayouts,

    API_PERMISSIONS.reconciliation_viewRecords,

    API_PERMISSIONS.kyc_viewKycStatus,

    API_PERMISSIONS.tasks_viewTasks,
    API_PERMISSIONS.tasks_commentTasks,
  ],

  [Role.OPERATIONS]: [
    API_PERMISSIONS.transactions_createTransactions,
    API_PERMISSIONS.transactions_updateStatus,
    API_PERMISSIONS.transactions_executeSettlements,
    API_PERMISSIONS.transactions_markCompleted,

    API_PERMISSIONS.customers_viewCustomers,

    API_PERMISSIONS.kyc_viewKycData,
    API_PERMISSIONS.kyc_uploadDocuments,
    API_PERMISSIONS.kyc_flagKyc,

    API_PERMISSIONS.tasks_viewTasks,
    API_PERMISSIONS.tasks_updateTaskStatus,
    API_PERMISSIONS.tasks_commentTasks,
    API_PERMISSIONS.tasks_attachDocuments,
  ],

  [Role.COMPLIANCE]: [
    API_PERMISSIONS.transactions_viewTransactions,
    API_PERMISSIONS.transactions_flagTransactions,
    API_PERMISSIONS.transactions_freezeTransactions,

    API_PERMISSIONS.kyc_viewKycData,
    API_PERMISSIONS.kyc_approveKyc,
    API_PERMISSIONS.kyc_rejectKyc,
    API_PERMISSIONS.kyc_flagKyc,

    API_PERMISSIONS.tasks_viewTasks,
    API_PERMISSIONS.tasks_commentTasks,
    API_PERMISSIONS.tasks_createComplianceTasks,

    API_PERMISSIONS.audit_viewAuditLogs,
  ],

  [Role.CUSTOMER_REP]: [
    API_PERMISSIONS.transactions_createTransactions,
    API_PERMISSIONS.transactions_viewAssignedTransactions,

    API_PERMISSIONS.customers_viewAssignedCustomers,
    API_PERMISSIONS.customers_updateCustomerInfo,

    API_PERMISSIONS.kyc_uploadDocuments,
    API_PERMISSIONS.kyc_viewKycStatus,

    API_PERMISSIONS.tasks_viewAssignedTasks,
    API_PERMISSIONS.tasks_updateTaskStatus,
    API_PERMISSIONS.tasks_commentTasks,
  ],

  [Role.STAFF]: [
    API_PERMISSIONS.tasks_viewAssignedTasks,
    API_PERMISSIONS.tasks_updateTaskStatus,

    API_PERMISSIONS.transactions_viewLimitedTransactions,
  ],

  [Role.VIEWER]: [
    API_PERMISSIONS.dashboards_viewReadOnly,
    API_PERMISSIONS.reports_viewReadOnly,
    API_PERMISSIONS.tasks_viewBoardReadOnly,
  ],
};
