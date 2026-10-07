"use client";

import { Minus, Plus, SlidersHorizontal } from "lucide-react";
import { CheckboxField } from "../ui/CheckboxField";
import { CollapsiblePermissionSection } from "./collapsible-permission-section";
import { Permission, PERMISSION_CATEGORIES } from "@/lib/rolePermissions";

export function getPermissionLabel(permId: string) {
  const rawLabel =
    permId
      .split("_")[1]
      ?.replace(/([A-Z])/g, " $1")
      .trim() ?? permId;
  return rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
}

export function CustomisePermissionsToggle({
  isCustomising,
  onToggle,
}: {
  isCustomising: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!isCustomising)}
      className="flex items-center gap-1.5 text-sm font-medium text-text-teal"
    >
      <SlidersHorizontal className="w-4 h-4" />
      {isCustomising ? "Done customising" : "Customise permissions"}
    </button>
  );
}

const affordanceClass =
  "h-5 w-5 shrink-0 rounded border border-[#E9EBEE] flex items-center justify-center text-secondary-text transition-colors";

interface PermissionsFieldsetProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watchedPermissions: Record<string, any>;
  allPermissions: Permission[];
  defaultPerms: Permission[];
  isCustomising?: boolean;
  addablePerms?: Permission[];
  onAddPermission?: (permission: Permission) => void;
  onRemovePermission?: (permission: Permission) => void;
}

/**
 * The permission checkbox grid shared by the invite flow, the standalone "Edit
 * Permissions" sidebar and step 2 of the "Edit Roles & Permissions" wizard.
 *
 * In customise mode every permission outside the role's set becomes addable via
 * a plus, and non-default permissions already in the set can be dropped via a
 * minus. Callers own that state — see usePermissionAvailability.
 */
export function PermissionsFieldset({
  control,
  watchedPermissions,
  allPermissions,
  defaultPerms,
  isCustomising = false,
  addablePerms = [],
  onAddPermission,
  onRemovePermission,
}: PermissionsFieldsetProps) {
  return (
    <div className="space-y-3">
      {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => {
        const allowedPermissions = permissions.filter((permission) =>
          allPermissions.includes(permission),
        );
        const addablePermissions = isCustomising
          ? permissions.filter((permission) =>
              addablePerms.includes(permission),
            )
          : [];

        if (!allowedPermissions.length && !addablePermissions.length)
          return null;

        return (
          <CollapsiblePermissionSection
            key={category}
            title={category}
            checkedCount={
              allowedPermissions.filter(
                (permission) => watchedPermissions?.[permission] === true,
              ).length
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              {allowedPermissions.map((permId) => (
                <div key={permId} className="flex items-center gap-1.5">
                  <CheckboxField
                    id={permId}
                    label={getPermissionLabel(permId)}
                    control={control}
                    isDefault={defaultPerms.includes(permId)}
                  />
                  {isCustomising && !defaultPerms.includes(permId) && (
                    <button
                      type="button"
                      aria-label={`Remove ${getPermissionLabel(permId)}`}
                      onClick={() => onRemovePermission?.(permId)}
                      className={`${affordanceClass} hover:border-error-text hover:text-error-text`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {addablePermissions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-dashed border-[#E9EBEE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {addablePermissions.map((permId) => (
                  <div key={permId} className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Add ${getPermissionLabel(permId)}`}
                      onClick={() => onAddPermission?.(permId)}
                      className={`${affordanceClass} hover:border-text-teal hover:text-text-teal`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="font-normal text-[12px] text-text-secondary">
                      {getPermissionLabel(permId)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CollapsiblePermissionSection>
        );
      })}
    </div>
  );
}
