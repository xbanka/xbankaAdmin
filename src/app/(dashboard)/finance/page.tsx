"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Upload } from "lucide-react";
import Header from "@/components/ui/Header";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import { PayoutsTab } from "@/components/finance/payouts-tab";
import { FundingRequestsTab } from "@/components/finance/funding/funding-requests-tab";
import { XbankaAccountsTab } from "@/components/finance/xbanka-accounts/xbanka-accounts-tab";
import { usePermissions } from "@/hooks/usePermissions";

const TABS = ["Payout Requests", "Funding Requests", "Xbanka Accounts"] as const;
type Tab = (typeof TABS)[number];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Payout Requests");
  const { hasPermission } = usePermissions();
  const isPayouts = activeTab === "Payout Requests";

  return (
    <DashboardLayout
      isPending={false}
      // error={""}
      breadcrumbs={[{ label: "Finance" }]}
    >
      <div className="w-full p-4 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-[24px]">
          <Header text="Finance Overview" />
          {isPayouts && hasPermission("finance:export_reports") && (
            <Button className="text-[#111827]" size="sm" variant={"outline"}>
              <Upload />
              Export
            </Button>
          )}
        </div>

        <UnderlineTabs
          tabs={TABS}
          value={activeTab}
          onChange={(v) => setActiveTab(v as Tab)}
          className="mb-6"
        />

        {activeTab === "Payout Requests" && <PayoutsTab />}
        {activeTab === "Funding Requests" && <FundingRequestsTab />}
        {activeTab === "Xbanka Accounts" && <XbankaAccountsTab />}
      </div>
    </DashboardLayout>
  );
}
