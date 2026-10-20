"use client";

import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePermissions } from "@/hooks/usePermissions";
import { useProfile } from "@/lib/services/profile.service";
import { useUpdateXbankaAccount, useXbankaAccounts } from "@/lib/services/xbanka-accounts.service";
import { hideRisk } from "@/lib/utils/xbanka-accounts";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import type { XbankaAccount } from "@/lib/types/xbanka-account-types";
import { AccountFormModal } from "./account-form-modal";
import { BankLogo } from "./bank-logo";
import { ConfirmAccountAction } from "./confirm-account-action";

type Dialog =
  | { kind: "form"; account?: XbankaAccount }
  | { kind: "hide"; account: XbankaAccount; risk: "primary" | "last" }
  | { kind: "primary"; account: XbankaAccount }
  | null;

const HIDE_RISK_MESSAGE = {
  primary: "This is the primary account. Hiding it removes it from the web app's bank transfer screen.",
  last: "This is the only account customers can see. Hiding it leaves them with nothing to pay into.",
};

export function XbankaAccountsTab() {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canView = hasPermission("finance:view_payments");
  const canManage = hasPermission("finance:adjust_balance");

  const { data: profile } = useProfile();
  const updatedBy = profile?.data?.email ?? "";

  const { data: accounts = [], isPending, isError, error } = useXbankaAccounts({ enabled: canView });
  const update = useUpdateXbankaAccount();
  const [dialog, setDialog] = useState<Dialog>(null);

  // Hide/show and make-primary send just the one field plus updatedBy.
  const patch = (
    account: XbankaAccount,
    change: { isActive: boolean } | { isPrimary: true },
    successMessage: string,
  ) =>
    update.mutate(
      { accountId: account.id, payload: { ...change, updatedBy }, successMessage },
      { onSettled: () => setDialog(null) },
    );

  const hide = (account: XbankaAccount) => {
    const risk = hideRisk(account, accounts);
    if (risk) setDialog({ kind: "hide", account, risk });
    else patch(account, { isActive: false }, `${account.bankName} is now hidden from customers.`);
  };

  const busyId = update.isPending ? update.variables?.accountId : undefined;
  const activeCount = accounts.filter((a) => a.isActive).length;

  if (!canView && !permissionsLoading) {
    return (
      <p className="text-sm text-secondary-text">
        You don&apos;t have permission to view Xbanka accounts.
      </p>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-secondary-text">
          The accounts customers pay into from the web app&apos;s bank transfer screen.
          {!isPending && !isError && ` ${activeCount} of ${accounts.length} visible to customers.`}
        </p>
        {canManage && (
          <Button size="sm" onClick={() => setDialog({ kind: "form" })} disabled={!updatedBy}>
            <Plus />
            Add account
          </Button>
        )}
      </div>

      {isPending ? (
        <p className="text-sm text-secondary-text">Loading accounts...</p>
      ) : isError ? (
        <p className="text-sm text-error-text">{error?.message || "Failed to load Xbanka accounts."}</p>
      ) : accounts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary-text">
          No Xbanka accounts yet. Customers have nowhere to send bank transfers until one is added.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => {
            const busy = busyId === account.id;
            return (
              <li
                key={account.id}
                data-testid={`account-${account.id}`}
                className={cn(
                  "flex flex-col gap-4 rounded-xl border border-border bg-card-primary p-4",
                  account.isPrimary && "border-[#68F4E3]",
                  !account.isActive && "opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  <BankLogo bankCode={account.bankCode} bankName={account.bankName} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-primary">{account.bankName}</p>
                    <p className="truncate text-xs text-secondary-text">{account.accountName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {account.isPrimary && <StatusBadge label="Primary" variant="success" />}
                    {!account.isActive && <StatusBadge label="Hidden from customers" variant="neutral" />}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-mono text-lg tracking-wide text-text-primary">
                    {account.accountNumber}
                  </span>
                  <CopyButton value={account.accountNumber} label="Copy account number" />
                </div>

                <p className="text-xs text-secondary-text">
                  Updated {account.updatedAt ? formatDate(account.updatedAt) : "-"} by {account.updatedBy || "-"}
                </p>

                {canManage && (
                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#111827]"
                      disabled={busy || !updatedBy}
                      onClick={() => setDialog({ kind: "form", account })}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    {account.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#111827]"
                        disabled={busy || !updatedBy}
                        onClick={() => hide(account)}
                      >
                        <EyeOff />
                        Hide
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#111827]"
                        disabled={busy || !updatedBy}
                        onClick={() =>
                          patch(account, { isActive: true }, `${account.bankName} is visible to customers again.`)
                        }
                      >
                        <Eye />
                        Show
                      </Button>
                    )}
                    {!account.isPrimary && account.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#111827]"
                        disabled={busy || !updatedBy}
                        onClick={() => setDialog({ kind: "primary", account })}
                      >
                        <Star />
                        Make primary
                      </Button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {dialog?.kind === "form" && (
        <AccountFormModal account={dialog.account} onClose={() => setDialog(null)} />
      )}
      {dialog?.kind === "hide" && (
        <ConfirmAccountAction
          title={`Hide ${dialog.account.bankName}?`}
          message={HIDE_RISK_MESSAGE[dialog.risk]}
          confirmLabel="Hide anyway"
          destructive
          isPending={update.isPending}
          onConfirm={() =>
            patch(dialog.account, { isActive: false }, `${dialog.account.bankName} is now hidden from customers.`)
          }
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "primary" && (
        <ConfirmAccountAction
          title="Change primary account?"
          message={`Customers will see ${dialog.account.bankName} (${dialog.account.accountNumber}) as the main account to pay into.`}
          confirmLabel="Make primary"
          isPending={update.isPending}
          onConfirm={() =>
            patch(dialog.account, { isPrimary: true }, `${dialog.account.bankName} is now the primary account.`)
          }
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}
