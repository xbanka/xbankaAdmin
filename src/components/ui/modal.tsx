"use client";

import { cn } from "@/lib/utils";
import { MouseEvent } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function Modal({
  onClose,
  children,
  className,
  backdropClassName,
}: {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
}) {
  useBodyScrollLock(true);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-150",
        "max-sm:items-end max-sm:p-0 ",
        backdropClassName,
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative z-10 w-full max-w-150 bg-card-background px-10 pb-10 border-8 border-border rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150",
          "max-sm:max-w-full max-sm:max-h-[90vh] max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:slide-in-from-bottom-4",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
