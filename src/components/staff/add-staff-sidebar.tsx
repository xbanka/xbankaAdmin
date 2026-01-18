"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Mail, User, Hash } from "lucide-react"
import { SelectFieldLayout } from "../layout/SelectFieldLayout"
import FormField from "../layout/FormField"
import { Checkbox } from "../ui/checkbox"

interface AddStaffSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStaffSidebar({ isOpen, onClose }: AddStaffSidebarProps) {
  const [step, setStep] = useState(1)
  const [staffData, setStaffData] = useState({})

  // Step 1: Invite Employee
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm()

  // Step 2: Assign Role
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    formState: { errors: errorsStep2 },
  } = useForm()

  // Step 3: Assign Permissions
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInviteSubmit = (data: any) => {
    setStaffData({ ...staffData, ...data })
    setStep(2)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoleSubmit = (data: any) => {
    setStaffData({ ...staffData, ...data })
    setStep(3)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePermissionsSubmit = (data: any) => {
    setStaffData({ ...staffData, ...data })
    console.log("Staff created with full permissions:", { ...staffData, ...data })
    onClose()
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 1 && "Invite Employee"}
            {step === 2 && "Assign Role"}
            {step === 3 && "Assign Permissions"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmitStep1(handleInviteSubmit)} className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">We&apos;ll email instructions & a link to create account</p>

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
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2(handleRoleSubmit)} className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">We&apos;ll email instructions & a link to create account</p>

              <SelectFieldLayout
                id="jobRole"
                label="Enter Job Role"
                placeholder="Select job role"
                options={["Admin", "Manager", "Staff", "Analyst", "Support"]}
                onChange={(value) => setValueStep2("jobRole", value)}
                // error={errorsStep2.jobRole}
              />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitStep3(handlePermissionsSubmit)} className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Transactions</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("transactions_viewTransactions")} />
                    <span className="text-sm text-gray-700">View Transactions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("transactions_viewTransactions")} />
                    <span className="text-sm text-gray-700">Create Transactions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("transactions_verifyTransactions")} />
                    <span className="text-sm text-gray-700">Verify Transactions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("transactions_verifyTransactions")} />
                    <span className="text-sm text-gray-700">Settle Transactions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("transactions_refundTransactions")} />
                    <span className="text-sm text-gray-700">Refund Transactions</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Customers</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("customers_viewCustomers")} />
                    <span className="text-sm text-gray-700">View Customers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("customers_manageCustomers")} />
                    <span className="text-sm text-gray-700">Manage Customers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("customers_manageKyc")} />
                    <span className="text-sm text-gray-700">Manage KYC</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("customers_flagCustomers")} />
                    <span className="text-sm text-gray-700">Flag Customers</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Finance</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("finance_viewPayments")} />
                    <span className="text-sm text-gray-700">View Payments</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("finance_approvePayments")} />
                    <span className="text-sm text-gray-700">Approve Payments</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("finance_rejectPayments")} />
                    <span className="text-sm text-gray-700">Reject Payments</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("finance_flagPayments")} />
                    <span className="text-sm text-gray-700">Flag Payments</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Staff & Access Mgt</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_viewStaffList")} />
                    <span className="text-sm text-gray-700">View staff list</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_viewStaffList")} />
                    <span className="text-sm text-gray-700">Add staff list</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_viewStaffList")} />
                    <span className="text-sm text-gray-700">Edit staff roles</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_editPermissions")} />
                    <span className="text-sm text-gray-700">Edit staff permissions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_editPermissions")} />
                    <span className="text-sm text-gray-700">Suspend/Activate</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_resetPassword")} />
                    <span className="text-sm text-gray-700">Reset password</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("staffAccess_researchInvites")} />
                    <span className="text-sm text-gray-700">Research Invites</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">System & Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("systemSettings_viewSettings")} />
                    <span className="text-sm text-gray-700">View system settings</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox {...registerStep3("systemSettings_editSettings")} />
                    <span className="text-sm text-gray-700">Edit system settings</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
                  Send Invite
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
