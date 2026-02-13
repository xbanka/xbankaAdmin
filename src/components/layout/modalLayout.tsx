"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogLayoutProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: false
}

function DialogLayoutRoot({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton = false
}: DialogLayoutProps) {
  return (
    <Dialog
      open={open}
    >
      <DialogContent
      showCloseButton={showCloseButton}
        className={cn(className)}
      >
        {(title || description) && (
          <div className="flex items-center justify-between">
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground cursor-pointer hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="py-2">{children}</div>

        {footer && (
          <DialogFooter className="flex w-full gap-5">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Expose trigger + close subcomponents for external usage
DialogLayoutRoot.Trigger = DialogTrigger;
DialogLayoutRoot.Close = DialogClose;

export const DialogLayout = DialogLayoutRoot;
