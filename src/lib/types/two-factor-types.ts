/**
 * Staff two-factor authentication (TOTP) contract, as documented by the
 * backend in "Staff two-factor authentication (2FA) API".
 */

/** `POST /api/auth/erp/login` answers in one of two shapes. */
export type LoginResponse =
  | {
      /** No 2FA on the account — a normal session, cookies already set. */
      access_token: string;
      token_type: "bearer";
      mfa_required: false;
      mfa_token: null;
    }
  | {
      /** Password was right, but no session exists until `/login/2fa`. */
      access_token: null;
      token_type: null;
      mfa_required: true;
      /** Valid for 5 minutes, only on `/login/2fa`. Keep in memory only. */
      mfa_token: string;
    };

export interface Login2faPayload {
  mfa_token: string;
  /** A 6-digit authenticator code or an `ABCDE-FGHJK` recovery code. */
  code: string;
}

export interface Login2faResponse {
  access_token: string;
  token_type: "bearer";
}

export interface TotpSetup {
  /** Base32 secret, shown as text for manual entry. */
  secret: string;
  /** Rendered as a QR code client-side. */
  otpauth_uri: string;
}

export interface RecoveryCodesResponse {
  /** Ten single-use codes. Shown once, never retrievable again. */
  recovery_codes: string[];
}

export interface Disable2faPayload {
  password: string;
  code: string;
}

export interface CodePayload {
  code: string;
}
