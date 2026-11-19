"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Header from "@/components/ui/Header";
import { UnderlineTabs } from "@/components/ui/underline-tabs";
import { PayoutsTab } from "@/components/finance/payouts-tab";
import { FundingRequestsTab } from "@/components/finance/funding/funding-requests-tab";
import { XbankaAccountsTab } from "@/components/finance/xbanka-accounts/xbanka-accounts-tab";
import { usePermissions } from "@/hooks/usePermissions";

const TABS = ["Payout Requests", "Funding Requests", "Xbanka Accounts"] as const;
type Tab = (typeof TABS)[number];

// `/finance?tab=<key>` opens a tab directly. Notifications link here, e.g. a
// customer's "I have sent the money" opens the Funding Requests tab.
const TAB_PARAM: Record<string, Tab> = {
  payouts: "Payout Requests",
  funding: "Funding Requests",
  accounts: "Xbanka Accounts",
};

function FinancePageContent() {
  const requestedTab = TAB_PARAM[useSearchParams().get("tab") ?? ""];
  const [activeTab, setActiveTab] = useState<Tab>(
    requestedTab ?? "Payout Requests",
  );

  // Already on /finance when a notification is clicked: the page stays
  // mounted and only the query string changes, so follow it.
  useEffect(() => {
    if (requestedTab) setActiveTab(requestedTab);
  }, [requestedTab]);

  const { hasPermission } = usePermissions();
  const isPayouts = activeTab === "Payout Requests";

  return (
    <>
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
    </>
  );
}

// useSearchParams needs a Suspense boundary or the whole route can't prerender.
export default function FinancePage() {
  return (
    <Suspense>
      <FinancePageContent />
    </Suspense>
  );
}
