"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { formatNaira } from "@/lib/utils/funding";
import type { FundingIntentLog } from "./types";

interface FundingIntentDetailSheetProps {
  log: FundingIntentLog | null;
  onClose: () => void;
}

// Attachment URLs come from the backend as free text; only http(s) is safe to
// turn into a link (a `javascript:` URL would run on click).
function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function fileName(url: string) {
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : url;
  } catch {
    return url;
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border pb-3 last:border-b-0">
      <span className="text-xs font-medium text-secondary-text">{label}</span>
      <div className="text-sm text-text-primary-font-color break-words">{children}</div>
    </div>
  );
}

function CopyableId({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="font-mono text-xs break-all">{value}</span>
      <CopyButton value={value} label="Copy" />
    </span>
  );
}

const EMPTY = <span className="text-secondary-text">—</span>;

export function FundingIntentDetailSheet({ log, onClose }: FundingIntentDetailSheetProps) {
  return (
    <Sheet open={log !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {log && (
          <>
            <SheetHeader>
              <SheetTitle>
                {log.action === "completed" ? "Completion attempt" : "Rejection attempt"}
              </SheetTitle>
              <SheetDescription asChild>
                <div className="flex items-center gap-2">
                  <StatusBadge label={log.status === "success" ? "Success" : "Failed"} />
                </div>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-3 px-4 pb-6">
              {log.failureReason && (
                <Field label="Failure reason">
                  <span className="text-error-text">{log.failureReason}</span>
                </Field>
              )}

              <Field label="Date">
                {new Date(log.timestamp).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })}
              </Field>

              <Field label="Staff">
                <div className="flex flex-col">
                  <span className="font-medium">{log.staffName}</span>
                  <span className="text-xs text-secondary-text">{log.staffId}</span>
                </div>
              </Field>

              <Field label="Transaction ID">
                <CopyableId value={log.transactionId} />
              </Field>

              <Field label="Bank reference">{log.bankReference ?? EMPTY}</Field>

              <Field label="Amount override">
                {log.overrideAmount === null ? EMPTY : formatNaira(log.overrideAmount)}
              </Field>

              <Field label="Reason">{log.reason ?? EMPTY}</Field>

              <Field label="Funding account ID">
                {log.fundingAccountId ? <CopyableId value={log.fundingAccountId} /> : EMPTY}
              </Field>

              <Field label="Attachments">
                {log.attachmentUrls.length === 0 ? (
                  EMPTY
                ) : (
                  <ul className="flex flex-col gap-2">
                    {log.attachmentUrls.map((url, i) => (
                      <li key={`${url}-${i}`}>
                        {isHttpUrl(url) ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-text-teal hover:underline break-all"
                          >
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            {fileName(url)}
                          </a>
                        ) : (
                          <span className="break-all text-secondary-text">{url}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Field>

              <Field label="IP address">{log.ipAddress ?? EMPTY}</Field>

              <Field label="Audit entry ID">
                <CopyableId value={log.id} />
              </Field>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
