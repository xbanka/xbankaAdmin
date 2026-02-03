import { Permission } from "./enum/roles&permission.enum";


export const ROUTE_PERMISSIONS = {
  "/": [], // Dashboard → accessible if logged in

  "/transactions": [
    Permission.VIEW_TRANSACTIONS,
  ],

  "/customer-management": [
    Permission.VIEW_CUSTOMERS,
  ],

  "/customer-support": [
    Permission.VIEW_CUSTOMERS,
  ],

  "/finance": [
    Permission.VIEW_PAYMENTS,
  ],

  "/staff": [
    Permission.VIEW_STAFF_LIST,
  ],
} as const;
