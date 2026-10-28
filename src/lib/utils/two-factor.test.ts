import { describe, expect, it } from "vitest";

import {
  classifyCodeError,
  formatCountdown,
  formatRecoveryCode,
  isRecoveryCode,
  isSuperAdminRole,
  isTotpCode,
  normalizeCode,
  recoveryCodesToText,
} from "./two-factor";

describe("normalizeCode", () => {
  it("strips every kind of whitespace and uppercases", () => {
    expect(normalizeCode(" 123 456 ")).toBe("123456");
    expect(normalizeCode("abcde-fghjk\n")).toBe("ABCDE-FGHJK");
  });
});

describe("isTotpCode", () => {
  it.each(["123456", "000000", " 123 456 "])("accepts %j", (code) => {
    expect(isTotpCode(code)).toBe(true);
  });
  it.each(["12345", "1234567", "12a456", "", "ABCDE-FGHJK"])("rejects %j", (code) => {
    expect(isTotpCode(code)).toBe(false);
  });
});

describe("recovery codes", () => {
  it("adds the hyphen when the user skipped it", () => {
    expect(formatRecoveryCode("abcdefghjk")).toBe("ABCDE-FGHJK");
    expect(formatRecoveryCode("abcde fghjk")).toBe("ABCDE-FGHJK");
  });

  it("leaves anything that isn't ten characters alone", () => {
    expect(formatRecoveryCode("abc-def")).toBe("ABC-DEF");
  });

  it.each(["ABCDE-FGHJK", "abcde-fghjk", "ABCDEFGHJK", "A1B2C-3D4E5"])("accepts %j", (code) => {
    expect(isRecoveryCode(code)).toBe(true);
  });
  it.each(["ABCD-FGHJK", "ABCDE-FGHJK1", "ABCDE_FGHJK", "123456", ""])("rejects %j", (code) => {
    expect(isRecoveryCode(code)).toBe(false);
  });
});

describe("classifyCodeError", () => {
  // Every row is a status/detail pair straight from the backend doc.
  it.each([
    [401, "Invalid code.", "invalid"],
    [401, "2FA session expired. Log in again.", "expired"],
    [429, "Too many failed attempts. Try again later.", "locked"],
    [400, "Invalid verification code.", "invalid"],
    [400, "Start 2FA setup before confirming a code.", "setup_missing"],
    [400, "Two-factor authentication is already enabled.", "state_mismatch"],
    [400, "Two-factor authentication is not enabled.", "state_mismatch"],
    [400, "Password is incorrect.", "password"],
    [500, "Something went wrong", "other"],
  ])("%i %j -> %s", (status, message, kind) => {
    expect(classifyCodeError({ status, message })).toEqual({ kind, message });
  });

  it("survives a missing error", () => {
    expect(classifyCodeError(undefined)).toEqual({
      kind: "other",
      message: "Something went wrong",
    });
  });
});

describe("formatCountdown", () => {
  it("rounds up to whole seconds and never goes negative", () => {
    expect(formatCountdown(5 * 60 * 1000)).toBe("5:00");
    expect(formatCountdown(61_001)).toBe("1:02");
    expect(formatCountdown(9_000)).toBe("0:09");
    expect(formatCountdown(-1)).toBe("0:00");
  });
});

describe("recoveryCodesToText", () => {
  it("lists every code with the account and timestamp", () => {
    const text = recoveryCodesToText(
      ["AAAAA-BBBBB", "CCCCC-DDDDD"],
      "ops@xbanka.com",
      new Date("2026-10-28T09:00:00Z"),
    );
    expect(text).toContain("Account: ops@xbanka.com");
    expect(text).toContain("Generated: 2026-10-28T09:00:00.000Z");
    expect(text).toContain("AAAAA-BBBBB\nCCCCC-DDDDD");
  });

  it("drops the account line when it isn't known", () => {
    expect(recoveryCodesToText(["AAAAA-BBBBB"], undefined, new Date(0))).not.toContain(
      "Account:",
    );
  });
});

describe("isSuperAdminRole", () => {
  it.each(["Super Admin", "SUPER_ADMIN", " super  admin "])("accepts %j", (name) => {
    expect(isSuperAdminRole(name)).toBe(true);
  });
  it.each(["Admin", "Super Admin Assistant", "", null, undefined])("rejects %j", (name) => {
    expect(isSuperAdminRole(name)).toBe(false);
  });
});
