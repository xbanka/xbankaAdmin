"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

import { MyProfileTab } from "./my-profile-tab";
import { NotificationsTab } from "./notifications-tab";
import { SETTINGS_TABS, SettingsNav, SettingsTabId } from "./settings-nav";
import { SettingsPanelHeader } from "./settings-ui";

/**
 * Stand-in for the three sections that appear in the rail but haven't been
 * designed yet. They stay listed so the navigation matches the design.
 */
function ComingSoonTab({ tab }: { tab: SettingsTabId }) {
  const label = SETTINGS_TABS.find((item) => item.id === tab)?.label ?? "";

  return (
    <>
      <SettingsPanelHeader
        title={label}
        description={`Manage your ${label.toLowerCase()} settings.`}
      />
      <div className="flex min-h-[240px] items-center justify-center px-5 py-10 text-[14px] text-secondary-text sm:px-7">
        Nothing to configure here yet.
      </div>
    </>
  );
}

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

  return (
    <DashboardLayout icon={SlidersHorizontal} id="Settings" href="/settings">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-[28px] font-bold text-text-primary lg:text-[32px]">
          Account Settings
        </h1>

        <div className="flex flex-col items-start gap-5 lg:flex-row">
          <SettingsNav active={activeTab} onChange={setActiveTab} />

          <section className="w-full min-w-0 flex-1 rounded-2xl border border-border-default bg-card-primary">
            {activeTab === "profile" && <MyProfileTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab !== "profile" && activeTab !== "notifications" && (
              <ComingSoonTab tab={activeTab} />
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
