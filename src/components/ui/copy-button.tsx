"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Icon button that copies `value` and briefly shows a check. */
export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (permissions, insecure origin); the value
      // stays visible and selectable, so there's nothing else to do.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-secondary-text hover:bg-border hover:text-text-primary cursor-pointer",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success-text" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
