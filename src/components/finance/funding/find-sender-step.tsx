"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/formatDate";
import { useFundingLookup, useGetFundingIntents } from "@/lib/services/funding.service";
import type { FundingIntent, FundingLookupMatch } from "@/lib/types/funding-types";
import {
  formatNaira,
  getMatchBlocker,
  isAccountNumber,
  pendingIntentsToReview,
  readableErrorMessage,
} from "@/lib/utils/funding";
import { LookupMatchCard } from "./lookup-match-card";

const NOTICE = "rounded-lg border px-4 py-3 text-sm";

/**
 * Step 1: which customer sent the money? At 10 digits this looks the sender
 * account up and, in parallel, checks for a PENDING intent from it. A
 * pending intent must be completed through the normal flow, because
 * crediting directly would leave that request pending next to the credit.
 */
export function FindSenderStep({
  account,
  onAccountChange,
  selectedId,
  onSelectedIdChange,
  onContinue,
  onOpenIntent,
}: {
  account: string;
  onAccountChange: (value: string) => void;
  selectedId: string;
  onSelectedIdChange: (id: string) => void;
  onContinue: (match: FundingLookupMatch) => void;
  onOpenIntent: (intent: FundingIntent) => void;
}) {
  const ready = isAccountNumber(account);

  const lookup = useFundingLookup(account);
  const intents = useGetFundingIntents({
    status: "pending",
    accountNumber: account,
    limit: 5,
    enabled: ready,
    // A refocus refetch would flash the "looking" state over a decision in progress.
    refetchOnWindowFocus: false,
  });

  // The intents list keeps the previous page while a new one loads, so a
  // pending request from the *previous* account must never be taken as this
  // one's answer.
  const intentsLoading = intents.isPending || intents.isFetching || intents.isPlaceholderData;
  const lookupLoading = lookup.isPending || lookup.isFetching;
  const checking = ready && (lookupLoading || intentsLoading);

  const matches = ready && !lookupLoading && !lookup.isError ? (lookup.data ?? []) : [];

  // A lone match is the only candidate, so it is selected for them.
  const selected =
    matches.length === 1
      ? matches[0]
      : matches.find((m) => m.fundingAccountId === selectedId);

  // The check is by account number, which two customers can share, so only
  // requests belonging to the customer in play stop the credit.
  const pendingForAccount = ready && !intentsLoading && !intents.isError ? (intents.data?.items ?? []) : [];
  const pendingIntents = pendingIntentsToReview(pendingForAccount, matches, selected);
  const canContinue =
    ready &&
    !checking &&
    !lookup.isError &&
    !intents.isError &&
    pendingIntents.length === 0 &&
    !!selected &&
    getMatchBlocker(selected) === null;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="senderAccount">Sender account number</Label>
        <Input
          id="senderAccount"
          placeholder="10-digit account number"
          inputMode="numeric"
          maxLength={10}
          autoComplete="off"
          autoFocus
          value={account}
          onChange={(e) => {
            onAccountChange(e.target.value.replace(/\D/g, ""));
            onSelectedIdChange("");
          }}
        />
        <p className="text-xs text-secondary-text">
          The account the money was sent <em>from</em>, as shown on the bank statement.
          {account.length > 0 && !ready && ` (${account.length}/10)`}
        </p>
      </div>

      {checking && (
        <p className="flex items-center gap-2 text-sm text-secondary-text" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Looking for the customer...
        </p>
      )}

      {ready && !lookupLoading && lookup.isError && (
        <div className={`${NOTICE} border-error-border bg-error-light text-error-text`} role="alert">
          <p>{readableErrorMessage(lookup.error?.message) || "Couldn't look up that account."}</p>
          <button type="button" className="mt-1 underline cursor-pointer" onClick={() => lookup.refetch()}>
            Try again
          </button>
        </div>
      )}

      {ready && !intentsLoading && intents.isError && (
        <div className={`${NOTICE} border-error-border bg-error-light text-error-text`} role="alert">
          <p>Couldn&apos;t check for a pending funding request from this account.</p>
          <button type="button" className="mt-1 underline cursor-pointer" onClick={() => intents.refetch()}>
            Try again
          </button>
        </div>
      )}

      {pendingIntents.length > 0 && (
        <div className={`${NOTICE} border-[#FDE68A] bg-warning-light`} role="alert">
          <p className="flex items-center gap-2 font-medium text-warning-text">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
            This customer already has a pending funding request
          </p>
          <p className="mt-1 text-xs text-secondary-text">
            Confirm that request instead. Crediting directly would leave it pending next to the credit.
          </p>
          <ul className="mt-3 space-y-2">
            {pendingIntents.map((intent) => (
              <li
                key={intent.transactionId}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-card-primary px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{intent.customer?.name}</p>
                  <p className="text-xs text-secondary-text">
                    {formatNaira(intent.declaredAmount, intent.currency)} declared
                    {intent.createdAt ? ` on ${formatDate(intent.createdAt)}` : ""}
                  </p>
                </div>
                <Button type="button" size="sm" onClick={() => onOpenIntent(intent)}>
                  Review request
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ready && !lookupLoading && !lookup.isError && matches.length === 0 && (
        <div className={`${NOTICE} border-border bg-[#F9FAFB]`}>
          <p className="font-medium text-text-primary">No customer has registered this account.</p>
          <p className="mt-1 text-xs text-secondary-text">
            The customer needs to add it as a funding account in the app first. Then try again.
          </p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">
            {matches.length === 1
              ? "Customer found. Check it against the bank statement."
              : "Several customers registered this number. Pick the one on the statement."}
          </p>
          <div role="radiogroup" aria-label="Matching customers" className="space-y-2">
            {matches.map((match) => (
              <LookupMatchCard
                key={match.fundingAccountId}
                match={match}
                selected={selected?.fundingAccountId === match.fundingAccountId}
                onSelect={() => onSelectedIdChange(match.fundingAccountId)}
              />
            ))}
          </div>
        </div>
      )}

      <Button
        type="button"
        className="w-full"
        disabled={!canContinue}
        onClick={() => selected && onContinue(selected)}
      >
        Continue
      </Button>
    </div>
  );
}
