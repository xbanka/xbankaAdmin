"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeEntry } from "@/components/two-factor/code-entry";
import {
  useDisable2fa,
  useRefreshProfile,
} from "@/lib/services/two-factor.service";
import { classifyCodeError } from "@/lib/utils/two-factor";

import { TwoFactorDialog } from "./two-factor-dialog";

/**
 * Turning 2FA off needs the password *and* a code. Each rejection is shown on
 * the field it's about: a wrong password is a 400 (so it never looks like an
 * expired session), a wrong code is a 401 that the interceptor passes through.
 */
export function Disable2faDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const disable = useDisable2fa();
  const refreshProfile = useRefreshProfile();

  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [valid, setValid] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [codeError, setCodeError] = useState<string>();
  const [locked, setLocked] = useState<string>();
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setCode("");
    setValid(false);
    setPasswordError(undefined);
    setCodeError(undefined);
    setLocked(undefined);
  }, [open]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError("Enter your password");
      return;
    }
    if (!valid || disable.isPending || locked) return;

    disable.mutate(
      { password, code },
      {
        onSuccess: onClose,
        onError: (err) => {
          const { kind, message } = classifyCodeError(err);
          if (kind === "password") {
            setPasswordError(message);
          } else if (kind === "locked") {
            setLocked(message);
          } else if (kind === "state_mismatch") {
            toast.error(message);
            refreshProfile();
            onClose();
          } else {
            setCodeError(kind === "invalid" ? "That code didn't work." : message);
            setCode("");
            setValid(false);
            setResetKey((k) => k + 1);
          }
        },
      },
    );
  };

  return (
    <TwoFactorDialog
      open={open}
      onClose={onClose}
      title="Turn off two-factor authentication"
      description="Your account will be protected by your password only."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="disable-2fa-password">Password</Label>
          <Input
            id="disable-2fa-password"
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={disable.isPending}
            aria-invalid={passwordError ? true : undefined}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(undefined);
            }}
          />
          {passwordError && (
            <p role="alert" className="text-xs text-error-text">
              {passwordError}
            </p>
          )}
        </div>

        <CodeEntry
          autoFocus={false}
          resetKey={resetKey}
          error={codeError}
          disabled={disable.isPending || !!locked}
          onChange={(next, ok) => {
            setCode(next);
            setValid(ok);
            setCodeError(undefined);
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
            variant="destructive"
            disabled={!valid || disable.isPending || !!locked}
            className="flex-1"
          >
            {disable.isPending ? "Turning off..." : "Turn off"}
          </Button>
        </div>
      </form>
    </TwoFactorDialog>
  );
}
