"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import {
  TOTP_LENGTH,
  formatRecoveryCode,
  isRecoveryCode,
  isTotpCode,
} from "@/lib/utils/two-factor";

export type CodeMode = "totp" | "recovery";

/**
 * One field for "prove you have the second factor": six digit boxes for the
 * authenticator app, or a text box for an `ABCDE-FGHJK` recovery code. The
 * digit boxes only take numbers, which is why recovery codes get their own
 * input rather than being squeezed into them.
 *
 * Reports the value ready to send (normalised) and whether it's well-formed,
 * so the parent never has to know which mode is showing. To clear it after a
 * rejected code, change `resetKey`.
 */
export function CodeEntry({
  onChange,
  error,
  disabled,
  resetKey = 0,
  allowRecovery = true,
  autoFocus = true,
}: {
  onChange: (code: string, valid: boolean) => void;
  error?: string;
  disabled?: boolean;
  resetKey?: number;
  allowRecovery?: boolean;
  autoFocus?: boolean;
}) {
  const [mode, setMode] = useState<CodeMode>("totp");
  const [recovery, setRecovery] = useState("");

  const switchMode = (next: CodeMode) => {
    setMode(next);
    setRecovery("");
    onChange("", false);
  };

  return (
    <div className="flex flex-col gap-3">
      {mode === "totp" ? (
        <OtpInput
          key={`totp-${resetKey}`}
          length={TOTP_LENGTH}
          autoFocus={autoFocus}
          disabled={disabled}
          error={error}
          label="Authenticator code"
          hint="Enter the 6-digit code from your authenticator app."
          onChange={(value) => onChange(value, isTotpCode(value))}
        />
      ) : (
        <div className="flex flex-col gap-2" key={`recovery-${resetKey}`}>
          <label
            htmlFor="recovery-code"
            className="text-sm font-medium text-text-primary"
          >
            Recovery code
          </label>
          <Input
            id="recovery-code"
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck={false}
            placeholder="ABCDE-FGHJK"
            className="font-mono uppercase tracking-wider"
            value={recovery}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              const raw = e.target.value;
              setRecovery(raw);
              onChange(formatRecoveryCode(raw), isRecoveryCode(raw));
            }}
          />
          {error ? (
            <p role="alert" className="text-xs text-error-text">
              {error}
            </p>
          ) : (
            <p className="text-xs text-secondary-text">
              Each recovery code works once.
            </p>
          )}
        </div>
      )}

      {allowRecovery && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => switchMode(mode === "totp" ? "recovery" : "totp")}
          className="self-start cursor-pointer text-sm text-text-teal hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "totp"
            ? "Use a recovery code instead"
            : "Use authenticator code instead"}
        </button>
      )}
    </div>
  );
}
