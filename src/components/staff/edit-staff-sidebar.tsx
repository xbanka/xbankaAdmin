"use client";
// @ts-nocheck

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import { CheckboxField } from "../ui/CheckboxField";
import { CollapsiblePermissionSection } from "./collapsible-permission-section";
import { useForm } from "react-hook-form";
import {
  ASSIGNABLE_ROLES,
  getRolePermissionDefaults,
  Permission,
  PERMISSION_CATEGORIES,
  Role,
  ROLE_CONFIG,
  UI_TO_API_PERMISSION_MAP,
} from "@/lib/rolePermissions";
import {
  useUpdateStaffRolesPermissions,
} from "@/lib/services/staff.service";
import { StaffMember } from "@/lib/types/staffTypes";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface EditStaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

interface EditStaffFormData {
  [key: string]: any;
}

export function EditStaffSidebar({
  isOpen,
  onClose,
  staff,
}: EditStaffSidebarProps) {
  const { mutate: updateStaff, isPending } =
    useUpdateStaffRolesPermissions();

  const {
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<EditStaffFormData>({
    defaultValues: {},
    shouldUnregister: false,
  });

  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const watchedPermissions = watch();

  // Super Admin (and any other role outside the assignable set) isn't
  // selectable going forward, but if that's the staff member's current
  // role it still needs to show up so the dropdown isn't left empty.
  const roleOptions =
    selectedRole && !ASSIGNABLE_ROLES.includes(selectedRole)
      ? [selectedRole, ...ASSIGNABLE_ROLES]
      : ASSIGNABLE_ROLES;

  /**
   * Populate the form whenever the selected staff changes.
   */
  useEffect(() => {
    if (!staff || !isOpen) return;

    const roleName = staff.role?.name as Role;

    const existingPermissions = staff.role?.allowed_permissions ?? [];

    const permissionValues: Record<string, boolean> = {};

    Object.keys(UI_TO_API_PERMISSION_MAP).forEach((uiPermission) => {
      const apiPermission =
        UI_TO_API_PERMISSION_MAP[
          uiPermission as keyof typeof UI_TO_API_PERMISSION_MAP
        ];

      permissionValues[uiPermission] =
        existingPermissions.includes(apiPermission);
    });

    setSelectedRole(roleName);
    reset(permissionValues);
  }, [staff, isOpen, reset]);

  const handleClose = () => {
    setSelectedRole(undefined);
    reset({});
    onClose();
  };

  /**
   * Calculate which permissions can be displayed
   * for the currently selected role.
   */
  const permissionState = useMemo(() => {
    if (!selectedRole) {
      return {
        defaultPerms: [] as Permission[],
        optionalPerms: [] as Permission[],
        neverAllowedPerms: [] as Permission[],
        allPermissions: [] as Permission[],
        categoryPerms: {} as Record<string, readonly Permission[]>,
      };
    }

    const roleConfig = ROLE_CONFIG[selectedRole];

    return {
      defaultPerms: roleConfig.defaultPermissions,
      optionalPerms: roleConfig.optionalPermissions,
      neverAllowedPerms: roleConfig.neverAllowedPermissions,
      allPermissions: [
        ...roleConfig.defaultPermissions,
        ...roleConfig.optionalPermissions,
      ],
      categoryPerms: PERMISSION_CATEGORIES,
    };
  }, [selectedRole]);

  /**
   * When the role changes, reset permissions
   * according to that role's defaults.
   */
  const handleRoleChange = (value: string) => {
    const role = value as Role;

    setSelectedRole(role);
    reset(getRolePermissionDefaults(role));
  };

  const handleSubmitForm = (data: EditStaffFormData) => {
    if (!staff || !selectedRole) return;

    type UiPermissionKey = keyof typeof UI_TO_API_PERMISSION_MAP;

    const selectedPermissions = Object.keys(data).filter(
      (key) => data[key] === true,
    ) as UiPermissionKey[];

    const apiPermissions = selectedPermissions.map(
      (permission) => UI_TO_API_PERMISSION_MAP[permission],
    );

    const payload = {
      role: selectedRole,
      permissions: apiPermissions,
    };

    updateStaff(
      {
        staffId: staff.id,
        payload,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  useBodyScrollLock(isOpen);

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/50"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="bg-white w-full max-w-[550px] h-full flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b z-50 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Staff Role
            </h2>

            <span className="text-sm text-gray-600">
              Update this staff member&apos;s role and permissions
            </span>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/*
          Not a <form>: nesting the role <Select> inside a <form> makes
          Radix render a hidden native <select> mirror for form
          compatibility. That mirror re-syncs on every value change, and
          since the role is pre-filled programmatically the instant this
          sidebar opens (before the matching <option> finishes
          registering), the native sync reads back an empty value and
          immediately clears the role we just set. handleSubmit works
          the same without a real <form> element.
        */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Staff information */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold text-purple-700">
                  {staff.first_name?.charAt(0).toUpperCase()}
                  {staff.last_name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {staff.first_name} {staff.last_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {staff.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <SelectFieldLayout
              id="role"
              label="Job Role"
              placeholder="Select job role"
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleChange}
            />

            {/* Permissions */}
            {selectedRole && (
              <div className="mt-6 pt-6 border-t space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Permissions
                </h3>

                {Object.entries(PERMISSION_CATEGORIES).map(
                  ([category, permissions]) => {
                    const allowedPermissions = permissions.filter(
                      (permission) =>
                        permissionState.allPermissions.includes(
                          permission,
                        ),
                    );

                    if (!allowedPermissions.length) {
                      return null;
                    }

                    return (
                      <CollapsiblePermissionSection
                        key={category}
                        title={category}
                        checkedCount={
                          allowedPermissions.filter(
                            (permission) =>
                              watchedPermissions?.[permission] === true,
                          ).length
                        }
                      >
                        <div className="flex gap-[32px] flex-wrap">
                          {allowedPermissions.map((permId) => {
                            const isDefault =
                              permissionState.defaultPerms.includes(
                                permId,
                              );

                            const isNeverAllowed =
                              permissionState.neverAllowedPerms.includes(
                                permId,
                              );

                            const rawLabel =
                              permId
                                .split("_")[1]
                                ?.replace(/([A-Z])/g, " $1")
                                .trim() ?? permId;

                            const label =
                              rawLabel.charAt(0).toUpperCase() +
                              rawLabel.slice(1);

                            return (
                              <CheckboxField
                                key={permId}
                                id={permId}
                                label={label}
                                control={control}
                                disabled={isNeverAllowed}
                                isDefault={isDefault}
                              />
                            );
                          })}
                        </div>
                      </CollapsiblePermissionSection>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>

            <Button
              disabled={!selectedRole || isPending}
              type="button"
              onClick={handleSubmit(handleSubmitForm)}
              className="flex-3"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}