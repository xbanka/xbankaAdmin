"use client";

import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { recoveryCodesToText } from "@/lib/utils/two-factor";

/**
 * The ten single-use codes. The server never returns them again, so "Done"
 * stays disabled until the user confirms they've saved them, and the dialog
 * around this panel is non-dismissable while it shows.
 */
export function RecoveryCodesPanel({
  codes,
  account,
  onDone,
}: {
  codes: string[];
  account?: string;
  onDone: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const text = () => recoveryCodesToText(codes, account, new Date());

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      toast.success("Recovery codes copied");
    } catch {
      toast.error("Couldn't copy. Download them or write them down instead.");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text()], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "xbanka-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-secondary-text">
        If you lose your phone, each of these codes lets you sign in once.
        This is the only time you&apos;ll see them.
      </p>

      <ul
        aria-label="Recovery codes"
        className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl bg-[#F9FAFB] p-4 font-mono text-[15px] tracking-wider text-text-primary"
      >
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={copy}>
          <Copy className="size-4" /> Copy
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={download}
        >
          <Download className="size-4" /> Download
        </Button>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-text-primary">
        <Checkbox
          checked={saved}
          onCheckedChange={(value) => setSaved(value === true)}
          aria-label="I've saved these recovery codes"
        />
        I&apos;ve saved these recovery codes
      </label>

      <Button
        type="button"
        disabled={!saved}
        onClick={onDone}
        className="w-full bg-abstractCyan text-white hover:bg-abstractCyan/90"
      >
        Done
      </Button>
    </div>
  );
}
