import { Permission } from "./enum/roles&permission.enum";


export function canAccessRoute(
  userPermissions: Permission[],
  routePermissions: readonly Permission[]
) {
  // Dashboard or public route
  if (routePermissions?.length === 0) return true;

  return routePermissions?.some((p) => userPermissions.includes(p));
}
