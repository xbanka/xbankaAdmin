import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mocks = vi.hoisted(() => ({
  loginAction: vi.fn(),
  verifyLogin2fa: vi.fn(),
  push: vi.fn(),
  setToken: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/actions/actions", () => ({ loginAction: mocks.loginAction }));
vi.mock("@/lib/actions/twoFactorActions", () => ({
  verifyLogin2fa: mocks.verifyLogin2fa,
}));
vi.mock("@/lib/authToken", () => ({
  authToken: { set: mocks.setToken, get: vi.fn(), remove: vi.fn() },
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("sonner", () => ({ toast: mocks.toast }));

import LoginForm from "./login-form";

const MFA = {
  access_token: null,
  token_type: null,
  mfa_required: true,
  mfa_token: "mfa-token",
};

function renderForm() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<LoginForm />, { wrapper });
}

type User = ReturnType<typeof userEvent.setup>;

async function signIn(user: User) {
  await user.type(screen.getByPlaceholderText("john@example.com"), "ops@xbanka.com");
  await user.type(screen.getByPlaceholderText("Enter your password"), "Secret123!");
  await user.click(screen.getByRole("button", { name: "Sign In" }));
}

async function enterTotp(user: User, code: string) {
  await user.click(screen.getByLabelText("Digit 1 of 6"));
  await user.paste(code);
}

beforeEach(() => {
  Object.values(mocks).forEach((m) => typeof m === "function" && m.mockReset());
  Object.values(mocks.toast).forEach((m) => m.mockReset());
});
afterEach(() => {
  vi.useRealTimers();
});

describe("login without 2FA", () => {
  it("signs straight in, unchanged from before", async () => {
    mocks.loginAction.mockResolvedValue({
      data: { access_token: "tok", token_type: "bearer", mfa_required: false, mfa_token: null },
    });
    const user = userEvent.setup();
    renderForm();

    await signIn(user);

    await waitFor(() => expect(mocks.setToken).toHaveBeenCalledWith("tok"));
    expect(mocks.push).toHaveBeenCalledWith("/");
    expect(screen.queryByText("Two-factor authentication")).not.toBeInTheDocument();
  });
});

describe("login with 2FA", () => {
  it("stores nothing after the password and asks for a code", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    const user = userEvent.setup();
    renderForm();

    await signIn(user);

    expect(await screen.findByText("Two-factor authentication")).toBeInTheDocument();
    expect(mocks.setToken).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
    // Other stores persist here; the mfa_token must never be among them.
    const stored = Object.keys(window.localStorage).map((k) => window.localStorage.getItem(k));
    expect(stored.join("|")).not.toContain("mfa-token");
    expect(document.cookie).not.toContain("mfa-token");
  });

  it("signs in with an authenticator code", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    mocks.verifyLogin2fa.mockResolvedValue({ data: { access_token: "session", token_type: "bearer" } });
    const user = userEvent.setup();
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");

    const verify = screen.getByRole("button", { name: "Verify" });
    expect(verify).toBeDisabled();
    await enterTotp(user, "123456");
    await user.click(verify);

    await waitFor(() => expect(mocks.setToken).toHaveBeenCalledWith("session"));
    expect(mocks.verifyLogin2fa).toHaveBeenCalledWith({ mfa_token: "mfa-token", code: "123456" });
    expect(mocks.push).toHaveBeenCalledWith("/");
  });

  it("signs in with a recovery code, normalised", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    mocks.verifyLogin2fa.mockResolvedValue({ data: { access_token: "session", token_type: "bearer" } });
    const user = userEvent.setup();
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");

    await user.click(screen.getByRole("button", { name: "Use a recovery code instead" }));
    await user.type(screen.getByLabelText("Recovery code"), "abcde fghjk");
    await user.click(screen.getByRole("button", { name: "Verify" }));

    await waitFor(() =>
      expect(mocks.verifyLogin2fa).toHaveBeenCalledWith({ mfa_token: "mfa-token", code: "ABCDE-FGHJK" }),
    );
  });

  it("shows a wrong code inline, clears it, and lets them retry", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    mocks.verifyLogin2fa.mockRejectedValueOnce({ status: 401, message: "Invalid code." });
    const user = userEvent.setup();
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");

    await enterTotp(user, "111111");
    await user.click(screen.getByRole("button", { name: "Verify" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That code didn't work");
    expect(screen.getByLabelText("Digit 1 of 6")).toHaveValue("");
    expect(mocks.setToken).not.toHaveBeenCalled();

    mocks.verifyLogin2fa.mockResolvedValue({ data: { access_token: "session", token_type: "bearer" } });
    await enterTotp(user, "222222");
    await user.click(screen.getByRole("button", { name: "Verify" }));
    await waitFor(() => expect(mocks.setToken).toHaveBeenCalledWith("session"));
  });

  it("goes back to the password screen when the 2FA session expired", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    mocks.verifyLogin2fa.mockRejectedValue({ status: 401, message: "2FA session expired. Log in again." });
    const user = userEvent.setup();
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");

    await enterTotp(user, "123456");
    await user.click(screen.getByRole("button", { name: "Verify" }));

    expect(await screen.findByText("2FA session expired. Log in again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("locks the step after too many attempts", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    mocks.verifyLogin2fa.mockRejectedValue({ status: 429, message: "Too many failed attempts. Try again later." });
    const user = userEvent.setup();
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");

    await enterTotp(user, "123456");
    await user.click(screen.getByRole("button", { name: "Verify" }));

    expect(await screen.findByText(/Too many failed attempts/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verify" })).toBeDisabled();
    expect(screen.getByLabelText("Digit 1 of 6")).toBeDisabled();
  });

  it("returns to the password screen when the 5-minute token runs out", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mocks.loginAction.mockResolvedValue({ data: MFA });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");
    expect(screen.getByText("Expires in 5:00")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
    });

    expect(screen.getByText(/sign-in session expired/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(mocks.verifyLogin2fa).not.toHaveBeenCalled();
  });

  it("Back to sign in drops the token", async () => {
    mocks.loginAction.mockResolvedValue({ data: MFA });
    const user = userEvent.setup();
    renderForm();
    await signIn(user);
    await screen.findByText("Two-factor authentication");

    await user.click(screen.getByRole("button", { name: "Back to sign in" }));
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.queryByText("Two-factor authentication")).not.toBeInTheDocument();
  });
});
