"use client";

import { useEffect } from "react";
import { X, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { usePermissionAvailability } from "@/hooks/usePermissionAvailability";
import { StaffMember } from "@/lib/types/staffTypes";
import {
  API_TO_UI_PERMISSION_MAP,
  Permission,
  ROLE_CONFIG,
  Role,
  UI_TO_API_PERMISSION_MAP,
} from "@/lib/rolePermissions";
import { useUpdateStaffPermissions } from "@/lib/services/staff.service";
import {
  CustomisePermissionsToggle,
  PermissionsFieldset,
} from "./permissions-fieldset";

interface EditPermissionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

export function EditPermissionsSidebar({
  isOpen,
  onClose,
  staff,
}: EditPermissionsSidebarProps) {
  const { mutate: updatePermissions, isPending } = useUpdateStaffPermissions();

  const { control, handleSubmit, watch, reset, setValue } = useForm<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>
  >({
    defaultValues: {},
    shouldUnregister: false,
  });

  const watchedPermissions = watch();
  const role = staff?.role?.name as Role | undefined;

  const {
    availablePerms,
    addablePerms,
    defaultPerms,
    isCustomising,
    setCustomising,
    addPermission,
    removePermission,
    resetAvailability,
  } = usePermissionAvailability(role, {
    onAdd: (permission) => setValue(permission, false, { shouldDirty: true }),
    onRemove: (permission) => setValue(permission, false, { shouldDirty: true }),
  });

  /**
   * Populate the form from the staff member's current permissions.
   * Role is fixed — this sidebar only ever edits permissions.
   */
  useEffect(() => {
    if (!staff || !isOpen) return;

    const existingPermissions = staff.role?.allowed_permissions ?? [];
    const permissionValues: Record<string, boolean> = {};

    Object.keys(UI_TO_API_PERMISSION_MAP).forEach((uiPermission) => {
      const apiPermission =
        UI_TO_API_PERMISSION_MAP[
          uiPermission as keyof typeof UI_TO_API_PERMISSION_MAP
        ];
      permissionValues[uiPermission] = existingPermissions.includes(apiPermission);
    });

    reset(permissionValues);

    // Permissions already granted that this role's config doesn't cover would
    // otherwise be invisible here yet still resubmitted on save.
    const roleConfig = role ? ROLE_CONFIG[role] : undefined;
    const covered = new Set<Permission>([
      ...(roleConfig?.defaultPermissions ?? []),
      ...(roleConfig?.optionalPermissions ?? []),
    ]);
    const seedExtras = existingPermissions
      .map((apiPermission) => API_TO_UI_PERMISSION_MAP[apiPermission])
      .filter(
        (permission): permission is Permission =>
          !!permission && !covered.has(permission),
      );

    resetAvailability(seedExtras);
  }, [staff, isOpen, reset, role, resetAvailability]);

  const handleClose = () => {
    reset({});
    onClose();
  };

  const handleSubmitForm = (data: Record<string, boolean>) => {
    if (!staff) return;

    const selectedPermissions = Object.keys(data).filter(
      (key) => data[key] === true,
    );
    const apiPermissions = selectedPermissions.map(
      (permission) =>
        UI_TO_API_PERMISSION_MAP[
          permission as keyof typeof UI_TO_API_PERMISSION_MAP
        ],
    );

    updatePermissions(
      { staffId: staff.id, payload: { permissions: apiPermissions } },
      { onSuccess: handleClose },
    );
  };

  useBodyScrollLock(isOpen);

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={handleClose} />

      {/* Sidebar */}
      <div className="bg-white w-full max-w-[550px] h-full flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-text-primary-font-color">
              Edit Permissions
            </h2>
            <p className="text-sm text-secondary-text mt-1">
              Update this staff member&apos;s ERP access without changing their role.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-secondary-text hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Staff summary */}
          <div className="rounded-lg bg-card-secondary p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold text-purple-700 shrink-0">
              {staff.first_name?.charAt(0).toUpperCase()}
              {staff.last_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary-font-color">
                {staff.first_name} {staff.last_name}
              </p>
              <p className="text-sm text-secondary-text">{staff.email}</p>
            </div>
          </div>

          {/* Locked role */}
          <div>
            <label className="text-sm font-medium text-text-primary-font-color mb-1.5 flex items-center gap-1.5">
              Role
            </label>
            <div className="flex items-center justify-between px-3 py-2 rounded-md border border-input bg-grey-light text-secondary-text text-sm">
              {role}
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {/* Permissions — same fieldset as step 2 of the role wizard */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary-font-color">
              Permissions
            </h3>

            <PermissionsFieldset
              control={control}
              watchedPermissions={watchedPermissions}
              allPermissions={availablePerms}
              defaultPerms={defaultPerms}
              isCustomising={isCustomising}
              addablePerms={addablePerms}
              onAddPermission={addPermission}
              onRemovePermission={removePermission}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border flex-shrink-0">
          <div className="px-6 pt-4">
            <CustomisePermissionsToggle
              isCustomising={isCustomising}
              onToggle={setCustomising}
            />
          </div>
          <div className="flex gap-3 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isPending}
              onClick={handleSubmit(handleSubmitForm)}
              className="flex-[3]"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
