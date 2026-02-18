import { ApiPermission } from "./permissions";

export function canAccessRoute(
  userPermissions: ApiPermission[],
  routePermissions: ApiPermission[]
): boolean {
  if (!routePermissions.length) return true;

  return routePermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}
