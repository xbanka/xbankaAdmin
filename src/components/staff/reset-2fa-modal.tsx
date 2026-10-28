"use client";

import { ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogLayout } from "../layout/modalLayout";
import { StaffMember } from "@/lib/types/staffTypes";
import { useResetStaff2fa } from "@/lib/services/two-factor.service";

/**
 * Super Admin escape hatch for staff who lost both their phone and their
 * recovery codes. The backend wipes the secret, notifies the user in-app,
 * and they sign in with just their password until they enroll again.
 */
export default function Reset2faModal({
  isOpen,
  onClose,
  staff,
}: {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}) {
  const { mutate, isPending } = useResetStaff2fa();
  const name = staff ? `${staff.first_name} ${staff.last_name}`.trim() : "";

  return (
    <DialogLayout
      open={isOpen}
      onClose={onClose}
      title="Reset two-factor authentication"
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={isPending || !staff}
            onClick={() =>
              staff && mutate(staff.id, { onSuccess: onClose })
            }
          >
            {isPending ? "Resetting..." : "Reset 2FA"}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <ShieldOff className="mt-0.5 size-5 shrink-0 text-error-text" />
        <p className="text-sm text-secondary-text">
          This removes the authenticator app and recovery codes from{" "}
          <span className="font-medium text-text-primary">
            {name || "this staff member"}
          </span>
          . They&apos;ll sign in with just their password and can set up 2FA
          again from Settings. Only do this after confirming who they are.
        </p>
      </div>
    </DialogLayout>
  );
}
