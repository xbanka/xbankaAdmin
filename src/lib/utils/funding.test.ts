import axios from "axios";
import { describe, expect, it } from "vitest";
import {
  buildCompletePayload,
  buildIntentParams,
  cleanBankReference,
  extractAttachmentUrl,
  extractIntentsPage,
  isAmountOverridden,
  formatNaira,
  isAccountNumber,
  isDuplicateResult,
  statusLabel,
  unwrapSettleResult,
} from "./funding";
import { estimatePagination } from "./pagination";
import { completeIntentSchema, rejectIntentSchema } from "../schema/funding-intent.schema";
import { intentsResponse } from "./funding.fixtures";

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

describe("estimatePagination", () => {
  it("treats a short page as the last page", () => {
    expect(estimatePagination(2, 10, 3)).toEqual({ hasNextPage: false, total: 13 });
  });

  it("assumes another page after a full one", () => {
    expect(estimatePagination(1, 10, 10)).toEqual({ hasNextPage: true, total: 11 });
  });
});
