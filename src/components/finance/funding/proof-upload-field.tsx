"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, RotateCw, Trash2, XCircle } from "lucide-react";
import { AttachmentUpload } from "@/components/ui/UploadAttachment";
import { uploadProofFile } from "@/lib/services/funding.service";

export interface ProofUpload {
  id: number;
  file: File;
  previewUrl?: string;
  status: "uploading" | "done" | "failed";
  url?: string;
}

/**
 * Each proof file uploads the moment it's added, so by the time staff press
 * Confirm the URLs already exist and go out with the complete request. The
 * caller blocks submit while anything is still uploading.
 */
export function useProofUploads(upload: (file: File) => Promise<string> = uploadProofFile) {
  const [uploads, setUploads] = useState<ProofUpload[]>([]);
  const nextId = useRef(0);
  const uploadsRef = useRef(uploads);
  uploadsRef.current = uploads;

  const patch = (id: number, change: Partial<ProofUpload>) =>
    setUploads((list) => list.map((u) => (u.id === id ? { ...u, ...change } : u)));

  const start = useCallback(
    (id: number, file: File) => {
      patch(id, { status: "uploading", url: undefined });
      upload(file).then(
        (url) => patch(id, { status: "done", url }),
        () => patch(id, { status: "failed" }),
      );
    },
    [upload],
  );

  const add = (items: { file: File; previewUrl?: string }[]) => {
    const created = items.map((item) => ({
      ...item,
      id: nextId.current++,
      status: "uploading" as const,
    }));
    setUploads((list) => [...list, ...created]);
    created.forEach((u) => start(u.id, u.file));
  };

  const remove = (id: number) =>
    setUploads((list) => {
      const target = list.find((u) => u.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return list.filter((u) => u.id !== id);
    });

  const retry = (id: number) => {
    const target = uploads.find((u) => u.id === id);
    if (target) start(id, target.file);
  };

  // Free object URLs when the modal unmounts.
  useEffect(
    () => () => uploadsRef.current.forEach((u) => u.previewUrl && URL.revokeObjectURL(u.previewUrl)),
    [],
  );

  return {
    uploads,
    add,
    remove,
    retry,
    urls: uploads.flatMap((u) => (u.status === "done" && u.url ? [u.url] : [])),
    isUploading: uploads.some((u) => u.status === "uploading"),
    hasFailed: uploads.some((u) => u.status === "failed"),
  };
}

export function ProofUploadField({ proofs }: { proofs: ReturnType<typeof useProofUploads> }) {
  return (
    <div className="space-y-2">
      {/* Only the drop box is reused; the list below shows upload state. */}
      <AttachmentUpload value={[]} onChange={proofs.add} />

      {proofs.uploads.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between gap-3 border rounded-md py-2 px-4 border-border bg-[#F9FAFB]"
        >
          <div className="flex min-w-0 items-center gap-3">
            {u.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.previewUrl} alt="" className="h-10 w-10 rounded object-cover" />
            ) : (
              <FileText className="h-8 w-8 shrink-0 text-gray-400" />
            )}
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium text-[14px] leading-[20px]">{u.file.name}</p>
              <p className="flex items-center gap-1 text-xs text-[#585859]">
                {u.status === "uploading" && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading
                  </>
                )}
                {u.status === "done" && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-success-text" /> Uploaded
                  </>
                )}
                {u.status === "failed" && (
                  <>
                    <XCircle className="h-3 w-3 text-error-text" /> Upload failed
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {u.status === "failed" && (
              <button
                type="button"
                aria-label={`Retry ${u.file.name}`}
                onClick={() => proofs.retry(u.id)}
                className="text-secondary-text hover:text-text-primary cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              aria-label={`Remove ${u.file.name}`}
              onClick={() => proofs.remove(u.id)}
              className="text-[#991B1B] cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
