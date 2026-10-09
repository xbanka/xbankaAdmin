import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("../Axiosinstance/axiosInstance", () => ({ default: { get } }));

import { buildAuditLogParams, getLoginLogs, getRoleChangeLogs } from "./auditLogActions";

// Serialize exactly the way axios will on the wire, so the assertion is on
// the real query string the backend sees.
const toQuery = (params: object) => axios.getUri({ url: "/x", params }).split("?")[1] ?? "";

describe("buildAuditLogParams", () => {
  it("omits blank status and search (the 'All status' filter)", () => {
    expect(toQuery(buildAuditLogParams({ status: "", search: "", page: 1, limit: 10 }))).toBe(
      "page=1&limit=10",
    );
  });

  it("omits whitespace-only search", () => {
    expect(buildAuditLogParams({ search: "   " }).search).toBeUndefined();
  });

  it("keeps real values", () => {
    expect(
      toQuery(buildAuditLogParams({ status: "PENDING", search: "ada", page: 2, limit: 10 })),
    ).toBe("status=PENDING&search=ada&page=2&limit=10");
  });
});

describe("audit log requests", () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue({ data: [], status: 200 });
  });

  it.each([
    ["role changes", getRoleChangeLogs, "/api/audit/role-changes"],
    ["logins", getLoginLogs, "/api/audit/logins"],
  ] as const)("%s request never sends status= or search=", async (_, fn, url) => {
    await fn({ status: "", search: "", page: 1, limit: 10 });

    expect(get).toHaveBeenCalledWith(url, {
      params: { status: undefined, search: undefined, page: 1, limit: 10 },
    });
    expect(toQuery(get.mock.calls[0][1].params)).toBe("page=1&limit=10");
  });
});
