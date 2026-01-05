"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogLayoutProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  className?: string
}

function DialogLayoutRoot({
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = false,
  className,
}: DialogLayoutProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className={cn(className)}>
        {(title || description) && (
          <div className="flex items-center justify-between">
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <button
            onClick={onClose}
            className="text-muted-foreground cursor-pointer hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
          </div>
        )}

        <div className="py-2">{children}</div>

        {footer && <DialogFooter className="flex w-full gap-5">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

// Expose trigger + close subcomponents for external usage
DialogLayoutRoot.Trigger = DialogTrigger
DialogLayoutRoot.Close = DialogClose

export const DialogLayout = DialogLayoutRoot