"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CodeEntry } from "@/components/two-factor/code-entry";
import {
  useRefreshProfile,
  useRegenerateRecoveryCodes,
} from "@/lib/services/two-factor.service";
import { classifyCodeError } from "@/lib/utils/two-factor";

import { RecoveryCodesPanel } from "./recovery-codes-panel";
import { TwoFactorDialog } from "./two-factor-dialog";

/** Confirms a code, then shows ten fresh recovery codes. The old ones die. */
export function RegenerateCodesDialog({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account?: string;
}) {
  const regenerate = useRegenerateRecoveryCodes();
  const refreshProfile = useRefreshProfile();

  const [codes, setCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string>();
  const [locked, setLocked] = useState<string>();
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setCodes(null);
    setCode("");
    setValid(false);
    setError(undefined);
    setLocked(undefined);
  }, [open]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || regenerate.isPending || locked) return;

    regenerate.mutate(
      { code },
      {
        onSuccess: (result) => setCodes(result.data.recovery_codes),
        onError: (err) => {
          const { kind, message } = classifyCodeError(err);
          if (kind === "locked") {
            setLocked(message);
          } else if (kind === "state_mismatch") {
            toast.error(message);
            refreshProfile();
            onClose();
          } else {
            setError(kind === "invalid" ? "That code didn't work." : message);
            setCode("");
            setValid(false);
            setResetKey((k) => k + 1);
          }
        },
      },
    );
  };

  if (codes) {
    return (
      <TwoFactorDialog
        open={open}
        onClose={onClose}
        dismissable={false}
        title="Your new recovery codes"
      >
        <RecoveryCodesPanel
          codes={codes}
          account={account}
          onDone={() => {
            toast.success("Recovery codes replaced");
            onClose();
          }}
        />
      </TwoFactorDialog>
    );
  }

  return (
    <TwoFactorDialog
      open={open}
      onClose={onClose}
      title="Generate new recovery codes"
      description="Your current recovery codes will stop working as soon as new ones are made."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <CodeEntry
          resetKey={resetKey}
          error={error}
          disabled={regenerate.isPending || !!locked}
          onChange={(next, ok) => {
            setCode(next);
            setValid(ok);
            setError(undefined);
          }}
        />

        {locked && (
          <p role="alert" className="text-sm text-error-text">
            {locked}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!valid || regenerate.isPending || !!locked}
            className="flex-1 bg-abstractCyan text-white hover:bg-abstractCyan/90"
          >
            {regenerate.isPending ? "Generating..." : "Generate codes"}
          </Button>
        </div>
      </form>
    </TwoFactorDialog>
  );
}
