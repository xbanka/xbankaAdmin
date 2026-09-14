"use client";

import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogLayout } from "../layout/modalLayout";
import { useConfirmRoleChange } from "@/lib/services/notification.service";
import { PayoutNotification } from "./notifications";

interface RoleChangeConfirmModalProps {
  notification: PayoutNotification | null;
  onLater: () => void;
  onConfirmed: () => void;
}

export function RoleChangeConfirmModal({
  notification,
  onLater,
  onConfirmed,
}: RoleChangeConfirmModalProps) {
  const { mutate, isPending } = useConfirmRoleChange();

  const handleConfirm = () => {
    if (!notification?.reference_id) return;
    mutate(
      { id: notification.reference_id },
      { onSuccess: onConfirmed },
    );
  };

  return (
    <DialogLayout
      open={!!notification}
      onClose={onLater}
      title="Role Change Requested"
      footer={
        <>
          <Button
            className="flex-1 bg-transparent"
            onClick={onLater}
            variant="outline"
            disabled={isPending}
          >
            Later
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Confirming..." : "Confirm"}
          </Button>
        </>
      }
    >
      <div className="flex gap-3 py-4">
        <UserCog className="h-5 w-5 flex-shrink-0 mt-0.5 text-abstractCyan" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            {notification?.message}
          </p>
          <p className="text-sm text-gray-600">
            Confirm now to apply your new role and permissions, or confirm
            later from the notification bell.
          </p>
        </div>
      </div>
    </DialogLayout>
  );
}
