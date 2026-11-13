import axios from "axios";
import { describe, expect, it } from "vitest";
import {
  buildCompletePayload,
  buildDirectCreditPayload,
  buildIntentParams,
  classifyCreditError,
  cleanBankReference,
  customerDisplayName,
  extractAttachmentUrl,
  extractIntentsPage,
  extractLookupMatches,
  getMatchBlocker,
  hasAtMostTwoDecimals,
  hasNoWalletYet,
  isAmountOverridden,
  formatNaira,
  isAccountNumber,
  isDuplicateResult,
  statusLabel,
  storedReference,
  unwrapSettleResult,
} from "./funding";
import { estimatePagination } from "./pagination";
import {
  completeIntentSchema,
  directCreditSchema,
  rejectIntentSchema,
} from "../schema/funding-intent.schema";
import { intentsResponse, lookupMatch } from "./funding.fixtures";

const toQuery = (params: object) => axios.getUri({ url: "/x", params }).split("?")[1] ?? "";

describe("buildIntentParams", () => {
  it("sends the backend's upper-case status enum", () => {
    expect(toQuery(buildIntentParams({ status: "pending", page: 1, limit: 10 }))).toBe(
      "status=PENDING&page=1&limit=10",
    );
  });

  it("sends a full 10-digit account number", () => {
    expect(
      toQuery(buildIntentParams({ status: "completed", accountNumber: "0000000001", page: 2, limit: 20 })),
    ).toBe("status=COMPLETED&accountNumber=0000000001&page=2&limit=20");
  });

  it.each(["", "   ", "123", "123456789", "12345678901", "12345abcde"])(
    "omits account number %j instead of earning a 422",
    (accountNumber) => {
      expect(buildIntentParams({ accountNumber }).accountNumber).toBeUndefined();
    },
  );

  it("sends status=ALL for the All tab (a missing status would mean PENDING)", () => {
    expect(toQuery(buildIntentParams({ status: "all", page: 1, limit: 10 }))).toBe(
      "status=ALL&page=1&limit=10",
    );
  });

  it("omits a blank status so the backend default (PENDING) applies", () => {
    expect(buildIntentParams({ status: " " }).status).toBeUndefined();
  });
});

describe("isAccountNumber", () => {
  it("accepts exactly 10 digits, trimming whitespace", () => {
    expect(isAccountNumber(" 0123456789 ")).toBe(true);
    expect(isAccountNumber("012345678")).toBe(false);
  });
});

describe("extractIntentsPage", () => {
  it("reads the documented { items, meta } body", () => {
    const page = extractIntentsPage(intentsResponse);
    expect(page.items).toHaveLength(1);
    expect(page.items[0].registeredFundingAccounts[0].accountNumber).toBe("0000000001");
    expect(page.meta).toEqual({
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 20,
      totalPages: 1,
      currentPage: 1,
    });
  });

  it("also reads it wrapped as { data: { items, meta } }", () => {
    expect(extractIntentsPage({ message: "ok", data: intentsResponse }).items).toHaveLength(1);
  });

  it.each([null, undefined, {}, { data: null }, { items: "nope" }])(
    "returns an empty page for %j",
    (body) => {
      const page = extractIntentsPage(body, 10);
      expect(page.items).toEqual([]);
      expect(page.meta.totalItems).toBe(0);
      expect(page.meta.itemsPerPage).toBe(10);
    },
  );
});

describe("settle results", () => {
  const complete = {
    duplicate: false,
    transactionId: "3f6c1d52-8a41-4b7e-9c0d-2e5a7b1f4c90",
    reference: "NIP240815123456789",
    declaredAmount: 5000,
    amount: 5000,
    balance: 16000,
    completedAt: "2026-10-15T18:02:44.118Z",
  };

  it("passes a bare result through", () => {
    expect(unwrapSettleResult(complete)).toBe(complete);
  });

  it("unwraps { data: result }", () => {
    expect(unwrapSettleResult({ message: "ok", data: complete })).toBe(complete);
  });

  it("flags duplicate retries, bare or wrapped", () => {
    expect(isDuplicateResult({ ...complete, duplicate: true })).toBe(true);
    expect(isDuplicateResult({ data: { ...complete, duplicate: true } })).toBe(true);
    expect(isDuplicateResult(complete)).toBe(false);
    expect(isDuplicateResult(undefined)).toBe(false);
  });
});

describe("extractAttachmentUrl", () => {
  it.each([
    [{ url: "https://s3/a.png" }, "https://s3/a.png"],
    [{ data: { url: "https://s3/b.png" } }, "https://s3/b.png"],
    [{ fileUrl: "https://s3/c.png" }, "https://s3/c.png"],
    [{ data: { attachmentUrl: "https://s3/d.png" } }, "https://s3/d.png"],
    [{ data: "https://s3/e.png" }, "https://s3/e.png"],
  ])("finds the URL in %j", (body, url) => {
    expect(extractAttachmentUrl(body)).toBe(url);
  });

  it("returns null when there is none", () => {
    expect(extractAttachmentUrl({ message: "ok" })).toBeNull();
    expect(extractAttachmentUrl({ url: "" })).toBeNull();
  });
});

describe("isAmountOverridden", () => {
  it.each([
    ["5000", 5000, false],
    ["5000.00", 5000, false],
    ["4800", 5000, true],
    ["5200", 5000, true],
    ["", 5000, false],
    ["abc", 5000, false],
  ])("%j vs declared %d -> %s", (amount, declared, expected) => {
    expect(isAmountOverridden(amount, declared)).toBe(expected);
  });
});

describe("buildCompletePayload", () => {
  const base = { bankReference: "  NIP240815123456789 ", amount: "5000", overrideReason: "", fundingAccountId: "" };
  const ctx = { declaredAmount: 5000, creditedBy: "ops@xbanka.com" };

  it("sends only the required fields when nothing optional was touched", () => {
    expect(buildCompletePayload(base, ctx)).toEqual({
      bankReference: "NIP240815123456789",
      creditedBy: "ops@xbanka.com",
    });
  });

  it("leaves amount out when it matches the declared figure, even with a stray reason", () => {
    const payload = buildCompletePayload({ ...base, overrideReason: "ignored" }, ctx);
    expect(payload).not.toHaveProperty("amount");
    expect(payload).not.toHaveProperty("overrideReason");
  });

  it("sends amount and the trimmed reason together when the amount changed", () => {
    expect(
      buildCompletePayload(
        { ...base, amount: "48000", overrideReason: " Sent 48k " },
        { ...ctx, declaredAmount: 50000 },
      ),
    ).toEqual({
      bankReference: "NIP240815123456789",
      creditedBy: "ops@xbanka.com",
      amount: 48000,
      overrideReason: "Sent 48k",
    });
  });

  it("adds fundingAccountId and attachmentUrls only when present", () => {
    expect(
      buildCompletePayload({ ...base, fundingAccountId: "b7d2" }, { ...ctx, attachmentUrls: ["https://s3/a.png"] }),
    ).toEqual({
      bankReference: "NIP240815123456789",
      creditedBy: "ops@xbanka.com",
      fundingAccountId: "b7d2",
      attachmentUrls: ["https://s3/a.png"],
    });
  });

  it("never sends null or empty strings", () => {
    const payload = buildCompletePayload(base, { ...ctx, attachmentUrls: [] });
    expect(Object.values(payload).every((v) => v !== null && v !== "")).toBe(true);
    expect(payload).not.toHaveProperty("attachmentUrls");
  });
});

describe("completeIntentSchema", () => {
  const schema = completeIntentSchema(5000);
  const valid = { bankReference: "NIP1", amount: "5000", overrideReason: "", fundingAccountId: "" };

  it("accepts the declared amount with no reason", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("requires a reason once the amount differs (the backend 422s otherwise)", () => {
    const result = schema.safeParse({ ...valid, amount: "4800" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["overrideReason"]);
    expect(schema.safeParse({ ...valid, amount: "4800", overrideReason: "Sent 4.8k" }).success).toBe(true);
  });

  it.each([
    ["blank reference", { ...valid, bankReference: "  " }],
    ["zero amount", { ...valid, amount: "0" }],
    ["empty amount", { ...valid, amount: "" }],
    ["whitespace reason on a changed amount", { ...valid, amount: "1", overrideReason: "  " }],
  ])("rejects %s", (_, values) => {
    expect(schema.safeParse(values).success).toBe(false);
  });
});

describe("rejectIntentSchema", () => {
  it("requires a non-blank reason", () => {
    expect(rejectIntentSchema.safeParse({ reason: "  " }).success).toBe(false);
    expect(rejectIntentSchema.safeParse({ reason: "No credit" }).success).toBe(true);
  });
});

describe("cleanBankReference", () => {
  it.each([
    ["NIP/20261015/000123\n", "NIP/20261015/000123"],
    ["  NIP240815123456789\r\n", "NIP240815123456789"],
    ["\tFT26287XYZ\t", "FT26287XYZ"],
  ])("strips copy-paste whitespace from %j", (raw, clean) => {
    expect(cleanBankReference(raw)).toBe(clean);
  });

  it("never changes case or punctuation inside the reference", () => {
    expect(cleanBankReference("nip/2026-10/abc.1")).toBe("nip/2026-10/abc.1");
  });
});

describe("formatting", () => {
  it("formats naira", () => {
    expect(formatNaira(25000)).toBe("₦25,000");
    expect(formatNaira(10, "USD")).toBe("USD 10");
  });

  it("labels statuses", () => {
    expect(statusLabel("PENDING")).toBe("Pending");
    expect(statusLabel("")).toBe("-");
  });
});

describe("extractLookupMatches", () => {
  it("accepts the bare array or one wrapped in { data }", () => {
    expect(extractLookupMatches([lookupMatch])).toEqual([lookupMatch]);
    expect(extractLookupMatches({ data: [lookupMatch] })).toEqual([lookupMatch]);
  });

  it("reads a real response: wrapped in { data } with `bankName` and a full wallet", () => {
    // Copied from a staging response for GET /funding/lookup.
    const body = {
      message: "Request successful",
      details: "",
      errorGroup: "",
      data: [
        {
          fundingAccountId: "a45400ee-4fcc-40b9-aeae-04aaf6b7c58a",
          bankName: "Paycom (Opay)",
          bankCode: "305",
          accountNumber: "7017796046",
          accountName: "JOSHUA OSAYANEDE OLOTON",
          customer: {
            userId: "cd0baeb0-084d-48b0-9f3b-18b5c827601d",
            xbId: "XB-KZWJ9",
            email: "customer@example.com",
            isActive: true,
            name: "Joshua Oloton",
          },
          wallet: { id: "4147cfeb-a6a5-4fc5-a647-79e8744090ca", balance: 1200, currency: "NGN" },
        },
      ],
    };

    const [match] = extractLookupMatches(body);

    expect(match.bankName).toBe("Paycom (Opay)");
    expect(match.wallet).toEqual({ id: "4147cfeb-a6a5-4fc5-a647-79e8744090ca", balance: 1200, currency: "NGN" });
    expect(getMatchBlocker(match)).toBeNull();
  });

  it("also accepts the doc's `bank` spelling as the bank name", () => {
    const { bankName, ...rest } = lookupMatch;
    const [match] = extractLookupMatches([{ ...rest, bank: bankName }]);
    expect(match.bankName).toBe("Paycom (Opay)");
  });

  it("falls back to an empty bank name rather than undefined", () => {
    const { bankName, ...rest } = lookupMatch;
    void bankName;
    const [match] = extractLookupMatches([rest]);
    expect(match.bankName).toBe("");
  });

  it("returns no matches for an empty or malformed body", () => {
    expect(extractLookupMatches([])).toEqual([]);
    expect(extractLookupMatches(undefined)).toEqual([]);
    expect(extractLookupMatches({ message: "nope" })).toEqual([]);
  });
});

describe("getMatchBlocker", () => {
  it("lets an active customer with an NGN wallet through", () => {
    expect(getMatchBlocker(lookupMatch)).toBeNull();
  });

  it("blocks a suspended customer", () => {
    const suspended = { ...lookupMatch, customer: { ...lookupMatch.customer, isActive: false } };
    expect(getMatchBlocker(suspended)).toBe("suspended");
  });

  it("does not block a customer with no NGN wallet: the credit creates it", () => {
    expect(getMatchBlocker({ ...lookupMatch, wallet: null })).toBeNull();
  });

  it("still blocks a suspended customer who also has no wallet", () => {
    const both = { ...lookupMatch, wallet: null, customer: { ...lookupMatch.customer, isActive: false } };
    expect(getMatchBlocker(both)).toBe("suspended");
  });
});

describe("hasNoWalletYet", () => {
  it("is true only when the lookup carries no wallet", () => {
    expect(hasNoWalletYet({ ...lookupMatch, wallet: null })).toBe(true);
    expect(hasNoWalletYet(lookupMatch)).toBe(false);
  });
});

describe("customerDisplayName", () => {
  it("uses the name when there is one", () => {
    expect(customerDisplayName({ name: "Ada Tester", email: "a@x.com" })).toBe("Ada Tester");
  });

  it("falls back to the email when the backend sends a null name", () => {
    expect(customerDisplayName({ name: null, email: "a@x.com" })).toBe("a@x.com");
    expect(customerDisplayName({ name: "   ", email: "a@x.com" })).toBe("a@x.com");
  });

  it("falls back to a placeholder when there is neither", () => {
    expect(customerDisplayName({ name: null, email: null })).toBe("Unnamed customer");
  });
});

describe("storedReference", () => {
  it("prefixes BANKFUND- and trims and uppercases like the core backend", () => {
    expect(storedReference("  100004abc123 ")).toBe("BANKFUND-100004ABC123");
  });
});

describe("hasAtMostTwoDecimals", () => {
  it("allows up to two decimal places", () => {
    expect(hasAtMostTwoDecimals("2000")).toBe(true);
    expect(hasAtMostTwoDecimals("2000.5")).toBe(true);
    expect(hasAtMostTwoDecimals("2000.55")).toBe(true);
    expect(hasAtMostTwoDecimals("2000.555")).toBe(false);
  });
});

describe("buildDirectCreditPayload", () => {
  const ids = { fundingAccountId: lookupMatch.fundingAccountId, creditedBy: "ops@xbanka.com" };

  it("sends a numeric amount and a trimmed reference, omitting empty attachments", () => {
    expect(buildDirectCreditPayload({ amount: "2000", bankReference: "  REF12345  " }, ids)).toEqual({
      fundingAccountId: lookupMatch.fundingAccountId,
      amount: 2000,
      reference: "REF12345",
      creditedBy: "ops@xbanka.com",
    });
  });

  it("includes attachment URLs only when there are some", () => {
    const payload = buildDirectCreditPayload(
      { amount: "10.5", bankReference: "REF12345" },
      { ...ids, attachmentUrls: ["https://s3/a.png"] },
    );
    expect(payload.amount).toBe(10.5);
    expect(payload.attachmentUrls).toEqual(["https://s3/a.png"]);
  });
});

describe("classifyCreditError", () => {
  it("treats network trouble, timeouts and 5xx as safe to retry", () => {
    expect(classifyCreditError({ status: 408 })).toBe("retry");
    expect(classifyCreditError({ status: 502 })).toBe("retry");
    expect(classifyCreditError({ status: 503 })).toBe("retry");
    expect(classifyCreditError({})).toBe("retry");
    expect(classifyCreditError(undefined)).toBe("retry");
  });

  it("never retries a 409 and sends a 404 back to the lookup", () => {
    expect(classifyCreditError({ status: 409 })).toBe("reference-conflict");
    expect(classifyCreditError({ status: 404 })).toBe("not-found");
  });

  it("shows other refusals as-is", () => {
    expect(classifyCreditError({ status: 403 })).toBe("rejected");
    expect(classifyCreditError({ status: 400 })).toBe("rejected");
  });
});

describe("directCreditSchema", () => {
  const valid = { bankReference: "REF12345", amount: "2000" };

  it("accepts a valid form", () => {
    expect(directCreditSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a reference of 4 to 100 characters, after trimming", () => {
    expect(directCreditSchema.safeParse({ ...valid, bankReference: "abc" }).success).toBe(false);
    expect(directCreditSchema.safeParse({ ...valid, bankReference: "  abc  " }).success).toBe(false);
    expect(directCreditSchema.safeParse({ ...valid, bankReference: "abcd" }).success).toBe(true);
    expect(directCreditSchema.safeParse({ ...valid, bankReference: "x".repeat(100) }).success).toBe(true);
    expect(directCreditSchema.safeParse({ ...valid, bankReference: "x".repeat(101) }).success).toBe(false);
  });

  it("requires at least 0.01 with at most 2 decimals", () => {
    expect(directCreditSchema.safeParse({ ...valid, amount: "" }).success).toBe(false);
    expect(directCreditSchema.safeParse({ ...valid, amount: "0" }).success).toBe(false);
    expect(directCreditSchema.safeParse({ ...valid, amount: "0.009" }).success).toBe(false);
    expect(directCreditSchema.safeParse({ ...valid, amount: "0.01" }).success).toBe(true);
    expect(directCreditSchema.safeParse({ ...valid, amount: "10.555" }).success).toBe(false);
  });
});

describe("estimatePagination", () => {
  it("treats a short page as the last page", () => {
    expect(estimatePagination(2, 10, 3)).toEqual({ hasNextPage: false, total: 13 });
  });

  it("assumes another page after a full one", () => {
    expect(estimatePagination(1, 10, 10)).toEqual({ hasNextPage: true, total: 11 });
  });
});
