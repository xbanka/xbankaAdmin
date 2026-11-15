import { describe, expect, it } from "vitest";
import { extractEnvelopePage } from "./pagination";

const identity = (row: unknown) => row;

describe("extractEnvelopePage", () => {
  it("reads rows, total and pages from the envelope", () => {
    const body = { page: 2, limit: 10, total: 42, pages: 5, data: [{ id: "a" }, { id: "b" }] };

    expect(extractEnvelopePage(body, identity, 2)).toEqual({
      rows: [{ id: "a" }, { id: "b" }],
      total: 42,
      pages: 5,
      hasNextPage: true,
    });
  });

  it("has no next page on the last page", () => {
    const body = { page: 5, limit: 10, total: 42, pages: 5, data: [{ id: "a" }] };

    expect(extractEnvelopePage(body, identity, 5).hasNextPage).toBe(false);
  });

  it("handles no matches", () => {
    const body = { page: 1, limit: 10, total: 0, pages: 0, data: [] };

    expect(extractEnvelopePage(body, identity)).toEqual({
      rows: [],
      total: 0,
      pages: 0,
      hasNextPage: false,
    });
  });

  it("keeps the real total for a page past the end", () => {
    const body = { page: 9, limit: 10, total: 42, pages: 5, data: [] };

    expect(extractEnvelopePage(body, identity, 9)).toMatchObject({ rows: [], total: 42, pages: 5 });
  });

  it("maps each row", () => {
    const body = { page: 1, limit: 10, total: 1, pages: 1, data: [{ id: "a" }] };

    expect(extractEnvelopePage(body, (r: { id: string }) => r.id.toUpperCase()).rows).toEqual(["A"]);
  });

  it("tolerates a missing body", () => {
    expect(extractEnvelopePage(undefined, identity)).toMatchObject({ rows: [], total: 0, pages: 0 });
  });
});
