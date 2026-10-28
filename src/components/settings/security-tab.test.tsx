import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mocks = vi.hoisted(() => ({
  getCurrentAffiliate: vi.fn(),
  start2faSetup: vi.fn(),
  enable2fa: vi.fn(),
  disable2fa: vi.fn(),
  regenerateRecoveryCodes: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/actions/userAction", () => ({ getCurrentAffiliate: mocks.getCurrentAffiliate }));
vi.mock("@/lib/actions/twoFactorActions", () => ({
  start2faSetup: mocks.start2faSetup,
  enable2fa: mocks.enable2fa,
  disable2fa: mocks.disable2fa,
  regenerateRecoveryCodes: mocks.regenerateRecoveryCodes,
  verifyLogin2fa: vi.fn(),
  resetStaff2fa: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: mocks.toast }));

import { SecurityTab } from "./security-tab";

const CODES = Array.from({ length: 10 }, (_, i) => `AAAA${i}-BBBB${i}`);
const SETUP = {
  secret: "JBSWY3DPEHPK3PXP",
  otpauth_uri: "otpauth://totp/Xbanka:ops%40xbanka.com?secret=JBSWY3DPEHPK3PXP&issuer=Xbanka",
};

function profile(totp_enabled: boolean) {
  return { success: true, status: 200, data: { email: "ops@xbanka.com", totp_enabled } };
}

function renderTab() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<SecurityTab />, { wrapper });
}

type User = ReturnType<typeof userEvent.setup>;

async function enterTotp(user: User, code: string) {
  await user.click(screen.getByLabelText("Digit 1 of 6"));
  await user.paste(code);
}

beforeEach(() => {
  Object.values(mocks).forEach((m) => typeof m === "function" && m.mockReset());
  Object.values(mocks.toast).forEach((m) => m.mockReset());
  mocks.start2faSetup.mockResolvedValue({ data: SETUP });
});

describe("Security tab status", () => {
  it("offers Turn on when 2FA is off, with no recovery row", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(false));
    renderTab();

    expect(await screen.findByRole("button", { name: "Turn on" })).toBeInTheDocument();
    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(screen.queryByText("Recovery codes")).not.toBeInTheDocument();
  });

  it("offers Turn off and new recovery codes when 2FA is on", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    renderTab();

    expect(await screen.findByRole("button", { name: "Turn off" })).toBeInTheDocument();
    expect(screen.getByText("On")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate new codes" })).toBeInTheDocument();
  });
});

describe("enabling 2FA", () => {
  it("scans, confirms, shows codes once, and can't close until saved", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(false));
    mocks.enable2fa.mockResolvedValue({ data: { recovery_codes: CODES } });
    const user = userEvent.setup();
    renderTab();

    await user.click(await screen.findByRole("button", { name: "Turn on" }));
    const dialog = await screen.findByRole("dialog");

    // QR and manual key both come from /setup.
    expect(await within(dialog).findByTestId("totp-secret")).toHaveTextContent(SETUP.secret);
    expect(within(dialog).getByRole("img", { name: /QR code/ }).querySelector("svg")).not.toBeNull();
    expect(mocks.start2faSetup).toHaveBeenCalledTimes(1);

    // Enrollment only takes an authenticator code: there are no recovery codes yet.
    expect(within(dialog).queryByText("Use a recovery code instead")).not.toBeInTheDocument();

    await enterTotp(user, "123456");
    await user.click(within(dialog).getByRole("button", { name: "Turn on" }));

    expect(mocks.enable2fa).toHaveBeenCalledWith({ code: "123456" });
    const list = await screen.findByRole("list", { name: "Recovery codes" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(10);

    // No X, Esc does nothing, Done is locked until the box is ticked.
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("list", { name: "Recovery codes" })).toBeInTheDocument();
    const done = screen.getByRole("button", { name: "Done" });
    expect(done).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: "I've saved these recovery codes" }));
    await user.click(done);

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    // The cached profile flipped, so the row now offers Turn off.
    expect(screen.getByRole("button", { name: "Turn off" })).toBeInTheDocument();
  });

  it("explains a wrong first code and clears it", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(false));
    mocks.enable2fa.mockRejectedValue({ status: 400, message: "Invalid verification code." });
    const user = userEvent.setup();
    renderTab();

    await user.click(await screen.findByRole("button", { name: "Turn on" }));
    const dialog = await screen.findByRole("dialog");
    await within(dialog).findByTestId("totp-secret");
    await enterTotp(user, "000000");
    await user.click(within(dialog).getByRole("button", { name: "Turn on" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(/clock/);
    expect(within(dialog).getByLabelText("Digit 1 of 6")).toHaveValue("");
  });

  it("restarts setup when the server lost the pending secret", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(false));
    mocks.enable2fa.mockRejectedValue({ status: 400, message: "Start 2FA setup before confirming a code." });
    const user = userEvent.setup();
    renderTab();

    await user.click(await screen.findByRole("button", { name: "Turn on" }));
    const dialog = await screen.findByRole("dialog");
    await within(dialog).findByTestId("totp-secret");
    await enterTotp(user, "123456");
    await user.click(within(dialog).getByRole("button", { name: "Turn on" }));

    await waitFor(() => expect(mocks.start2faSetup).toHaveBeenCalledTimes(2));
  });

  it("closes and refetches if 2FA was already on elsewhere", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(false));
    mocks.start2faSetup.mockRejectedValue({ status: 400, message: "Two-factor authentication is already enabled." });
    const user = userEvent.setup();
    renderTab();

    await user.click(await screen.findByRole("button", { name: "Turn on" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mocks.toast.error).toHaveBeenCalledWith("Two-factor authentication is already enabled.");
    await waitFor(() => expect(mocks.getCurrentAffiliate).toHaveBeenCalledTimes(2));
  });
});

describe("disabling 2FA", () => {
  async function openDisable(user: User) {
    await user.click(await screen.findByRole("button", { name: "Turn off" }));
    return screen.findByRole("dialog");
  }

  it("sends password and code, then flips the row to off", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    mocks.disable2fa.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderTab();

    const dialog = await openDisable(user);
    await user.type(within(dialog).getByLabelText("Password"), "Secret123!");
    await enterTotp(user, "123456");
    await user.click(within(dialog).getByRole("button", { name: "Turn off" }));

    expect(mocks.disable2fa).toHaveBeenCalledWith({ password: "Secret123!", code: "123456" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Turn on" })).toBeInTheDocument();
  });

  it("puts a wrong password on the password field", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    mocks.disable2fa.mockRejectedValue({ status: 400, message: "Password is incorrect." });
    const user = userEvent.setup();
    renderTab();

    const dialog = await openDisable(user);
    await user.type(within(dialog).getByLabelText("Password"), "wrong");
    await enterTotp(user, "123456");
    await user.click(within(dialog).getByRole("button", { name: "Turn off" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent("Password is incorrect.");
    expect(within(dialog).getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");
    // The code is still there; only the password needs fixing.
    expect(within(dialog).getByLabelText("Digit 1 of 6")).toHaveValue("1");
  });

  it("puts a wrong code on the code field and clears it", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    mocks.disable2fa.mockRejectedValue({ status: 401, message: "Invalid code." });
    const user = userEvent.setup();
    renderTab();

    const dialog = await openDisable(user);
    await user.type(within(dialog).getByLabelText("Password"), "Secret123!");
    await enterTotp(user, "123456");
    await user.click(within(dialog).getByRole("button", { name: "Turn off" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent("That code didn't work.");
    expect(within(dialog).getByLabelText("Digit 1 of 6")).toHaveValue("");
    expect(within(dialog).getByLabelText("Password")).not.toHaveAttribute("aria-invalid");
  });

  it("accepts a recovery code", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    mocks.disable2fa.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderTab();

    const dialog = await openDisable(user);
    await user.type(within(dialog).getByLabelText("Password"), "Secret123!");
    await user.click(within(dialog).getByRole("button", { name: "Use a recovery code instead" }));
    await user.type(within(dialog).getByLabelText("Recovery code"), "abcdefghjk");
    await user.click(within(dialog).getByRole("button", { name: "Turn off" }));

    expect(mocks.disable2fa).toHaveBeenCalledWith({ password: "Secret123!", code: "ABCDE-FGHJK" });
  });
});

describe("regenerating recovery codes", () => {
  it("confirms a code and shows the new codes behind the same save gate", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    mocks.regenerateRecoveryCodes.mockResolvedValue({ data: { recovery_codes: CODES } });
    const user = userEvent.setup();
    renderTab();

    await user.click(await screen.findByRole("button", { name: "Generate new codes" }));
    const dialog = await screen.findByRole("dialog");
    await enterTotp(user, "654321");
    await user.click(within(dialog).getByRole("button", { name: "Generate codes" }));

    expect(mocks.regenerateRecoveryCodes).toHaveBeenCalledWith({ code: "654321" });
    expect(await screen.findByText("Your new recovery codes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeDisabled();
  });

  it("locks after too many attempts", async () => {
    mocks.getCurrentAffiliate.mockResolvedValue(profile(true));
    mocks.regenerateRecoveryCodes.mockRejectedValue({
      status: 429,
      message: "Too many failed attempts. Try again later.",
    });
    const user = userEvent.setup();
    renderTab();

    await user.click(await screen.findByRole("button", { name: "Generate new codes" }));
    const dialog = await screen.findByRole("dialog");
    await enterTotp(user, "654321");
    await user.click(within(dialog).getByRole("button", { name: "Generate codes" }));

    expect(await within(dialog).findByText(/Too many failed attempts/)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Generate codes" })).toBeDisabled();
  });
});
