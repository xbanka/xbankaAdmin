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

                              const label =
                                permId
                                  .split("_")[1]
                                  ?.replace(/([A-Z])/g, " $1")
                                  .trim() ?? permId;

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

          {/* {step === 3 && (
            <form
              onSubmit={handleSubmitStep3(handlePermissionsSubmit)}
              className="space-y-6"
            >
              <CollapsiblePermissionSection title="Transactions">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="transactions_viewTransactions"
                      label="View Transactions"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="transactions_verifyTransactions"
                      label="Verify Transactions"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="transactions_refundTransactions"
                      label="Refund Transactions"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="transactions_createTransactions"
                      label="Create Transactions"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="transactions_settleTransactions"
                      label="Settle Transactions"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="transactions_flagTransactions"
                      label="Flag Transactions"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="transactions_freezeTransactions"
                      label="Freeze Transactions"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="transactions_recommendReverseTransactions"
                      label="Recommend transaction reversal"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="transactions_viewAssignedTransactions"
                      label="View assigned transactions"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>

              <CollapsiblePermissionSection title="Customers">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="customers_viewCustomers"
                      label="View Customers"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="customers_manageKyc"
                      label="Manage KYC"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="customers_manageCustomers"
                      label="Manage Customers"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="customers_flagCustomers"
                      label="Flag Customers"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="customers_viewAssignedCustomers"
                      label="View assigned customers"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="customers_updateLimitedCustomersInformation"
                      label="Update limited customer information"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>

              <CollapsiblePermissionSection title="Finance">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="finance_viewPayments"
                      label="View Payments"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="finance_rejectPayments"
                      label="Reject Payments"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="finance_holdPayments"
                      label="Hold Payments"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="finance_approvePayments"
                      label="Approve Payments"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="finance_flagPayments"
                      label="Flag Payments"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="finance_releasePayments"
                      label="Release Payments"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="finance_exportReports"
                      label="Export finance reports"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="finance_retryFailedPayments"
                      label="Retry failed payments"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="finance_retryFailedPayments"
                      label="Reverse failed settlements"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>

              <CollapsiblePermissionSection title="Staff & Access Mgt">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="staffAccess_viewStaffList"
                      label="View staff list"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="staffAccess_editPermissions"
                      label="Edit staff permissions"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="staffAccess_resetPassword"
                      label="Reset password"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="staffAccess_addStaffList"
                      label="Add staff list"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="staffAccess_Suspend/ActivatePermissions"
                      label="Suspend/Activate"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="staffAccess_resendInvites"
                      label="Resend Invites"
                      register={registerStep3}
                    />
                  </div>
                  <div>
                    <CheckboxField
                      id="staffAccess_editStaffList"
                      label="Edit staff roles"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>

              <CollapsiblePermissionSection title="Affiliate Payments">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="affiliate_viewAffiliatePayouts"
                      label="View affiliate payouts"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="affiliate_approveAffiliatePayouts"
                      label="Approve affiliate payouts"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="affiliate_holdAffiliatePayouts"
                      label="Hold affiliate payouts"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="affiliate_adjustAffiliatePayouts"
                      label="Adjust affiliate balances"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>
              <CollapsiblePermissionSection title="Kyc">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="kyc_viewKycData"
                      label=" View kyc data"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="kyc_updateKycStatus"
                      label="Update kyc status"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="kyc_rejectKyc"
                      label="Reject kyc"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="kyc_approveKyc"
                      label="Approve kyc"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="kyc_deleteKyc"
                      label="Delete kyc"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="kyc_viewKycStatus"
                      label="View KYC status"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="kyc_uploadKyc"
                      label="Upload kyc documents"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="kyc_flagKyc"
                      label="Flag kyc"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>
              <CollapsiblePermissionSection title="Tasks">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="tasks_viewTasks"
                      label="View tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_createTasks"
                      label="Create tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_viewTasksAnalytics"
                      label="View task analytics"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_createComplianceTasks"
                      label="Create compliance tasks"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="tasks_assignTasks"
                      label="Assign tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_updateTasks"
                      label="Update tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_commentTasks"
                      label="Comment on tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_viewAssignedTasks"
                      label="View assigned tasks"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="tasks_viewTasks"
                      label="View tasks progress"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_deleteTasks"
                      label="Delete tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_attachTasksDocument"
                      label="Attach document to tasks"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="tasks_updateStatusTasks"
                      label="Update task status"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>
              <CollapsiblePermissionSection title="Read Only">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="readOnly_readOnlyAccess"
                      label="Read only access"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="readOnly_exportReadOnlyReports"
                      label="Export read only reports"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="readOnly_viewFinanceSummary"
                      label="View finance summaries (read-only)"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="readOnly_viewLogs"
                      label="View logs (read only)"
                      register={registerStep3}
                    />
                  </div>
                </div>
              </CollapsiblePermissionSection>

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
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Send Invite
                </Button>
              </div>
            </form>
          )} */}
        </div>
      </div>
    </div>
  );
}
