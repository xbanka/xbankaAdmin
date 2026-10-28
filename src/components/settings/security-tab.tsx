"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/lib/services/profile.service";
import { cn } from "@/lib/utils";

import {
  EditButton,
  SettingsGroup,
  SettingsPanelHeader,
  SettingsRow,
  SettingsRowText,
  SettingsSectionLabel,
} from "./settings-ui";
import { Disable2faDialog } from "./two-factor/disable-2fa-dialog";
import { Enable2faDialog } from "./two-factor/enable-2fa-dialog";
import { RegenerateCodesDialog } from "./two-factor/regenerate-codes-dialog";

type OpenDialog = "enable" | "disable" | "regenerate" | null;

function StatusBadge({ enabled }: { enabled: boolean }) {
  const Icon = enabled ? ShieldCheck : ShieldOff;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium",
        enabled
          ? "border-teal-border bg-teal-light text-text-teal"
          : "border-[#E4E7EC] bg-white text-secondary-text",
      )}
    >
      <Icon className="size-3.5" />
      {enabled ? "On" : "Off"}
    </span>
  );
}

/**
 * Settings → Security. The on/off state comes from `totp_enabled` on
 * `GET /api/erp/me`. The dialogs update that cached value on success, so the
 * row flips without waiting for a refetch.
 *
 * Which dialog is open lives here rather than being derived from
 * `totp_enabled`: enabling flips the flag while the recovery codes are still
 * on screen, and they must stay there.
 */
export function SecurityTab() {
  const { data, isPending } = useProfile();
  const profile = data?.data;
  const enabled = profile?.totp_enabled === true;
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <SettingsPanelHeader
        title="Security"
        description="Protect your account with a second step at sign-in."
      />

      <div className="px-5 py-6 sm:px-7">
        <SettingsSectionLabel>Two-factor authentication</SettingsSectionLabel>
        <SettingsGroup>
          <SettingsRow>
            <SettingsRowText
              title="Authenticator app"
              description="After your password, enter a code from an app on your phone."
            />
            {isPending ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="flex items-center gap-3">
                <StatusBadge enabled={enabled} />
                {enabled ? (
                  <EditButton
                    label="Turn off"
                    onClick={() => setDialog("disable")}
                  />
                ) : (
                  <EditButton
                    label="Turn on"
                    onClick={() => setDialog("enable")}
                  />
                )}
              </div>
            )}
          </SettingsRow>

          {enabled && (
            <SettingsRow>
              <SettingsRowText
                title="Recovery codes"
                description="Single-use codes for when you don't have your phone. Making new ones cancels the old ones."
              />
              <EditButton
                label="Generate new codes"
                onClick={() => setDialog("regenerate")}
              />
            </SettingsRow>
          )}
        </SettingsGroup>

        <p className="mt-4 text-[13px] text-secondary-text">
          Lost your phone and your recovery codes? Ask a Super Admin to reset
          two-factor authentication on your account.
        </p>
      </div>

      <Enable2faDialog
        open={dialog === "enable"}
        onClose={close}
        account={profile?.email}
      />
      <Disable2faDialog open={dialog === "disable"} onClose={close} />
      <RegenerateCodesDialog
        open={dialog === "regenerate"}
        onClose={close}
        account={profile?.email}
      />
    </>
  );
}
