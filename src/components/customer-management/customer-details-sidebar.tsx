"use client";

import { X } from "lucide-react";
import Image from "next/image";
import {
  useGetCustomerAssets,
  useGetCustomerById,
  useGetCustomerKyc,
  useGetCustomerTransactions,
  useGetCustomerVerification,
} from "@/lib/services/customer.service";
import { tierImages } from "@/lib/utils/tier-images";
import { Tab, TABS } from "./data";
import { useState } from "react";
import { ProfileTab } from "./profile-tab";
import { WalletTab } from "./wallet-tab";
import { TransactionsTab } from "./transactions-tab";
import { VerificationTab } from "./verification-tab";
import { UserProfileData } from "@/lib/types/customer";

interface Props {
  isOpen: boolean;
  customerId: string | null;
  onClose: () => void;
}

export default function CustomerDetailsSidebar({
  isOpen,
  customerId,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { data, isLoading } = useGetCustomerById(customerId || "");
  const { data: verificationData } = useGetCustomerVerification(customerId || "",);
  const { data: kycData, isLoading: isKycLoading, error: kycError } = useGetCustomerKyc(customerId || "");
  console.log("kycData", kycData);

  const { data: walletData } = useGetCustomerAssets(customerId || "");

  const { data: transactionData } = useGetCustomerTransactions(
    customerId || "",
    20,
  );
  console.log("verificationData", verificationData);
  console.log("walletData", walletData);
  console.log("transactionData", transactionData);

  if (!isOpen) return null;

  const customer: UserProfileData = data?.data?.data;

  // Derive tier from kycStatus (UserProfileData has no `tier` field).
  const tier =
    customer?.kycStatus?.addressStatus === "APPROVED"
      ? 3
      : customer?.kycStatus?.idStatus === "APPROVED"
        ? 2
        : customer?.kycStatus?.bvnVerified
          ? 1
          : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="w-full md:w-[600px] bg-white h-full overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-14 w-14 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="py-4 px-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200" />

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold">
                      {customer?.firstName} {customer?.lastName}
                    </h2>

                    <Image
                      src={tierImages[kycData?.data?.tierLevel] || "/Tier0.svg"}
                      alt={`Tier ${kycData?.data?.tierLevel}`}
                      width={67}
                      height={24}
                    />
                  </div>

                  <div className="flex gap-1 items-center">
                    <div className="text-[12px] leading-[22px] font-normal text-text-secondary">
                      UID: {customer?.userId}
                    </div>

                    <div className="text-sm leading-[24px] font-normal">{customer?.email}</div>
                  </div>
                </div>
              </div>

              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-default)] px-6 shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-sm py-3 px-4 font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-text-teal text-text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto bg-card-secondary h-screen">
              {isLoading ? (
                <div className="p-6 flex flex-col gap-4 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              ) : !customer ? (
                <div className="p-12 text-center text-[var(--text-secondary)] text-sm">
                  Customer data unavailable.
                </div>
              ) : (
                <>
                  {activeTab === "profile" && (
                    <ProfileTab customer={customer} />
                  )}
                  {activeTab === "wallet" && (
                    <WalletTab wallet={walletData?.data} />
                  )}
                  {activeTab === "transactions" && (
                    <TransactionsTab transactions={transactionData?.data} wallet={walletData?.data} />
                  )}
                  {activeTab === "verification" && (
                    <VerificationTab customer={verificationData?.data} kyc={kycData?.data} />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
