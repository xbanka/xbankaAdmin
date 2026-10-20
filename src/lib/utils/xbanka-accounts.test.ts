import { describe, expect, it } from "vitest";
import {
  bankInitials,
  buildCreatePayload,
  buildUpdatePayload,
  extractDeleteResult,
  extractFundingBanks,
  extractLookupResult,
  extractXbankaAccount,
  extractXbankaAccounts,
  findBankLogo,
  hideRisk,
  isLastVisibleAccount,
  isTenDigits,
  maskAccountNumber,
  parseBackendMessage,
  sortXbankaAccounts,
} from "./xbanka-accounts";
import { indexBankLogos, normaliseBankName } from "../actions/bank-logos";
import { xbankaAccountSchema } from "../schema/xbanka-account.schema";
import {
  access,
  accountsResponse,
  gtb,
  lookupResponse,
} from "./xbanka-accounts.fixtures";

const form = (over = {}) => ({
  bankCode: "044",
  bankName: "Access Bank",
  accountNumber: "0987654321",
  accountName: "XBANKA TECHNOLOGIES LTD",
  isPrimary: false,
  ...over,
});

describe("extractors", () => {
  it("reads accounts from data.items", () => {
    expect(extractXbankaAccounts(accountsResponse)).toHaveLength(2);
  });

  it.each([null, undefined, {}, { data: null }, { data: { items: "x" } }])(
    "returns [] for %j",
    (body) => expect(extractXbankaAccounts(body)).toEqual([]),
  );

  it("reads banks from the bare data array and keeps codes as strings with zeros", () => {
    const banks = extractFundingBanks({ data: [{ name: "Access Bank", code: "044" }, { name: "X", code: 44 }] });
    expect(banks.map((b) => b.code)).toEqual(["044", "44"]);
    expect(extractFundingBanks(null)).toEqual([]);
  });

  it("sorts banks by name and drops incomplete rows", () => {
    const names = extractFundingBanks({ data: [{ name: "Zenith", code: "057" }, { code: "1" }, { name: "Access", code: "044" }] });
    expect(names.map((b) => b.name)).toEqual(["Access", "Zenith"]);
  });

  it("reads lookup data[0] (an array, snake_case)", () => {
    expect(extractLookupResult(lookupResponse)?.account_name).toBe("JOHN DOE");
  });

  it.each([{ data: [] }, { data: [{ account_name: "" }] }, null, { data: {} }])(
    "treats %j as account not found",
    (body) => expect(extractLookupResult(body)).toBeNull(),
  );

  it("unwraps a created/updated account", () => {
    expect(extractXbankaAccount({ data: access })?.id).toBe(access.id);
    expect(extractXbankaAccount({ message: "x" })).toBeNull();
  });
});

describe("sortXbankaAccounts", () => {
  it("puts primary first, then visible, then hidden", () => {
    const hidden = { ...access, id: "h", isActive: false, createdAt: "2026-01-01T00:00:00Z" };
    const sorted = sortXbankaAccounts([hidden, access, gtb]);
    expect(sorted.map((a) => a.id)).toEqual([gtb.id, access.id, "h"]);
  });
});

describe("buildCreatePayload", () => {
  it("sends trimmed fields, the string bank code, and updatedBy", () => {
    expect(
      buildCreatePayload(form({ accountName: "  XBANKA LTD ", isPrimary: true }), "ops@xbanka.com"),
    ).toEqual({
      bankName: "Access Bank",
      bankCode: "044",
      accountNumber: "0987654321",
      accountName: "XBANKA LTD",
      isPrimary: true,
      updatedBy: "ops@xbanka.com",
    });
  });
});

describe("buildUpdatePayload", () => {
  it("sends only the changed field plus updatedBy", () => {
    expect(buildUpdatePayload(access, form({ accountName: "XBANKA NEW LTD" }), "ops@xbanka.com")).toEqual({
      accountName: "XBANKA NEW LTD",
      updatedBy: "ops@xbanka.com",
    });
  });

  it("returns null when nothing changed (a bare updatedBy PATCH is a 422)", () => {
    expect(buildUpdatePayload(access, form(), "ops@xbanka.com")).toBeNull();
    expect(buildUpdatePayload(access, form({ accountName: " XBANKA TECHNOLOGIES LTD " }), "o")).toBeNull();
  });

  it("sends bankName and bankCode together when the bank changes", () => {
    expect(
      buildUpdatePayload(access, form({ bankCode: "058", bankName: "Guaranty Trust Bank" }), "o"),
    ).toEqual({ bankCode: "058", bankName: "Guaranty Trust Bank", updatedBy: "o" });
  });

  it("never sends isPrimary or isActive from the edit form", () => {
    const payload = buildUpdatePayload(access, form({ accountName: "N", isPrimary: true }), "o");
    expect(payload).not.toHaveProperty("isPrimary");
    expect(payload).not.toHaveProperty("isActive");
  });
});

describe("hideRisk", () => {
  it("flags hiding the primary account", () => {
    expect(hideRisk(gtb, [gtb, access])).toBe("primary");
  });

  it("flags hiding the last visible account", () => {
    const hiddenGtb = { ...gtb, isActive: false };
    expect(hideRisk(access, [hiddenGtb, access])).toBe("last");
  });

  it("is safe when another account stays visible", () => {
    expect(hideRisk(access, [gtb, access])).toBeNull();
  });

  it("is safe for an already hidden account", () => {
    expect(hideRisk({ ...access, isActive: false }, [gtb, access])).toBeNull();
  });
});

describe("isTenDigits", () => {
  it.each([["0123456789", true], ["012345678", false], ["01234567890", false], ["012345678a", false], ["", false]])(
    "%j -> %s",
    (v, ok) => expect(isTenDigits(v)).toBe(ok),
  );
});

describe("xbankaAccountSchema", () => {
  it("accepts a complete form", () => {
    expect(xbankaAccountSchema.safeParse(form()).success).toBe(true);
  });

  it.each([
    ["no bank", form({ bankCode: "", bankName: "" })],
    ["short number", form({ accountNumber: "12345" })],
    ["letters in number", form({ accountNumber: "012345678a" })],
    ["blank name", form({ accountName: "   " })],
  ])("rejects %s", (_, v) => expect(xbankaAccountSchema.safeParse(v).success).toBe(false));
});

describe("bank logos", () => {
  const entries = [
    { name: "Access Bank", slug: "access-bank", code: "044", logo: "https://nigerianbanks.xyz/logo/access-bank.png" },
    { name: "OPay Digital Services Limited (OPay)", slug: "paycom", code: "999992", logo: "https://nigerianbanks.xyz/logo/paycom.png" },
    { name: "No Art Bank", slug: "n", code: "999", logo: "https://nigerianbanks.xyz/logo/default-image.png" },
  ];
  const index = indexBankLogos(entries);

  it("matches on bank code first", () => {
    expect(findBankLogo(index, "044", "Whatever")).toContain("access-bank");
  });

  it("falls back to the normalised name", () => {
    expect(findBankLogo(index, "000", "ACCESS  bank")).toContain("access-bank");
    expect(normaliseBankName("Access-Bank!")).toBe("accessbank");
  });

  it("matches OPay by its bracketed alias even though codes differ (100004 vs 999992)", () => {
    expect(findBankLogo(index, "100004", "OPay")).toContain("paycom");
  });

  it("skips the placeholder artwork so the initials badge shows instead", () => {
    expect(findBankLogo(index, "999", "No Art Bank")).toBeUndefined();
  });

  it("returns undefined while the logo index hasn't loaded", () => {
    expect(findBankLogo(undefined, "044", "Access Bank")).toBeUndefined();
  });
});

describe("bankInitials", () => {
  it.each([
    ["Guaranty Trust Bank", "GT"],
    ["Access Bank", "AC"],
    ["OPay", "OP"],
    ["Zenith Bank PLC", "ZE"],
    ["", "?"],
  ])("%j -> %s", (name, initials) => expect(bankInitials(name)).toBe(initials));
});

describe("parseBackendMessage", () => {
  const nested = JSON.stringify({
    message: "The primary (default) account cannot be deleted. Make another account primary first.",
    details: "",
    errorGroup: "MICROSERVICE_ERROR",
    data: null,
  });

  it("shows the inner message of a core-backend JSON body sent as a string", () => {
    expect(parseBackendMessage(nested)).toBe(
      "The primary (default) account cannot be deleted. Make another account primary first.",
    );
  });

  it.each([
    ["Account already exists", "Account already exists"],
    ["{not json", "{not json"],
    ['{"message":""}', '{"message":""}'],
    ['{"other":1}', '{"other":1}'],
    ["  padded  ", "padded"],
  ])("falls back to %j as-is", (input, out) => expect(parseBackendMessage(input)).toBe(out));

  it.each([undefined, null, 42, {}])("gives a generic message for %j", (input) =>
    expect(parseBackendMessage(input)).toBe("Something went wrong"),
  );
});

describe("delete helpers", () => {
  it("masks all but the last four digits", () => {
    expect(maskAccountNumber("5555500001")).toBe("••••0001");
    expect(maskAccountNumber("")).toBe("••••");
  });

  it("reads the delete result from the envelope and requires deleted: true", () => {
    const data = { deleted: true, id: "x", bankName: "Delete Test Bank", accountNumber: "5555500001", remaining: 3 };
    expect(extractDeleteResult({ data })?.remaining).toBe(3);
    expect(extractDeleteResult({ ...data })?.id).toBe("x");
    expect(extractDeleteResult({ data: { ...data, deleted: false } })).toBeNull();
    expect(extractDeleteResult({ message: "ok" })).toBeNull();
  });

  it("knows when deleting would remove the only visible account", () => {
    const hiddenGtb = { ...gtb, isActive: false };
    expect(isLastVisibleAccount(access, [hiddenGtb, access])).toBe(true);
    expect(isLastVisibleAccount(access, [gtb, access])).toBe(false);
    expect(isLastVisibleAccount({ ...access, isActive: false }, [hiddenGtb, { ...access, isActive: false }])).toBe(false);
  });
});
