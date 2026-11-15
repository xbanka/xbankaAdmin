import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

vi.mock("@/lib/services/funding.service", () => ({ uploadProofFile: vi.fn() }));

import { useProofUploads } from "./proof-upload-field";

const file = (name: string) => ({ file: new File(["x"], name, { type: "image/png" }) });

const originalRevoke = URL.revokeObjectURL;

afterEach(() => {
  URL.revokeObjectURL = originalRevoke;
});

describe("useProofUploads", () => {
  it("uploads every file and reports their URLs when there is no cap", async () => {
    const upload = vi.fn(async (f: File) => `https://s3/${f.name}`);
    const { result } = renderHook(() => useProofUploads(upload));

    act(() => result.current.add([file("a.png"), file("b.png"), file("c.png")]));

    await waitFor(() => expect(result.current.urls).toHaveLength(3));
    expect(upload).toHaveBeenCalledTimes(3);
    expect(result.current.isFull).toBe(false);
  });

  it("stops at the cap: extra files are dropped, not uploaded", async () => {
    const upload = vi.fn(async (f: File) => `https://s3/${f.name}`);
    const { result } = renderHook(() => useProofUploads(upload, { max: 5 }));

    act(() => result.current.add(["1", "2", "3", "4", "5", "6", "7"].map((n) => file(`${n}.png`))));

    await waitFor(() => expect(result.current.urls).toHaveLength(5));
    expect(upload).toHaveBeenCalledTimes(5);
    expect(result.current.uploads).toHaveLength(5);
    expect(result.current.isFull).toBe(true);
  });

  it("counts files already added toward the cap", async () => {
    const upload = vi.fn(async (f: File) => `https://s3/${f.name}`);
    const { result } = renderHook(() => useProofUploads(upload, { max: 5 }));

    act(() => result.current.add(["1", "2", "3", "4"].map((n) => file(`${n}.png`))));
    await waitFor(() => expect(result.current.urls).toHaveLength(4));
    act(() => result.current.add([file("5.png"), file("6.png")]));

    await waitFor(() => expect(result.current.urls).toHaveLength(5));
    expect(upload).toHaveBeenCalledTimes(5);
  });

  it("frees the preview URL of a file it drops", () => {
    const revoke = vi.fn();
    URL.revokeObjectURL = revoke;
    const upload = vi.fn(async () => "https://s3/x");
    const { result } = renderHook(() => useProofUploads(upload, { max: 1 }));

    act(() =>
      result.current.add([
        { ...file("keep.png"), previewUrl: "blob:keep" },
        { ...file("drop.png"), previewUrl: "blob:drop" },
      ]),
    );

    expect(revoke).toHaveBeenCalledWith("blob:drop");
    expect(revoke).not.toHaveBeenCalledWith("blob:keep");
  });

  it("makes room again when a file is removed", async () => {
    const upload = vi.fn(async (f: File) => `https://s3/${f.name}`);
    const { result } = renderHook(() => useProofUploads(upload, { max: 1 }));

    act(() => result.current.add([file("a.png")]));
    await waitFor(() => expect(result.current.isFull).toBe(true));

    act(() => result.current.remove(result.current.uploads[0].id));
    expect(result.current.isFull).toBe(false);
  });
});
