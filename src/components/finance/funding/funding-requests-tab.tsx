"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { StatusBadge, type StatusVariant } from "@/components/ui/status-badge";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { useGetFundingIntents } from "@/lib/services/funding.service";
import { formatNaira, isAccountNumber, statusLabel } from "@/lib/utils/funding";
import { formatDate } from "@/lib/formatDate";
import { useDebounce } from "@/hooks/useDebounce";
import { usePermissions } from "@/hooks/usePermissions";
import type { FundingIntent } from "@/lib/types/funding-types";
import { CompleteIntentModal } from "./complete-intent-modal";
import { RejectIntentModal } from "./reject-intent-modal";

const LIMIT = 10;
const STATUS_FILTERS = ["Pending", "Completed", "Failed"];

const STATUS_VARIANT: Record<string, StatusVariant> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "error",
};

type Action = { kind: "complete" | "reject"; intent: FundingIntent } | null;

export function FundingRequestsTab() {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canView = hasPermission("finance:view_payments");
  const canSettle = hasPermission("finance:adjust_balance");

  const [status, setStatus] = useState("pending");
  const [accountInput, setAccountInput] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<Action>(null);

  const debouncedAccount = useDebounce(accountInput, 400);
  const accountDigits = accountInput.trim();
  const showAccountHint = accountDigits.length > 0 && !isAccountNumber(accountDigits);

  const { data, isPending, isError, error, isFetching } = useGetFundingIntents({
    status,
    accountNumber: debouncedAccount,
    page,
    limit: LIMIT,
    enabled: canView,
  });
  const isPendingTab = status === "pending";

  const columns = [
    {
      key: "customer",
      header: "Customer",
      render: (item: FundingIntent) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary-font-color">{item.customer?.name}</span>
          <span className="text-xs text-secondary-text">{item.customer?.email}</span>
        </div>
      ),
    },
    {
      key: "declaredAmount",
      header: "Declared",
      render: (item: FundingIntent) => (
        <span className="font-medium text-gray-700">
          {formatNaira(item.declaredAmount, item.currency)}
        </span>
      ),
    },
    // Settled rows show what was actually credited, which can differ.
    ...(!isPendingTab
      ? [
          {
            key: "amount",
            header: "Credited",
            render: (item: FundingIntent) =>
              item.status === "COMPLETED" ? formatNaira(item.amount, item.currency) : "-",
          },
        ]
      : []),
    {
      key: "registeredFundingAccounts",
      header: "Sender account(s)",
      hiddenOnMobile: true,
      render: (item: FundingIntent) =>
        item.registeredFundingAccounts?.length ? (
          <div className="flex flex-col gap-1">
            {item.registeredFundingAccounts.map((a) => (
              <span key={a.id} className="text-xs">
                <span className="font-medium text-text-primary">{a.accountNumber}</span>{" "}
                <span className="text-secondary-text">
                  {a.bankName} · {a.accountName}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-secondary-text">None registered</span>
        ),
    },
    {
      key: "intentReference",
      header: isPendingTab ? "Reference" : "Bank reference",
      hiddenOnMobile: true,
      render: (item: FundingIntent) => (
        <span className="text-xs text-secondary-text break-all">
          {isPendingTab ? item.intentReference || item.reference : item.bankReference || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Declared on",
      render: (item: FundingIntent) => (item.createdAt ? formatDate(item.createdAt) : "-"),
    },
    {
      key: "status",
      header: "Status",
      render: (item: FundingIntent) => (
        <StatusBadge
          label={statusLabel(item.status)}
          variant={STATUS_VARIANT[item.status] ?? "neutral"}
        />
      ),
    },
    ...(!isPendingTab
      ? [
          {
            key: "settledBy",
            header: "Settled by",
            hiddenOnMobile: true,
            render: (item: FundingIntent) => (
              <div className="flex flex-col text-xs">
                <span>{item.creditedBy || item.rejectedBy || "-"}</span>
                {(item.overrideReason || item.rejectReason) && (
                  <span className="text-secondary-text">{item.overrideReason || item.rejectReason}</span>
                )}
              </div>
            ),
          },
        ]
      : []),
    ...(isPendingTab && canSettle
      ? [
          {
            key: "actions",
            header: "Actions",
            render: (item: FundingIntent) =>
              item.status === "PENDING" ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="underline cursor-pointer text-text-teal"
                    onClick={() => setAction({ kind: "complete", intent: item })}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="underline cursor-pointer text-error-text"
                    onClick={() => setAction({ kind: "reject", intent: item })}
                  >
                    Reject
                  </button>
                </div>
              ) : null,
          },
        ]
      : []),
  ];

  if (!canView && !permissionsLoading) {
    return (
      <p className="text-sm text-secondary-text">
        You don&apos;t have permission to view funding requests.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-[24px]">
        <FilterTabs
          filters={STATUS_FILTERS}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              aria-label="Sender account number"
              placeholder="Sender account number"
              inputMode="numeric"
              maxLength={10}
              value={accountInput}
              onChange={(e) => {
                setAccountInput(e.target.value.replace(/\D/g, ""));
                setPage(1);
              }}
              className="py-[10px] px-[12px] pl-10 w-full"
            />
          </div>
          {showAccountHint && (
            <p className="mt-1 text-xs text-secondary-text">
              Enter all 10 digits to search ({accountDigits.length}/10)
            </p>
          )}
        </div>
      </div>

      <DataTableLayout
        data={data?.items ?? []}
        columns={columns}
        isError={isError}
        isLoading={isPending}
        errorMessage={error?.message ?? "Failed to load funding requests."}
        rowKey={(item) => item.transactionId}
        itemsPerPage={LIMIT}
        totalCount={data?.meta.totalItems}
        currentPage={page}
        onPageChange={setPage}
        className={isFetching && !isPending ? "opacity-70 transition-opacity" : undefined}
        emptyMessage={
          debouncedAccount && isAccountNumber(debouncedAccount)
            ? `No ${status} requests from account ${debouncedAccount}.`
            : `No ${status} funding requests.`
        }
      />

      {action?.kind === "complete" && (
        <CompleteIntentModal intent={action.intent} onClose={() => setAction(null)} />
      )}
      {action?.kind === "reject" && (
        <RejectIntentModal intent={action.intent} onClose={() => setAction(null)} />
      )}
    </>
  );
}
