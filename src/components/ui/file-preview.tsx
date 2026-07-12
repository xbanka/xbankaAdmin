"use client";

import { File, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  fileName: string;
  onRemove?: () => void;
  className?: string;
  text?: string;
  btnClass?: string;
}

export function FilePreview({ fileName, onRemove, className, text, btnClass }: FilePreviewProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-2 px-4 h-14 rounded-[8px] border border-background-alt-neutral-grey bg-background-base text-xs",
        className
      )}
    >
      <File className="h-4 w-4 text-text-secondary flex-shrink-0" />
      
      <span className="flex-1 truncate text-text-primary font-medium">
        {fileName}
      </span>
      
      <button
        type="button"
        onClick={onRemove}
        className={cn("text-[var(--text-secondary)] hover:text-[var(--mainRed)] p-1 rounded transition-colors duration-200 focus:outline-none", btnClass)}
        aria-label="Remove file"
      >
        { text || <Trash2 className="h-4 w-4 text-alert-error-text" />}
      </button>
    </div>
  );
}