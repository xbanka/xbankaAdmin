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
  SEO_WRITER: [
    "/content",
    "/tasks",
  ],
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

export type Role = "Admin" | "Manager" | "Finance" | "Operations" | "Compliance" | "Customer Representative" | "Staff" | "Viewer"

export type Permission =
  typeof PERMISSION_CATEGORIES[keyof typeof PERMISSION_CATEGORIES][number];

export const ROLE_CONFIG: Record<Role, {
  defaultPermissions: Permission[]
  optionalPermissions: Permission[]
  neverAllowedPermissions: Permission[]
}> = {
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
      "staff_assignRoles",
      "staff_editPermissions",
      "staff_suspendActivate",
      "audit_viewAuditLogs"
    ],
    optionalPermissions: [
      "kyc_approveKyc",
      "kyc_rejectKyc",
      "tasks_deleteTasks",
      "reports_exportOperational",
      "reconciliation_viewRecords"
    ],
    neverAllowedPermissions: [
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "transactions_settleTransactions",
      "finance_adjustBalances",
      "systemSettings_editSettings",
      "audit_exportAuditLogs",
      "staff_createSuperAdmin",
      "finance_bypassApprovals"
    ]
  },
  Manager: {
    defaultPermissions: [
      "transactions_viewTransactions",
      "customers_viewCustomers",
      "kyc_viewKycStatus",
      "tasks_viewTasks",
      "tasks_assignTasks",
      "tasks_updateTaskStatus",
      "tasks_viewTaskAnalytics"
    ],
    optionalPermissions: [
      "transactions_verifyTransactions",
      "kyc_viewKycDocuments",
      "tasks_commentTasks"
    ],
    neverAllowedPermissions: [
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "transactions_createTransactions",
      "transactions_settleTransactions",
      "staff_manageRoles",
      "staff_editPermissions",
      "finance_viewProfit",
      "systemSettings_editSettings",
      "audit_viewAuditLogs"
    ]
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
      "tasks_commentTasks"
    ],
    optionalPermissions: [
      "finance_retryPayments",
      "finance_reverseSettlements",
      "affiliate_adjustBalances",
      "reports_exportFinance"
    ],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "transactions_settleTransactions",
      "staff_manageRoles",
      "staff_editPermissions",
      "systemSettings_editSettings",
      "records_deleteRecords",
      "audit_bypassLogging"
    ]
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
      "kyc_flagKycReview",
      "tasks_viewTasks",
      "tasks_updateTaskStatus",
      "tasks_commentTasks",
      "tasks_attachDocuments"
    ],
    optionalPermissions: [
      "transactions_mergeTransactions",
      "tasks_createTasks",
      "tasks_editDetails"
    ],
    neverAllowedPermissions: [
      "kyc_approveKyc",
      "kyc_rejectKyc",
      "finance_approvePayments",
      "finance_holdPayments",
      "finance_releasePayments",
      "finance_viewProfit",
      "staff_manageRoles",
      "staff_editPermissions",
      "systemSettings_editSettings",
      "finance_adjustBalances"
    ]
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
      "audit_viewAuditLogs"
    ],
    optionalPermissions: [
      "finance_viewSummaries",
      "transactions_recommendReversal"
    ],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "transactions_settleTransactions",
      "finance_approvePayments",
      "staff_manageRoles",
      "systemSettings_editSettings"
    ]
  },
  "Customer Representative": {
    defaultPermissions: [
      "transactions_createTransactions",
      "transactions_viewAssignedTransactions",
      "customers_viewAssignedCustomers",
      "customers_updateCustomerInfo",
      "kyc_uploadDocuments",
      "kyc_viewKycStatus",
      "tasks_viewAssignedTasks",
      "tasks_updateTaskStatus",
      "tasks_commentTasks"
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
      "staff_assignTasks",
      "staff_manageRoles",
      "systemSettings_editSettings"
    ]
  },
  Staff: {
    defaultPermissions: [
      "tasks_viewAssignedTasks",
      "tasks_updateTaskStatus",
      "transactions_viewLimitedTransactions"
    ],
    optionalPermissions: [
      "tasks_commentTasks"
    ],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "kyc_touchKyc",
      "finance_approvePayments",
      "finance_viewPayments",
      "staff_manageRoles",
      "staff_editPermissions",
      "systemSettings_editSettings"
    ]
  },
  Viewer: {
    defaultPermissions: [
      "dashboards_viewReadOnly",
      "reports_viewReadOnly",
      "tasks_viewBoardReadOnly"
    ],
    optionalPermissions: [
      "reports_exportReadOnly"
    ],
    neverAllowedPermissions: [
      "transactions_createTransactions",
      "transactions_updateStatus",
      "finance_approvePayments",
      "kyc_viewKycDocuments",
      "staff_manageRoles",
      "systemSettings_editSettings"
    ]
  }
}

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
    "transactions_recommendReversal"
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
    "finance_adjustBalances",
    "finance_viewProfit",
    "finance_viewSummaries",
    "finance_bypassApprovals"
  ],

  Affiliate: [
    "affiliate_viewPayouts",
    "affiliate_approvePayouts",
    "affiliate_holdPayouts",
    "affiliate_adjustBalances"
  ],

  Customers: [
    "customers_viewCustomers",
    "customers_manageCustomers",
    "customers_viewAssignedCustomers",
    "customers_updateCustomerInfo",
    "customers_editDetails"
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
    "kyc_flagKycReview",
    "kyc_touchKyc"
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
    "tasks_deleteTasks"
  ],

  "Staff & Access": [
    "staff_viewStaffList",
    "staff_addStaff",
    "staff_assignRoles",
    "staff_assignTasks",
    "staff_editPermissions",
    "staff_manageRoles",
    "staff_suspendActivate",
    "staff_createSuperAdmin"
  ],

  Audit: [
    "audit_viewAuditLogs",
    "audit_exportAuditLogs",
    "audit_bypassLogging"
  ],

  Reports: [
    "reports_viewReadOnly",
    "reports_exportReadOnly",
    "reports_exportOperational",
    "reports_exportFinance"
  ],

  Reconciliation: [
    "reconciliation_viewRecords"
  ],

  Dashboards: [
    "dashboards_viewReadOnly"
  ],

  SystemSettings: [
    "systemSettings_editSettings"
  ],

  Other: [
    "records_deleteRecords"
  ]
} as const;

