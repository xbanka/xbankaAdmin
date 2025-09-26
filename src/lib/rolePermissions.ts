// rolePermissions.ts
export const rolePermissions = {
  SUPER_ADMIN: [
    "/dashboard",
    "/dashboard/customerManagement",
    "/dashboard/transactions",
    "/dashboard/support",
    "/dashboard/refunds",
    "/dashboard/content",
    "/dashboard/tasks",
    "/dashboard/audit",
    "/dashboard/inventory",
    "/dashboard/admin",
  ],
  CUSTOMER_SUPPORT: [
    "/dashboard",
    "/dashboard/customerManagement",
    "/dashboard/transactions",
    "/dashboard/admin",
  ],
  SEO_WRITER: [
    "/dashboard/content",
    "/dashboard/tasks",
  ],
  ADMIN: [
    "/dashboard",
    "/dashboard/customerManagement",
    "/dashboard/transactions",
    "/dashboard/support",
    "/dashboard/refunds",
    "/dashboard/content",
    "/dashboard/tasks",
    "/dashboard/audit",
    "/dashboard/inventory",
    // ❌ no admin panel
  ],
} as const;
