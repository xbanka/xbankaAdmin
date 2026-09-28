"use client";

import { cn } from "@/lib/utils";

export const SETTINGS_TABS = [
  { id: "profile", label: "My Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "general", label: "General" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export function SettingsNav({
  active,
  onChange,
}: {
  active: SettingsTabId;
  onChange: (tab: SettingsTabId) => void;
}) {
  return (
    <nav
      aria-label="Account settings sections"
      className="w-full shrink-0 rounded-2xl border border-border-default bg-card-primary p-4 sm:p-5 lg:w-[248px]"
    >
      <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-1.5 lg:overflow-visible">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab.id === active;

          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "w-full cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-left text-[15px] transition-colors",
                  isActive
                    ? "border border-teal-border bg-teal-light font-medium text-text-teal"
                    : "border border-transparent text-secondary-text hover:bg-[#F9FAFB]",
                )}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
