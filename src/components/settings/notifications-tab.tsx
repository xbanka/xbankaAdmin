"use client";

import { Lock } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  ALWAYS_ON_CATEGORY,
  NOTIFICATION_CATEGORY_KEYS,
  NotificationCategoryKey,
  NotificationChannel,
} from "@/lib/actions/settingsActions";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/lib/services/settings.service";
import {
  SettingsGroup,
  SettingsPanelHeader,
  SettingsRow,
  SettingsRowText,
  SettingsSectionLabel,
  SettingsSwitch,
} from "./settings-ui";

/**
 * Wording for each category. The keys are the backend's stable identifiers;
 * everything shown to the user lives here, so copy changes never alter what
 * gets sent.
 */
const CATEGORY_COPY: Record<
  NotificationCategoryKey,
  { title: string; description: string }
> = {
  TRANSACTION_ACTIVITY: {
    title: "Transaction Activity",
    description: "Important transaction activity and exceptions",
  },
  APPROVAL_REQUESTS: {
    title: "Approval requests",
    description: "Actions requiring your approval",
  },
  ROLE_PERMISSION_CHANGES: {
    title: "Role and permission changes",
    description: "Changes to staff roles and permissions",
  },
  RATE_MANAGEMENT: {
    title: "Rate management changes",
    description: "Rate configuration changes and approval requests",
  },
  KYC_VERIFICATION: {
    title: "KYC & verification updates",
    description: "Important verification and compliance updates",
  },
  SUPPORT_ACTIVITY: {
    title: "Support activity",
    description: "Customer support issues requiring attention",
  },
  SYSTEM_SECURITY: {
    title: "System & Security alerts",
    description: "Get updates on system and security alerts",
  },
};

const CHANNEL_LABEL: Record<NotificationChannel, string> = {
  in_app: "In app",
  email: "Email",
};

/** One "In app"/"Email" switch with its caption. */
function ToggleCell({
  label,
  srLabel,
  checked,
  disabled,
  hint,
  onCheckedChange,
}: {
  label: string;
  srLabel: string;
  checked: boolean;
  disabled?: boolean;
  hint?: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2.5" title={hint}>
      <span
        className={cn(
          "text-[13px] text-secondary-text",
          disabled && "opacity-50",
        )}
      >
        {label}
      </span>
      <SettingsSwitch
        aria-label={srLabel}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

function PreferencesSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-[68px] w-full rounded-xl" />
      ))}
    </div>
  );
}

export function NotificationsTab() {
  const { data, isLoading, isError } = useNotificationPreferences();
  const savePreferences = useUpdateNotificationPreferences();

  const preferences = data?.data;

  /**
   * Both helpers always name exactly one switch, which is what keeps us clear
   * of the 400 the backend returns for a request that would change nothing.
   */
  const setChannel = (channel: NotificationChannel, value: boolean) =>
    savePreferences.mutate({ channels: { [channel]: value } });

  const setCategory = (
    category: NotificationCategoryKey,
    channel: NotificationChannel,
    value: boolean,
  ) =>
    savePreferences.mutate({ categories: { [category]: { [channel]: value } } });

  return (
    <>
      <SettingsPanelHeader
        title="Notifications"
        description="Manage your personal information and account details."
      />

      <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
        {isError && !preferences ? (
          <p className="text-[14px] text-secondary-text">
            Your notification preferences couldn&apos;t be loaded. Refresh the
            page to try again.
          </p>
        ) : isLoading || !preferences ? (
          <>
            <SettingsSectionLabel>Notification channels</SettingsSectionLabel>
            <Skeleton className="h-[140px] w-full rounded-xl" />
            <SettingsSectionLabel className="mt-7">
              Notification Preference
            </SettingsSectionLabel>
            <PreferencesSkeleton />
          </>
        ) : (
          <>
            <SettingsSectionLabel>Notification channels</SettingsSectionLabel>
            <SettingsGroup>
              <SettingsRow>
                <SettingsRowText
                  title="In-app notifications"
                  description="Receive notifications directly within the ERP"
                />
                <SettingsSwitch
                  aria-label="In-app notifications"
                  checked={preferences.channels.in_app}
                  onCheckedChange={(checked) => setChannel("in_app", checked)}
                />
              </SettingsRow>

              <SettingsRow>
                <SettingsRowText
                  title="Email notifications"
                  description="Receive important ERP updates and alerts by email"
                />
                <SettingsSwitch
                  aria-label="Email notifications"
                  checked={preferences.channels.email}
                  onCheckedChange={(checked) => setChannel("email", checked)}
                />
              </SettingsRow>
            </SettingsGroup>

            <SettingsSectionLabel className="mt-7">
              Notification Preference
            </SettingsSectionLabel>
            <SettingsGroup>
              {NOTIFICATION_CATEGORY_KEYS.map((category) => {
                const copy = CATEGORY_COPY[category];
                const toggles = preferences.categories[category];
                const locked = category === ALWAYS_ON_CATEGORY;

                return (
                  <SettingsRow key={category}>
                    <SettingsRowText
                      title={copy.title}
                      description={copy.description}
                    />

                    <div className="flex shrink-0 items-center gap-5">
                      {locked && (
                        <span
                          className="flex items-center gap-1.5 text-[13px] text-secondary-text"
                          title="Security alerts are always delivered and can't be turned off."
                        >
                          <Lock className="size-[13px]" aria-hidden />
                          Always on
                        </span>
                      )}

                      {(["in_app", "email"] as const).map((channel) => {
                        // A channel switched off greys its whole column. The
                        // stored toggles are untouched underneath and come
                        // back as they were when it's switched on again.
                        const channelOff = !preferences.channels[channel];

                        return (
                          <ToggleCell
                            key={channel}
                            label={CHANNEL_LABEL[channel]}
                            srLabel={`${copy.title} — ${CHANNEL_LABEL[channel].toLowerCase()}`}
                            // Security alerts ignore both switches, so showing
                            // this row as anything but on would be a lie.
                            checked={locked ? true : toggles[channel]}
                            disabled={locked || channelOff}
                            hint={
                              locked
                                ? "Security alerts are always delivered and can't be turned off."
                                : channelOff
                                  ? `Turn ${CHANNEL_LABEL[channel].toLowerCase()} notifications on to change this.`
                                  : undefined
                            }
                            onCheckedChange={(checked) =>
                              setCategory(category, channel, checked)
                            }
                          />
                        );
                      })}
                    </div>
                  </SettingsRow>
                );
              })}
            </SettingsGroup>
          </>
        )}
      </div>
    </>
  );
}
