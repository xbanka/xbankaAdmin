"use client";
// @ts-nocheck

import { useEffect, useMemo, useState } from "react";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "@/components/forms/SelectFieldLayout";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { CollapsiblePermissionSection } from "@/components/staff/collapsible-permission-section";
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
import { useUpdateStaffRolesPermissions } from "@/lib/services/staff.service";
import { StaffMember } from "@/lib/types/staffTypes";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { RoleChangeBadge } from "../ui/role-change-badge";

interface EditRolesPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

type Step = "details" | "permissions" | "review";

function getPermissionLabel(permId: string) {
  const rawLabel =
    permId
      .split("_")[1]
      ?.replace(/([A-Z])/g, " $1")
      .trim() ?? permId;
  return rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
}

function joinWithAmpersand(labels: string[]) {
  if (labels.length === 0) return "No access";
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]}`;
}

export function EditRolesPermissionsModal({
  isOpen,
  onClose,
  staff,
}: EditRolesPermissionsModalProps) {
  const { mutate: updateStaff, isPending } = useUpdateStaffRolesPermissions();

  const [step, setStep] = useState<Step>("details");
  const [newRole, setNewRole] = useState<Role | undefined>();
  const [reason, setReason] = useState("");

  const currentRole = staff?.role?.name as Role | undefined;

  const { control, handleSubmit, watch, reset } = useForm<Record<string, any>>({
    defaultValues: {},
    shouldUnregister: false,
  });

  const watchedPermissions = watch();

  const roleOptions =
    currentRole && !ASSIGNABLE_ROLES.includes(currentRole)
      ? [currentRole, ...ASSIGNABLE_ROLES]
      : ASSIGNABLE_ROLES;

  // Reset everything whenever a new staff member is opened
  useEffect(() => {
    if (!staff || !isOpen) return;
    setStep("details");
    setNewRole(undefined);
    setReason("");
    reset({});
  }, [staff, isOpen, reset]);

  const handleClose = () => {
    setStep("details");
    setNewRole(undefined);
    setReason("");
    reset({});
    onClose();
  };

  // Permission set available for whichever role is selected as "New Role"
  const permissionState = useMemo(() => {
    if (!newRole) {
      return {
        allPermissions: [] as Permission[],
        defaultPerms: [] as Permission[],
        neverAllowedPerms: [] as Permission[],
      };
    }
    const roleConfig = ROLE_CONFIG[newRole];
    return {
      allPermissions: [
        ...roleConfig.defaultPermissions,
        ...roleConfig.optionalPermissions,
      ],
      defaultPerms: roleConfig.defaultPermissions,
      neverAllowedPerms: roleConfig.neverAllowedPermissions,
    };
  }, [newRole]);

  // Rough "permission impact" count shown on step 1, comparing role defaults
  const permissionImpact = useMemo(() => {
    if (!currentRole || !newRole) return { added: 0, removed: 0 };
    const currentPerms = new Set(
      ROLE_CONFIG[currentRole]?.defaultPermissions ?? [],
    );
    const nextPerms = new Set(ROLE_CONFIG[newRole]?.defaultPermissions ?? []);

    const added = [...nextPerms].filter((p) => !currentPerms.has(p)).length;
    const removed = [...currentPerms].filter((p) => !nextPerms.has(p)).length;

    return { added, removed };
  }, [currentRole, newRole]);

  const handleRoleSelect = (value: string) => {
    const role = value as Role;
    setNewRole(role);
    reset(getRolePermissionDefaults(role));
  };

  const goToPermissions = () => {
    if (!newRole) return;
    setStep("permissions");
  };

  const goToReview = () => {
    setStep("review");
  };

  const handleConfirm = (data: Record<string, any>) => {
    if (!staff || !newRole) return;

    const selectedPermissions = Object.keys(data).filter(
      (key) => data[key] === true,
    );
    const apiPermissions = selectedPermissions.map(
      (permission) =>
        UI_TO_API_PERMISSION_MAP[
          permission as keyof typeof UI_TO_API_PERMISSION_MAP
        ],
    );

    updateStaff(
      {
        staffId: staff.id,
        payload: { role: newRole, permissions: apiPermissions },
      },
      { onSuccess: handleClose },
    );
  };

  // Category -> human access summary, used on the review step
  const buildAccessSummary = (
    categoryPermissions: readonly Permission[],
    selected: Record<string, any>,
  ) => {
    const selectedLabels = categoryPermissions
      .filter((p) => selected?.[p] === true)
      .map(getPermissionLabel);
    return joinWithAmpersand(selectedLabels);
  };

  const previousSelection = useMemo(
    () => (currentRole ? getRolePermissionDefaults(currentRole) : {}),
    [currentRole],
  );

  const accessWillIncrease =
    currentRole && newRole
      ? (ROLE_CONFIG[newRole]?.defaultPermissions.length ?? 0) >
        (ROLE_CONFIG[currentRole]?.defaultPermissions.length ?? 0)
      : false;

  useBodyScrollLock(isOpen);

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={handleClose} />

      {/* Sidebar */}
      <div className="relative bg-white w-full max-w-[550px] h-full flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-text-primary-font-color">
              Edit Roles & Permissions
            </h2>
            <p className="text-sm text-secondary-text mt-1">
              Update this staff member&apos;s role and manage their ERP access.
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
          {/* Staff summary card - shown on details + review steps */}
          {(step === "details" || step === "review") && (
            <div className="rounded-lg bg-card-secondary p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold text-purple-700 shrink-0">
                {staff.first_name?.charAt(0).toUpperCase()}
                {staff.last_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-secondary-text">Name</p>
                  <p className="font-medium text-text-primary-font-color">
                    {staff.first_name} {staff.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-text">Staff ID</p>
                  <p className="font-medium text-text-primary-font-color">
                    {staff.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-text">Current Role</p>
                  <p className="font-medium text-text-primary-font-color">
                    {currentRole}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: details */}
          {step === "details" && (
            <>
              <div>
                <label className="text-sm font-medium text-text-primary-font-color mb-1.5 flex items-center gap-1.5">
                  Current Role
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-input bg-grey-light text-secondary-text text-sm">
                  {currentRole}
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              <SelectFieldLayout
                id="newRole"
                label="New Role"
                placeholder="Select new role"
                options={roleOptions}
                value={newRole}
                onChange={handleRoleSelect}
              />

              <div>
                <label
                  htmlFor="reason"
                  className="text-sm font-medium text-text-primary-font-color mb-1.5 block"
                >
                  Reason for change
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for change..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input focus:outline-none focus:border-input-border-focus resize-none"
                />
              </div>

              {newRole && (
                <div>
                  <p className="text-sm font-medium text-text-primary-font-color mb-1.5">
                    Permission Impact
                  </p>
                  <div className="rounded-md border border-border p-3 text-sm space-y-1">
                    <p className="text-success-text">
                      +{permissionImpact.added} permissions added
                    </p>
                    <p className="text-secondary-text">
                      {permissionImpact.removed} permissions removed
                    </p>
                    <button
                      type="button"
                      onClick={goToPermissions}
                      className="text-text-teal font-medium mt-1"
                    >
                      View Permission change
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: set permissions */}
          {step === "permissions" && newRole && (
            <>
              <SelectFieldLayout
                id="newRoleStep2"
                label="New Role"
                placeholder="Select new role"
                options={roleOptions}
                value={newRole}
                onChange={handleRoleSelect}
              />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary-font-color">
                  Set Permissions
                </h3>

                {Object.entries(PERMISSION_CATEGORIES).map(
                  ([category, permissions]) => {
                    const allowedPermissions = permissions.filter(
                      (permission) =>
                        permissionState.allPermissions.includes(permission),
                    );

                    if (!allowedPermissions.length) return null;

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
                        <div className="flex gap-8 flex-wrap">
                          {allowedPermissions.map((permId) => (
                            <CheckboxField
                              key={permId}
                              id={permId}
                              label={getPermissionLabel(permId)}
                              control={control}
                              disabled={permissionState.neverAllowedPerms.includes(
                                permId,
                              )}
                              isDefault={permissionState.defaultPerms.includes(
                                permId,
                              )}
                            />
                          ))}
                        </div>
                      </CollapsiblePermissionSection>
                    );
                  },
                )}
              </div>
            </>
          )}

          {/* STEP 3: review changes */}
          {step === "review" && newRole && (
            <>
              <div>
                <p className="text-sm font-medium text-text-primary-font-color mb-1.5">
                  Role Change
                </p>
                <RoleChangeBadge from={currentRole ?? ""} to={newRole} boxed />
              </div>

              <div>
                <p className="text-sm font-medium text-text-primary-font-color mb-2">
                  Permission Change
                </p>
                <div className="rounded-md border border-border overflow-hidden">
                  <div className="grid grid-cols-3 bg-card-secondary text-xs font-medium text-secondary-text px-4 py-2">
                    <span>Permission</span>
                    <span>Previous access</span>
                    <span>New access</span>
                  </div>
                  {Object.entries(PERMISSION_CATEGORIES).map(
                    ([category, permissions]) => (
                      <div
                        key={category}
                        className="grid grid-cols-3 px-4 py-3 text-sm border-t border-border"
                      >
                        <span className="text-text-primary-font-color">
                          {category}
                        </span>
                        <span className="text-secondary-text">
                          {buildAccessSummary(permissions, previousSelection)}
                        </span>
                        <span className="text-text-primary-font-color font-medium">
                          {buildAccessSummary(permissions, watchedPermissions)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div
                className={
                  accessWillIncrease
                    ? "rounded-md bg-warning-light border border-warning-text/20 p-3 text-sm"
                    : "rounded-md bg-grey-light border border-border p-3 text-sm"
                }
              >
                <p className="font-medium text-warning-text">
                  {accessWillIncrease
                    ? "Access level will increase"
                    : "Access level will change"}
                </p>
                <p className="text-secondary-text mt-0.5">
                  {staff.first_name} will have access to{" "}
                  {accessWillIncrease ? "additional" : "different"}{" "}
                  administrative features based on the {newRole} role.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={
              step === "details" ? handleClose : () => setStep("details")
            }
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>

          {step === "details" && (
            <Button
              type="button"
              disabled={!newRole}
              onClick={goToPermissions}
              className="flex-[3]"
            >
              Set Permission
            </Button>
          )}

          {step === "permissions" && (
            <Button type="button" onClick={goToReview} className="flex-[3]">
              Review Changes
            </Button>
          )}

          {step === "review" && (
            <Button
              type="button"
              disabled={isPending}
              onClick={handleSubmit(handleConfirm)}
              className="flex-[3]"
            >
              {isPending ? "Saving..." : "Confirm Changes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
