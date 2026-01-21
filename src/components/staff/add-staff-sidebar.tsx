"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mail, User, Hash } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import FormField from "../layout/FormField";
import { Checkbox } from "../ui/checkbox";
import SidebarDetailedHeader from "../ui/SidebarDetailedHeader";
import CheckboxField from "../ui/CheckboxField";
import { CollapsiblePermissionSection } from "./collapsible-permission-section";

interface AddStaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStaffSidebar({ isOpen, onClose }: AddStaffSidebarProps) {
  const [step, setStep] = useState(1);
  const [staffData, setStaffData] = useState({});

  // Step 1: Invite Employee
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm();

  // Step 2: Assign Role
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    formState: { errors: errorsStep2 },
  } = useForm();

  // Step 3: Assign Permissions
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    getValues: getValuesStep3,
    formState: { errors: errorsStep3 },
  } = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInviteSubmit = (data: any) => {
    setStaffData({ ...staffData, ...data });
    setStep(2);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoleSubmit = (data: any) => {
    setStaffData({ ...staffData, ...data });
    setStep(3);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePermissionsSubmit = (data: any) => {
    setStaffData({ ...staffData, ...data });
    onClose();
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 1 && "Invite Employee"}
            {step === 2 && "Assign Role"}
            {step === 3 && "Assign Permissions"}
          </h2>
          <button
            onClick={onClose}
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
              <p className="text-sm text-gray-600 mb-6">
                We&apos;ll email instructions & a link to create account
              </p>

              <FormField
                id="fullName"
                label="Full name"
                placeholder="Enter full name"
                icon={User}
                register={registerStep1}
                error={errorsStep1.fullName}
              />

              <FormField
                id="workEmail"
                label="Email address"
                type="email"
                placeholder="Enter work email"
                icon={Mail}
                register={registerStep1}
                error={errorsStep1.workEmail}
              />

              <FormField
                id="staffId"
                label="Staff ID"
                placeholder="e.g. SR-1234560"
                icon={Hash}
                register={registerStep1}
                error={errorsStep1.staffId}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
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
              <p className="text-sm text-gray-600 mb-6">
                We&apos;ll email instructions & a link to create account
              </p>

              <SelectFieldLayout
                id="jobRole"
                label="Enter Job Role"
                placeholder="Select job role"
                options={[
                  "Admin",
                  "Manager",
                  "Operations",
                  "Customer Rep",
                  "Compliance",
                  "Viewer",
                ]}
                onChange={(value) => setValueStep2("jobRole", value)}
                // error={errorsStep2.jobRole}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
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

              <CollapsiblePermissionSection title="System & Settings">
                <div className="flex gap-[32px]">
                  <div className="space-y-3">
                    <CheckboxField
                      id="systemSettings_viewSettings"
                      label=" View system settings"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="systemSettings_manageRoles"
                      label="Manage roles"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="systemSettings_viewAuditLog"
                      label=" View audit log"
                      register={registerStep3}
                    />
                  </div>
                  <div className="space-y-3">
                    <CheckboxField
                      id="systemSettings_editSettings"
                      label="Edit system settings"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="systemSettings_managePermissionTemplates"
                      label="Manage permission templates"
                      register={registerStep3}
                    />
                    <CheckboxField
                      id="systemSettings_exportAuditLog"
                      label="Export audit log"
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
                      label="Read only access"
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
          )}
        </div>
      </div>
    </div>
  );
}
