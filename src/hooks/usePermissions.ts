"use client";

import { useMemo } from "react";
import { useProfile } from "@/lib/services/profile.service";
import {
  hasPermission as checkPermission,
  normalizePermissionsFromApi,
} from "@/lib/rolePermissions";
import type { ApiPermission } from "@/lib/permissions";

export function usePermissions() {
  const { data, isLoading, isError } = useProfile();

  const permissions = data?.data?.role?.allowed_permissions ?? [];
  const permissionSet = useMemo(
    () => normalizePermissionsFromApi(permissions),
    [permissions],
  );

  return {
    permissions,
    hasPermission: (permission: ApiPermission) =>
      checkPermission(permissionSet, permission),
    isLoading,
    isError,
  };
}
