"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";

export function ConfirmAccountAction({
  title,
  message,
  confirmLabel,
  destructive,
  isPending,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const close = isPending ? () => {} : onClose;
  return (
    <Modal onClose={close} className="max-w-[460px] px-0 pb-0 border-none">
      <ModalHeader
        title={title}
        onClose={close}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />
      <div className="bg-card-primary px-10 py-6 max-sm:px-6 rounded-b-2xl">
        <div
          className={
            destructive
              ? "flex items-start gap-3 rounded-lg bg-error-light p-4 text-sm text-error-text"
              : "flex items-start gap-3 rounded-lg bg-warning-light p-4 text-sm text-warning-text"
          }
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{message}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            className="flex-1"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Saving..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
