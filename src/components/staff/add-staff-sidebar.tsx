"use client";
// @ts-nocheck

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import FormField from "../layout/FormField";
import { CheckboxField } from "../ui/CheckboxField";
import { CollapsiblePermissionSection } from "./collapsible-permission-section";
import {
  stepOneFormData,
  StepOneStaffSchema,
  stepTwoFormData,
  StepTwoStaffSchema,
} from "@/lib/schema/add-staff.schema";
import { useInviteStaff } from "@/lib/services/staff.service";
import { InviteStaffDraft, StaffPayload } from "@/lib/types/staffTypes";
import {
  ApiPermission,
  getRolePermissionDefaults,
  Permission,
  PERMISSION_CATEGORIES,
  ROLE_CONFIG,
  UI_TO_API_PERMISSION_MAP,
} from "@/lib/rolePermissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@/lib/enum/roles&permission.enum";
interface AddStaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStaffSidebar({ isOpen, onClose }: AddStaffSidebarProps) {
  const [step, setStep] = useState(1);
  const [staffData, setStaffData] = useState<InviteStaffDraft>({});
  const { mutate: inviteStaff, isPending } = useInviteStaff();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();

  const handleClose = () => {
    setStep(1);
    onClose();
    reset1();
    reset2();
  };

  // Step 1: Invite Employee
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
    reset: reset1,
  } = useForm<stepOneFormData>({
    resolver: zodResolver(StepOneStaffSchema),
  });

  // Step 2: Assign Role & Permissions (combined)
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    watch: watchStep2,
    reset: reset2,
  } = useForm<stepTwoFormData>({
    resolver: zodResolver(StepTwoStaffSchema),
    shouldUnregister: false,
  });

  const roleValue = selectedRole;

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
    const uiPermissions = Object.keys(data).filter(
      (key) =>
        data[key as keyof stepTwoFormData] === true &&
        permissionState.allPermissions.includes(key as Permission)
    ) as Permission[];

    const apiPermissions = uiPermissions
      .map((perm) => UI_TO_API_PERMISSION_MAP[perm])
      .filter((p): p is ApiPermission => Boolean(p));

    const payload: StaffPayload = {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={handleClose} />
      <div className="bg-white w-full max-w-[550px] h-full overflow-y-auto shadow-lg">
        <div className="p-6 border-b z-50 flex items-center justify-between sticky top-0 bg-white">
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

        <div className="p-6">
          {step === 1 && (
            <form
              onSubmit={handleSubmitStep1(handleInviteSubmit)}
              className="space-y-4"
            >
              <FormField
                id="email"
                label="Email address"
                type="email"
                placeholder="Enter work email"
                icon={Mail}
                register={registerStep1}
                error={errorsStep1.email}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleSubmitStep2(handleRoleSubmit)}
              className="space-y-4"
            >
              <SelectFieldLayout
                id="role"
                label="Enter Job Role"
                placeholder="Select job role"
                options={Object.values(Role)}
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
                        permissionState.allPermissions.includes(perm)
                      );

                      if (!allowedPermissions.length) return null;

                      return (
                        <CollapsiblePermissionSection
                          key={category}
                          title={category}
                        >
                          <div className="flex gap-[32px] flex-wrap">
                            {allowedPermissions.map((permId) => {
                              const isDefault =
                                permissionState.defaultPerms.includes(permId);
                              const isNeverAllowed =
                                permissionState.neverAllowedPerms.includes(
                                  permId
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
                                  register={registerStep2}
                                  disabled={isNeverAllowed}
                                  isDefault={isDefault} // 👈 THIS fixes everything
                                />
                              );
                            })}
                          </div>
                        </CollapsiblePermissionSection>
                      );
                    }
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
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
                  className="flex-1"
                >
                  Send Invite
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
