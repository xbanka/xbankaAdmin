// roles.ts
export enum Role {
  ADMIN = "Admin",
  MANAGER = "Manager",
  OPERATIONS = "Operations",
  CUSTOMER_REP = "Customer Rep",
  COMPLIANCE = "Compliance",
  VIEWER = "Viewer",
}

// permissions.ts
export enum Permission {
  VIEW_TRANSACTIONS = "transactions:view",
  CREATE_TRANSACTIONS = "transactions:create",
  VERIFY_TRANSACTIONS = "transactions:verify",
  SETTLE_TRANSACTIONS = "transactions:settle",
  REFUND_TRANSACTIONS = "transactions:refund",

  VIEW_CUSTOMERS = "customers:view",
  MANAGE_CUSTOMERS = "customers:manage",
  MANAGE_KYC = "customers:manage_kyc",
  FLAG_CUSTOMERS = "customers:flag",

  VIEW_PAYMENTS = "finance:view_payments",
  APPROVE_PAYMENTS = "finance:approve_payments",
  REJECT_PAYMENTS = "finance:reject_payments",
  FLAG_PAYMENTS = "finance:flag_payments",

  VIEW_STAFF_LIST = "staff:view_list",
  ADD_STAFF = "staff:add",
  EDIT_STAFF_ROLES = "staff:edit_roles",

  VIEW_SYSTEM_SETTINGS = "system:view_settings",
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // full access

  [Role.MANAGER]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
    Permission.VERIFY_TRANSACTIONS,
    Permission.SETTLE_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.MANAGE_KYC,
    Permission.VIEW_PAYMENTS,
    Permission.APPROVE_PAYMENTS,
    Permission.VIEW_STAFF_LIST,
    Permission.ADD_STAFF,
    Permission.EDIT_STAFF_ROLES,
    Permission.VIEW_SYSTEM_SETTINGS,
  ],

  [Role.OPERATIONS]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.CREATE_TRANSACTIONS,
    Permission.VERIFY_TRANSACTIONS,
    Permission.REFUND_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_KYC,
    Permission.VIEW_PAYMENTS,
  ],

  [Role.CUSTOMER_REP]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.MANAGE_KYC,
  ],

  [Role.COMPLIANCE]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.VERIFY_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.FLAG_CUSTOMERS,
    Permission.VIEW_PAYMENTS,
    Permission.FLAG_PAYMENTS,
  ],

  [Role.VIEWER]: [
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_STAFF_LIST,
  ],
}
