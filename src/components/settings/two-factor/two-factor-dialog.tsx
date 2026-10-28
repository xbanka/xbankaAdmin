"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Dialog frame for the 2FA flows. While `dismissable` is false, Esc, an
 * overlay click and the X all do nothing. It's used while recovery codes are
 * on screen, because closing early loses them for good.
 */
export function TwoFactorDialog({
  open,
  onClose,
  title,
  description,
  dismissable = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  dismissable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && dismissable) onClose();
      }}
    >
      <DialogContent
        showCloseButton={dismissable}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
