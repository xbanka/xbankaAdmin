"use client";

import { useState } from "react";

import {
  SettingsGroup,
  SettingsPanelHeader,
  SettingsRow,
  SettingsRowText,
  SettingsSectionLabel,
  SettingsSwitch,
} from "./settings-ui";

/** The two delivery channels a preference can be routed to. */
type Channel = "in_app" | "email";

/**
 * Categories shown under "Notification Preference".
 *
 * The `id`s below are a best guess at the backend's vocabulary. There is no
 * preferences endpoint yet, so nothing reads or writes them remotely — see the
 * note on `preferences` state below.
 */
const PREFERENCE_ROWS = [
  {
    id: "transaction_activity",
    title: "Transaction Activity",
    description: "Important transaction activity and exceptions",
  },
  {
    id: "approval_requests",
    title: "Approval requests",
    description: "Actions requiring your approval",
  },
  {
    id: "role_permission_changes",
    title: "Role and permission changes",
    description: "Changes to staff roles and permissions",
  },
  {
    id: "rate_management_changes",
    title: "Rate management changes",
    description: "Rate configuration changes and approval requests",
  },
  {
    id: "kyc_verification_updates",
    title: "KYC & verification updates",
    description: "Important verification and compliance updates",
  },
  {
    id: "support_activity",
    title: "Support activity",
    description: "Customer support issues requiring attention",
  },
  {
    id: "system_security_alerts",
    title: "System & Security alerts",
    description: "Get updates on system and security alerts",
  },
] as const;

type PreferenceId = (typeof PREFERENCE_ROWS)[number]["id"];

type PreferenceState = Record<PreferenceId, Record<Channel, boolean>>;

/** Defaults mirror the states drawn in the design. */
const DEFAULT_PREFERENCES: PreferenceState = {
  transaction_activity: { in_app: true, email: false },
  approval_requests: { in_app: true, email: false },
  role_permission_changes: { in_app: true, email: false },
  rate_management_changes: { in_app: true, email: false },
  kyc_verification_updates: { in_app: true, email: false },
  support_activity: { in_app: true, email: true },
  system_security_alerts: { in_app: true, email: true },
};

export function NotificationsTab() {
  // TODO(backend): swap this local state for the preferences query/mutation
  // once `GET`/`PATCH` endpoints exist. Nothing here persists today — a reload
  // returns every toggle to the defaults above.
  const [channels, setChannels] = useState<Record<Channel, boolean>>({
    in_app: true,
    email: true,
  });
  const [preferences, setPreferences] =
    useState<PreferenceState>(DEFAULT_PREFERENCES);

  const togglePreference = (id: PreferenceId, channel: Channel) => {
    setPreferences((current) => ({
      ...current,
      [id]: { ...current[id], [channel]: !current[id][channel] },
    }));
  };

  return (
    <>
      <SettingsPanelHeader
        title="Notifications"
        description="Manage your personal information and account details."
      />

      <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
        <SettingsSectionLabel>Notification channels</SettingsSectionLabel>
        <SettingsGroup>
          <SettingsRow>
            <SettingsRowText
              title="In-app notifications"
              description="Receive notifications directly within the ERP"
            />
            <SettingsSwitch
              aria-label="In-app notifications"
              checked={channels.in_app}
              onCheckedChange={(checked) =>
                setChannels((current) => ({ ...current, in_app: checked }))
              }
            />
          </SettingsRow>

          <SettingsRow>
            <SettingsRowText
              title="Email notifications"
              description="Receive important ERP updates and alerts by email"
            />
            <SettingsSwitch
              aria-label="Email notifications"
              checked={channels.email}
              onCheckedChange={(checked) =>
                setChannels((current) => ({ ...current, email: checked }))
              }
            />
          </SettingsRow>
        </SettingsGroup>

        <SettingsSectionLabel className="mt-7">
          Notification Preference
        </SettingsSectionLabel>
        <SettingsGroup>
          {PREFERENCE_ROWS.map((row) => (
            <SettingsRow key={row.id}>
              <SettingsRowText
                title={row.title}
                description={row.description}
              />
              <div className="flex shrink-0 items-center gap-5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] text-secondary-text">
                    In app
                  </span>
                  <SettingsSwitch
                    aria-label={`${row.title} — in app`}
                    checked={preferences[row.id].in_app}
                    onCheckedChange={() => togglePreference(row.id, "in_app")}
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] text-secondary-text">Email</span>
                  <SettingsSwitch
                    aria-label={`${row.title} — email`}
                    checked={preferences[row.id].email}
                    onCheckedChange={() => togglePreference(row.id, "email")}
                  />
                </div>
              </div>
            </SettingsRow>
          ))}
        </SettingsGroup>
      </div>
    </>
  );
}
