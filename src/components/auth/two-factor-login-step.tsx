"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CodeEntry } from "@/components/two-factor/code-entry";
import { useVerifyLogin2fa } from "@/lib/services/two-factor.service";
import {
  MFA_TOKEN_TTL_MS,
  classifyCodeError,
  formatCountdown,
} from "@/lib/utils/two-factor";

/**
 * Second login step for staff with 2FA on.
 *
 * `mfaToken` lives in the parent's state only. It expires five minutes after
 * the password step, so the countdown sends the user back before the server
 * would reject them anyway. Submission is a button press, never automatic on
 * the sixth digit: an accepted code can't be reused inside its 30-second
 * window, and an auto-submit on re-render would burn it.
 */
export function TwoFactorLoginStep({
  mfaToken,
  onExpired,
  onBack,
}: {
  mfaToken: string;
  /** The token ran out. The form returns to the password step with this notice. */
  onExpired: (message: string) => void;
  onBack: () => void;
}) {
  const { mutate, isPending } = useVerifyLogin2fa();
  const [code, setCode] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string>();
  const [locked, setLocked] = useState<string>();
  const [resetKey, setResetKey] = useState(0);

  const deadline = useRef(Date.now() + MFA_TOKEN_TTL_MS);
  const [remaining, setRemaining] = useState(MFA_TOKEN_TTL_MS);

  useEffect(() => {
    const tick = () => {
      const left = deadline.current - Date.now();
      setRemaining(left);
      if (left <= 0) {
        onExpired("Your sign-in session expired. Enter your password again.");
      }
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [onExpired]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || isPending || locked) return;
    setError(undefined);

    mutate(
      { mfa_token: mfaToken, code },
      {
        onError: (err) => {
          const { kind, message } = classifyCodeError(err);
          if (kind === "expired") {
            onExpired(message);
            return;
          }
          if (kind === "locked") {
            setLocked(message);
            return;
          }
          setError(
            kind === "invalid"
              ? "That code didn't work. If you just used it, wait for the next one."
              : message,
          );
          setCode("");
          setValid(false);
          setResetKey((k) => k + 1);
        },
      },
    );
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-teal-light">
          <ShieldCheck className="size-6 text-text-teal" />
        </span>
        <h2 className="text-lg font-semibold text-text-primary">
          Two-factor authentication
        </h2>
        <p className="text-sm text-secondary-text">
          Open your authenticator app and enter the code for Xbanka.
        </p>
      </div>

      <CodeEntry
        resetKey={resetKey}
        error={error}
        disabled={isPending || !!locked}
        onChange={(next, ok) => {
          setCode(next);
          setValid(ok);
          if (error) setError(undefined);
        }}
      />

      {locked && (
        <Alert variant="destructive">
          <AlertDescription>
            {locked} Sign-in is paused for 15 minutes after 5 wrong codes.
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!valid || isPending || !!locked}
        className="w-full text-white"
        style={{
          backgroundColor: "var(--abstractCyan)",
          borderColor: "var(--abstractCyan)",
        }}
      >
        {isPending ? "Verifying..." : "Verify"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-[var(--abstractCyan)] hover:underline"
        >
          Back to sign in
        </button>
        <span className="text-secondary-text" aria-live="off">
          Expires in {formatCountdown(remaining)}
        </span>
      </div>
    </form>
  );
}
