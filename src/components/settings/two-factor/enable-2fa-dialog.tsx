"use client";

import { FormEvent, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeEntry } from "@/components/two-factor/code-entry";
import {
  useEnable2fa,
  useRefreshProfile,
  useStart2faSetup,
} from "@/lib/services/two-factor.service";
import { TotpSetup } from "@/lib/types/two-factor-types";
import { classifyCodeError } from "@/lib/utils/two-factor";

import { RecoveryCodesPanel } from "./recovery-codes-panel";
import { TwoFactorDialog } from "./two-factor-dialog";

/**
 * Enrollment: `/2fa/setup` → scan → `/2fa/enable` → recovery codes.
 *
 * Nothing is enforced until `/enable` succeeds, so closing before then is
 * safe. Once codes are on screen the dialog can't be dismissed until the
 * user confirms they saved them.
 */
export function Enable2faDialog({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account?: string;
}) {
  const setup = useStart2faSetup();
  const enable = useEnable2fa();
  const refreshProfile = useRefreshProfile();

  const [secret, setSecret] = useState<TotpSetup | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string>();
  const [resetKey, setResetKey] = useState(0);

  const startSetup = () =>
    setup.mutate(undefined, {
      onSuccess: (result) => setSecret(result.data),
      onError: (err) => {
        const { kind, message } = classifyCodeError(err);
        toast.error(message);
        if (kind === "state_mismatch") refreshProfile();
        onClose();
      },
    });

  // A new secret every time the dialog opens; the old pending one is replaced.
  useEffect(() => {
    if (!open) return;
    setSecret(null);
    setCodes(null);
    setCode("");
    setValid(false);
    setError(undefined);
    startSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const clearCode = (message: string) => {
    setError(message);
    setCode("");
    setValid(false);
    setResetKey((k) => k + 1);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || enable.isPending) return;
    setError(undefined);

    enable.mutate(
      { code },
      {
        onSuccess: (result) => setCodes(result.data.recovery_codes),
        onError: (err) => {
          const { kind, message } = classifyCodeError(err);
          if (kind === "setup_missing") {
            clearCode("That setup expired. Scan the new QR code and try again.");
            startSetup();
          } else if (kind === "state_mismatch") {
            toast.error(message);
            refreshProfile();
            onClose();
          } else if (kind === "invalid") {
            clearCode(
              "That code didn't match. Check your phone's clock is set automatically and try the current code.",
            );
          } else {
            clearCode(message);
          }
        },
      },
    );
  };

  const copySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret.secret);
      toast.success("Setup key copied");
    } catch {
      toast.error("Couldn't copy the key");
    }
  };

  if (codes) {
    return (
      <TwoFactorDialog
        open={open}
        onClose={onClose}
        dismissable={false}
        title="Save your recovery codes"
      >
        <RecoveryCodesPanel
          codes={codes}
          account={account}
          onDone={() => {
            toast.success("Two-factor authentication is on");
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
      title="Set up two-factor authentication"
      description="Use an authenticator app such as Google Authenticator, Microsoft Authenticator or 1Password."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <ol className="flex flex-col gap-1 text-sm text-secondary-text">
          <li>1. Scan this QR code with your authenticator app.</li>
          <li>2. Enter the 6-digit code the app shows.</li>
        </ol>

        <div className="flex flex-col items-center gap-3">
          {secret ? (
            <div
              className="rounded-xl border border-border-default bg-white p-3"
              aria-label="QR code for your authenticator app"
              role="img"
            >
              <QRCodeSVG value={secret.otpauth_uri} size={176} marginSize={1} />
            </div>
          ) : (
            <Skeleton className="size-[202px] rounded-xl" />
          )}

          <div className="flex w-full flex-col gap-1">
            <span className="text-xs text-secondary-text">
              Can&apos;t scan it? Enter this key manually:
            </span>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-[#F9FAFB] px-3 py-2">
              <code
                data-testid="totp-secret"
                className="break-all font-mono text-sm tracking-wider text-text-primary"
              >
                {secret?.secret ?? "Loading..."}
              </code>
              <button
                type="button"
                onClick={copySecret}
                disabled={!secret}
                aria-label="Copy setup key"
                className="shrink-0 cursor-pointer text-secondary-text hover:text-text-primary disabled:opacity-50"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <CodeEntry
          allowRecovery={false}
          autoFocus={false}
          resetKey={resetKey}
          error={error}
          disabled={!secret || enable.isPending}
          onChange={(next, ok) => {
            setCode(next);
            setValid(ok);
            if (error) setError(undefined);
          }}
        />

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
            disabled={!secret || !valid || enable.isPending}
            className="flex-1 bg-abstractCyan text-white hover:bg-abstractCyan/90"
          >
            {enable.isPending ? "Verifying..." : "Turn on"}
          </Button>
        </div>
      </form>
    </TwoFactorDialog>
  );
}
