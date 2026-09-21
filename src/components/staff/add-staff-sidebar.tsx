"use client";
// @ts-nocheck

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import FormField from "../forms/FormField";
import {
  CustomisePermissionsToggle,
  PermissionsFieldset,
} from "./permissions-fieldset";
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
  Role,
  UI_TO_API_PERMISSION_MAP,
} from "@/lib/rolePermissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { usePermissionAvailability } from "@/hooks/usePermissionAvailability";
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

  const {
    availablePerms,
    addablePerms,
    defaultPerms,
    isCustomising,
    setCustomising,
    addPermission,
    removePermission,
    resetAvailability,
  } = usePermissionAvailability(roleValue, {
    onAdd: (permission) =>
      setValueStep2(permission, true, { shouldDirty: true }),
    onRemove: (permission) =>
      setValueStep2(permission, false, { shouldDirty: true }),
  });

  const handleClose = () => {
    setStep(1);
    onClose();
    reset1();
    reset2();
    resetAvailability();
  };

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
                  reset2({
                    role,
                    ...getRolePermissionDefaults(role),
                  });
                  resetAvailability();
                }}
              />

              {roleValue && (
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">
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
              )}
            </div>

            <div className="border-t border-gray-200 flex-shrink-0">
              {roleValue && (
                <div className="px-6 pt-4">
                  <CustomisePermissionsToggle
                    isCustomising={isCustomising}
                    onToggle={setCustomising}
                  />
                </div>
              )}
              <div className="flex gap-3 p-6">
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
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
