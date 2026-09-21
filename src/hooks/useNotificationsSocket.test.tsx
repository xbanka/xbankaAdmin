import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNotificationsSocket } from "./useNotificationsSocket";
import { NOTIFICATIONS_QUERY_KEY } from "@/lib/services/notification.service";

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
