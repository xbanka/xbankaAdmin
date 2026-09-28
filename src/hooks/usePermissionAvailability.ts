"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Permission,
  PERMISSION_CATEGORIES,
  Role,
  ROLE_CONFIG,
} from "@/lib/rolePermissions";

// Has no API counterpart in UI_TO_API_PERMISSION_MAP, so granting it would post
// an empty string.
const UNGRANTABLE: Permission[] = ["staff_createSuperAdmin"];

const ALL_PERMISSIONS: Permission[] = Object.values(
  PERMISSION_CATEGORIES,
).flat() as Permission[];

interface UsePermissionAvailabilityOptions {
  onAdd?: (permission: Permission) => void;
  onRemove?: (permission: Permission) => void;
}

/**
 * Owns the set of permissions a role's form is allowed to show. Starts as the
 * role's defaults + optionals and can be widened or narrowed in customise mode,
 * where every remaining permission becomes addable.
 */
export function usePermissionAvailability(
  role: Role | undefined,
  { onAdd, onRemove }: UsePermissionAvailabilityOptions = {},
) {
  const [added, setAdded] = useState<Set<Permission>>(new Set());
  const [removed, setRemoved] = useState<Set<Permission>>(new Set());
  const [isCustomising, setCustomising] = useState(false);

  // Kept in a ref so parents can pass inline closures without re-running effects.
  const callbacks = useRef({ onAdd, onRemove });
  useEffect(() => {
    callbacks.current = { onAdd, onRemove };
  });

  const roleConfig = role ? ROLE_CONFIG[role] : undefined;
  const defaultPerms = useMemo(
    () => roleConfig?.defaultPermissions ?? [],
    [roleConfig],
  );

  const availableSet = useMemo(() => {
    if (!roleConfig) return new Set<Permission>();

    const next = new Set<Permission>([
      ...roleConfig.defaultPermissions,
      ...roleConfig.optionalPermissions,
      ...added,
    ]);
    removed.forEach((permission) => next.delete(permission));
    return next;
  }, [roleConfig, added, removed]);

  // Both lists follow PERMISSION_CATEGORIES order so rows never reshuffle.
  const availablePerms = useMemo(
    () => ALL_PERMISSIONS.filter((permission) => availableSet.has(permission)),
    [availableSet],
  );

  const addablePerms = useMemo(() => {
    if (!roleConfig) return [];
    return ALL_PERMISSIONS.filter(
      (permission) =>
        !availableSet.has(permission) && !UNGRANTABLE.includes(permission),
    );
  }, [roleConfig, availableSet]);

  const addPermission = useCallback((permission: Permission) => {
    setRemoved((prev) => {
      if (!prev.has(permission)) return prev;
      const next = new Set(prev);
      next.delete(permission);
      return next;
    });
    setAdded((prev) => new Set(prev).add(permission));
    callbacks.current.onAdd?.(permission);
  }, []);

  const removePermission = useCallback(
    (permission: Permission) => {
      if (defaultPerms.includes(permission)) return;

      setAdded((prev) => {
        if (!prev.has(permission)) return prev;
        const next = new Set(prev);
        next.delete(permission);
        return next;
      });
      setRemoved((prev) => new Set(prev).add(permission));
      callbacks.current.onRemove?.(permission);
    },
    [defaultPerms],
  );

  const resetAvailability = useCallback((seedExtras: Permission[] = []) => {
    setAdded(new Set(seedExtras));
    setRemoved(new Set());
    setCustomising(false);
  }, []);

  return {
    availablePerms,
    addablePerms,
    defaultPerms,
    isCustomising,
    setCustomising,
    addPermission,
    removePermission,
    resetAvailability,
  };
}
