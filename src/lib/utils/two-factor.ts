/**
 * Pure helpers for the 2FA screens. Nothing here touches React or the
 * network, so every rule the UI relies on is covered by plain unit tests.
 */

export const TOTP_LENGTH = 6;

/** The `mfa_token` from the password step lasts five minutes. */
export const MFA_TOKEN_TTL_MS = 5 * 60 * 1000;

/** The server ignores spaces and treats recovery codes case-insensitively. */
export const normalizeCode = (raw: string) =>
  raw.replace(/\s+/g, "").toUpperCase();

export const isTotpCode = (raw: string) =>
  new RegExp(`^\\d{${TOTP_LENGTH}}$`).test(normalizeCode(raw));

/**
 * Puts a recovery code in the `ABCDE-FGHJK` shape the backend issues. A code
 * typed without its hyphen gets one, so the user isn't punished for skipping
 * it. Anything that isn't ten letters/digits comes back unchanged and fails
 * `isRecoveryCode`.
 */
export const formatRecoveryCode = (raw: string) => {
  const compact = normalizeCode(raw).replace(/-/g, "");
  if (!/^[A-Z0-9]{10}$/.test(compact)) return normalizeCode(raw);
  return `${compact.slice(0, 5)}-${compact.slice(5)}`;
};

export const isRecoveryCode = (raw: string) =>
  /^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(formatRecoveryCode(raw));

/** What a rejected code (or password) means for the screen showing it. */
export type CodeErrorKind =
  /** Wrong code. Show it inline and let them retry. */
  | "invalid"
  /** The 5-minute `mfa_token` ran out. Back to the password screen. */
  | "expired"
  /** 5 wrong codes. Locked for 15 minutes. */
  | "locked"
  /** Wrong password on `/2fa/disable` (a 400, not a 401). */
  | "password"
  /** No pending secret: `/2fa/setup` has to run again. */
  | "setup_missing"
  /** The server's state differs from ours (already on / already off). */
  | "state_mismatch"
  | "other";

export interface ClassifiedCodeError {
  kind: CodeErrorKind;
  message: string;
}

/**
 * Maps the `{ status, message }` our actions throw to a `CodeErrorKind`.
 * The messages are matched loosely (case, trailing punctuation) so a small
 * wording change on the backend doesn't silently break the branching.
 */
export const classifyCodeError = (error: unknown): ClassifiedCodeError => {
  const err = (error ?? {}) as { status?: number; message?: string };
  const message = err.message || "Something went wrong";
  const text = message.toLowerCase();

  if (err.status === 429) return { kind: "locked", message };
  if (err.status === 401) {
    return { kind: text.includes("expired") ? "expired" : "invalid", message };
  }
  if (err.status === 400) {
    if (text.includes("password")) return { kind: "password", message };
    if (text.includes("start 2fa setup")) {
      return { kind: "setup_missing", message };
    }
    if (text.includes("already enabled") || text.includes("not enabled")) {
      return { kind: "state_mismatch", message };
    }
    if (text.includes("invalid")) return { kind: "invalid", message };
  }
  return { kind: "other", message };
};

/** `mm:ss` for the login code screen's countdown. */
export const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/** Contents of the downloadable recovery-codes file. */
export const recoveryCodesToText = (
  codes: string[],
  account: string | undefined,
  generatedAt: Date,
) =>
  [
    "Xbanka Admin - 2FA recovery codes",
    account ? `Account: ${account}` : null,
    `Generated: ${generatedAt.toISOString()}`,
    "",
    "Each code works once. Keep them somewhere safe.",
    "Generating new codes makes all of these stop working.",
    "",
    ...codes,
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

/**
 * Role names come back as display text ("Super Admin"); older records and
 * the admin page use the enum spelling (`SUPER_ADMIN`). Both count.
 */
export const isSuperAdminRole = (name: string | null | undefined) =>
  (name ?? "").trim().replace(/[_\s]+/g, " ").toLowerCase() === "super admin";
