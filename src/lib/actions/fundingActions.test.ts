import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, post } = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock("../Axiosinstance/axiosInstance", () => ({ default: { get, post } }));

import {
  completeFundingIntent,
  getFundingIntents,
  rejectFundingIntent,
  uploadFundingAttachment,
} from "./fundingActions";

const toQuery = (params: object) => axios.getUri({ url: "/x", params }).split("?")[1] ?? "";
const ID = "3f6c1d52-8a41-4b7e-9c0d-2e5a7b1f4c90";

beforeEach(() => {
  get.mockReset();
  post.mockReset();
  get.mockResolvedValue({ data: { items: [], meta: {} }, status: 200 });
  post.mockResolvedValue({ data: { duplicate: false }, status: 200 });
});

describe("getFundingIntents", () => {
  it("hits /intents with status, a full account number, page and limit", async () => {
    await getFundingIntents({ status: "pending", accountNumber: "0000000001", page: 1, limit: 20 });

    expect(get.mock.calls[0][0]).toBe("/api/transactions/funding/intents");
    expect(toQuery(get.mock.calls[0][1].params)).toBe(
      "status=PENDING&accountNumber=0000000001&page=1&limit=20",
    );
  });

  it("never sends a partial account number", async () => {
    await getFundingIntents({ accountNumber: "00000" });
    expect(toQuery(get.mock.calls[0][1].params)).toBe("page=1&limit=10");
  });

  it("rethrows as { success: false, status, message }", async () => {
    get.mockRejectedValue({ status: 422, message: "bad accountNumber" });
    await expect(getFundingIntents()).rejects.toEqual({
      success: false,
      status: 422,
      message: "bad accountNumber",
    });
  });
});

describe("completeFundingIntent", () => {
  it("POSTs the payload to /intents/{id}/complete", async () => {
    const payload = { bankReference: "NIP240815123456789", creditedBy: "ops@xbanka.com" };
    await completeFundingIntent({ transactionId: ID, payload });
    expect(post).toHaveBeenCalledWith(`/api/transactions/funding/intents/${ID}/complete`, payload);
  });

  it("keeps the 409 status so the list can be refreshed", async () => {
    post.mockRejectedValue({ status: 409, message: "Bank reference already used" });
    await expect(
      completeFundingIntent({ transactionId: ID, payload: { bankReference: "r", creditedBy: "c" } }),
    ).rejects.toMatchObject({ status: 409, message: "Bank reference already used" });
  });
});

describe("rejectFundingIntent", () => {
  it("POSTs rejectedBy and reason to /intents/{id}/reject", async () => {
    const payload = { rejectedBy: "ops@xbanka.com", reason: "No matching credit" };
    await rejectFundingIntent({ transactionId: ID, payload });
    expect(post).toHaveBeenCalledWith(`/api/transactions/funding/intents/${ID}/reject`, payload);
  });
});

describe("uploadFundingAttachment", () => {
  it("sends multipart with the file under the `file` field", async () => {
    const file = new File(["x"], "proof.png", { type: "image/png" });
    await uploadFundingAttachment(file);

    const [url, body, config] = post.mock.calls[0];
    expect(url).toBe("/api/transactions/funding/attachments");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("file")).toBe(file);
    expect(config.headers["Content-Type"]).toBe("multipart/form-data");
  });
});
