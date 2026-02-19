import { API_PERMISSIONS, ApiPermission } from "./permissions";


export const ROUTE_PERMISSIONS: Record<string, ApiPermission[]> = {
  "/": [], // Dashboard → accessible if logged in

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

  "/staff": [
    API_PERMISSIONS.staff_viewStaffList,
  ],
} as const;
