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
