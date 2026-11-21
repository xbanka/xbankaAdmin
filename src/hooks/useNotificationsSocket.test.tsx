import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNotificationsSocket } from "./useNotificationsSocket";
import { NOTIFICATIONS_QUERY_KEY } from "@/lib/services/notification.service";
import { refreshAccessToken } from "@/lib/refresh-token";
import { useAuthStore } from "@/store/useAuthState";

vi.mock("@/lib/refresh-token", () => ({ refreshAccessToken: vi.fn() }));

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  onerror: ((ev: unknown) => void) | null = null;
  onclose: (() => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  close() {}
}

function emit(
  socket: FakeWebSocket,
  event: "notification:new" | "notification:updated",
  data: Record<string, unknown>,
) {
  socket.onmessage?.({ data: JSON.stringify({ event, data }) });
}

describe("useNotificationsSocket", () => {
  const originalWebSocket = global.WebSocket;
  let queryClient: QueryClient;

  beforeEach(() => {
    FakeWebSocket.instances = [];
    // @ts-expect-error -- test stub, doesn't implement the full WebSocket API
    global.WebSocket = FakeWebSocket;
    queryClient = new QueryClient();
  });

  afterEach(() => {
    global.WebSocket = originalWebSocket;
  });

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  it("invalidates the notifications query on a STAFF_ACCOUNT push carrying a CONFIRM_ROLE_CHANGE action, so the popup (which reads the notification feed directly) surfaces without waiting on the 60s poll", () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useNotificationsSocket({ token: "t" }), { wrapper });
    const socket = FakeWebSocket.instances[0];

    emit(socket, "notification:new", {
      id: "n1",
      reference_type: "STAFF_ACCOUNT",
      status: "ACTIVE",
      is_read: false,
      message: "role change",
      action: { type: "CONFIRM_ROLE_CHANGE", role_change_id: "rc-1" },
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: NOTIFICATIONS_QUERY_KEY,
    });
  });

  it("also invalidates the notifications query for a STAFF_ACCOUNT push that carries no action (e.g. a password change) — this hook doesn't discriminate, the popup and bell CTA do that by reading action.type themselves", () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useNotificationsSocket({ token: "t" }), { wrapper });
    const socket = FakeWebSocket.instances[0];

    emit(socket, "notification:new", {
      id: "n2",
      reference_type: "STAFF_ACCOUNT",
      status: "ACTIVE",
      is_read: false,
      message: "Your password was changed",
      action: null,
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: NOTIFICATIONS_QUERY_KEY,
    });
  });

  describe("a handshake the server rejects (expired token)", () => {
    const refresh = vi.mocked(refreshAccessToken);

    beforeEach(() => {
      refresh.mockReset();
      vi.spyOn(useAuthStore.getState(), "login").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

    it("refreshes the token once when the socket closes without ever opening", async () => {
      refresh.mockResolvedValue("fresh");

      renderHook(() => useNotificationsSocket({ token: "stale" }), { wrapper });
      FakeWebSocket.instances[0].onclose?.();
      await flush();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(useAuthStore.getState().login).toHaveBeenCalledWith("fresh");
    });

    it("does not refresh when a socket that had opened drops", async () => {
      renderHook(() => useNotificationsSocket({ token: "t" }), { wrapper });
      const socket = FakeWebSocket.instances[0];
      socket.onopen?.();
      socket.onclose?.();
      await flush();

      expect(refresh).not.toHaveBeenCalled();
    });

    it("refreshes only once per streak, then backs off if the fresh token is rejected too", async () => {
      vi.useFakeTimers();
      refresh.mockResolvedValue("fresh");

      const { rerender } = renderHook(
        ({ token }) => useNotificationsSocket({ token }),
        { wrapper, initialProps: { token: "stale" } },
      );
      FakeWebSocket.instances[0].onclose?.();
      await vi.advanceTimersByTimeAsync(0);
      rerender({ token: "fresh" }); // what the store update does

      const retry = FakeWebSocket.instances.at(-1)!;
      retry.onclose?.();
      await vi.advanceTimersByTimeAsync(1000);

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(FakeWebSocket.instances.length).toBeGreaterThan(2);
      vi.useRealTimers();
    });

    it("stops reconnecting when the refresh itself is refused (session over)", async () => {
      vi.useFakeTimers();
      refresh.mockRejectedValue({ response: { status: 401 } });

      renderHook(() => useNotificationsSocket({ token: "stale" }), { wrapper });
      FakeWebSocket.instances[0].onclose?.();
      await vi.advanceTimersByTimeAsync(60_000);

      expect(FakeWebSocket.instances).toHaveLength(1);
      vi.useRealTimers();
    });
  });

  it("never invalidates the profile query — real-time role-change delivery now runs entirely through the notifications query, not /erp/me", () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useNotificationsSocket({ token: "t" }), { wrapper });
    const socket = FakeWebSocket.instances[0];

    emit(socket, "notification:new", {
      id: "n3",
      reference_type: "STAFF_ACCOUNT",
      status: "ACTIVE",
      is_read: false,
      action: { type: "CONFIRM_ROLE_CHANGE", role_change_id: "rc-2" },
    });

    expect(invalidateSpy).not.toHaveBeenCalledWith({
      queryKey: ["userProfile"],
    });
  });
});
