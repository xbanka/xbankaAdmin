"use client";
// @ts-nocheck

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import FormField from "../forms/FormField";
import { CheckboxField } from "../ui/CheckboxField";
import { CollapsiblePermissionSection } from "./collapsible-permission-section";
import {
  stepOneFormData,
  StepOneStaffSchema,
  stepTwoFormData,
  StepTwoStaffSchema,
} from "@/lib/schema/add-staff.schema";
import { useInviteStaff } from "@/lib/services/staff.service";
import { InviteStaffDraft } from "@/lib/types/staffTypes";
import {
  ASSIGNABLE_ROLES,
  getRolePermissionDefaults,
  Permission,
  PERMISSION_CATEGORIES,
  Role,
  ROLE_CONFIG,
  UI_TO_API_PERMISSION_MAP,
} from "@/lib/rolePermissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
interface AddStaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStaffSidebar({ isOpen, onClose }: AddStaffSidebarProps) {
  const [step, setStep] = useState(1);
  const [staffData, setStaffData] = useState<InviteStaffDraft>({});
  const { mutate: inviteStaff, isPending } = useInviteStaff();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  // Step 1: Invite Employee
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
    reset: reset1,
  } = useForm<stepOneFormData>({
    resolver: zodResolver(StepOneStaffSchema),
  });

  const roleValue = selectedRole;

  // Step 2: Assign Role & Permissions (combined)
  const {
    control,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    watch: watchStep2,
    reset: reset2,
  } = useForm<stepTwoFormData>({
    resolver: zodResolver(StepTwoStaffSchema),
    defaultValues: roleValue ? getRolePermissionDefaults(roleValue) : {},
    shouldUnregister: false,
  });

  const watchedPermissions = watchStep2();

  const handleClose = () => {
    setStep(1);
    onClose();
    reset1();
    reset2();
  };

  // Compute which permissions are auto-checked, disabled, etc.
  const permissionState = useMemo(() => {
    if (!roleValue)
      return {
        defaultPerms: [] as Permission[],
        optionalPerms: [] as Permission[],
        neverAllowedPerms: [] as Permission[],
        allPermissions: [] as Permission[],
        categoryPerms: {} as Record<string, readonly Permission[]>,
      };

    const roleConfig = ROLE_CONFIG[roleValue];

    const categoryPerms: Record<string, readonly Permission[]> =
      PERMISSION_CATEGORIES;

    return {
      defaultPerms: roleConfig.defaultPermissions,
      optionalPerms: roleConfig.optionalPermissions,
      neverAllowedPerms: roleConfig.neverAllowedPermissions,
      allPermissions: [
        ...roleConfig.defaultPermissions,
        ...roleConfig.optionalPermissions,
      ],
      categoryPerms,
    };
  }, [roleValue]);

  const handleInviteSubmit = (data: stepOneFormData) => {
    setStaffData({
      email: data.email,
    });

    setStep(2);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoleSubmit = (data: any) => {
    if (!staffData.email) {
      throw new Error("Email must exist before submitting role");
    }

    type UiPermissionKey = keyof typeof UI_TO_API_PERMISSION_MAP;
    const selectedPermissions = Object.keys(data).filter(
      (key) => data[key] === true,
    ) as UiPermissionKey[];

    const apiPermissions = selectedPermissions.map(
      (perm) => UI_TO_API_PERMISSION_MAP[perm],
    );

    console.log("Raw data", data);

    const payload = {
      email: staffData.email,
      role: data.role,
      permissions: apiPermissions,
    };
    inviteStaff(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={handleClose} />
      <div className="bg-white w-full max-w-[550px] h-full flex flex-col shadow-lg">
        <div className="p-6 border-b z-50 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Assign Role</h2>
            <span className="text-sm text-gray-600 mb-6">
              We&apos;ll email instructions & a link to create account
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 && (
          <form
            onSubmit={handleSubmitStep1(handleInviteSubmit)}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <FormField
                id="email"
                label="Email address"
                type="email"
                placeholder="Enter work email"
                icon={Mail}
                register={registerStep1}
                error={errorsStep1.email}
              />
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-3">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmitStep2(handleRoleSubmit)}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <SelectFieldLayout
                id="role"
                label="Enter Job Role"
                placeholder="Select job role"
                options={ASSIGNABLE_ROLES}
                value={selectedRole}
                onChange={(value) => {
                  const role = value as Role; // safe: options come from Role enum

                  setSelectedRole(role);
                  setValueStep2("role", role);

                  reset2({
                    role,
                    ...getRolePermissionDefaults(role),
                  });
                }}
              />

              {roleValue && (
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Permissions
                  </h3>
                  {Object.entries(PERMISSION_CATEGORIES).map(
                    ([category, permissions]) => {
                      const allowedPermissions = permissions.filter((perm) =>
                        permissionState.allPermissions.includes(perm),
                      );

                      if (!allowedPermissions.length) return null;

                      return (
                        <CollapsiblePermissionSection
                          key={category}
                          title={category}
                          checkedCount={
                            allowedPermissions.filter(
                              (perm) => watchedPermissions?.[perm] === true,
                            ).length
                          }
                        >
                          <div className="flex gap-[32px] flex-wrap">
                            {allowedPermissions.map((permId) => {
                              const isDefault =
                                permissionState.defaultPerms.includes(permId);
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
                                  isDefault={isDefault} // 👈 THIS fixes everything
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

            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 bg-transparent"
              >
                Back
              </Button>
              <Button
                disabled={!roleValue || isPending}
                type="submit"
                className="flex-3"
              >
                Send Invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
