import { API_PERMISSIONS, ApiPermission } from "./permissions";


export const ROUTE_PERMISSIONS: Record<string, ApiPermission[]> = {
  "/": [], // Dashboard → accessible if logged in (reverted: not every role has been granted dashboard:view yet, and blocking "/" itself causes an unrecoverable redirect loop in AuthGuard)

  "/transactions": [
    API_PERMISSIONS.transactions_viewTransactions,
  ],

  "/customer-management": [
    API_PERMISSIONS.customers_viewCustomers,
  ],

  "/customer-support": [
    API_PERMISSIONS.customers_viewCustomers,
  ],

  "/finance": [
    API_PERMISSIONS.finance_viewPayments,
  ],

  "/rate-management": [], // accessible to everyone, intentionally

  "/staff": [
    API_PERMISSIONS.staff_viewStaffList,
  ],

  "/settings": [], // Own account settings — every signed-in staff member manages their own profile
} as const;
