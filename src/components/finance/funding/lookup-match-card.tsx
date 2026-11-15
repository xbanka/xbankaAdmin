"use client";

import { Ban, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FundingLookupMatch } from "@/lib/types/funding-types";
import {
  MATCH_BLOCKER_MESSAGE,
  NO_WALLET_NOTE,
  customerDisplayName,
  getMatchBlocker,
  hasNoWalletYet,
} from "@/lib/utils/funding";

/**
 * One customer who registered the sending account. The account name leads
 * because it is what staff compare with the sender on the bank statement.
 * A customer who can't be credited is shown but can't be selected.
 */
export function LookupMatchCard({
  match,
  selected,
  onSelect,
}: {
  match: FundingLookupMatch;
  selected: boolean;
  onSelect: () => void;
}) {
  const blocker = getMatchBlocker(match);
  const { customer } = match;
  // A lone match is auto-selected, but one that can't be credited must not
  // look chosen.
  const isSelected = selected && !blocker;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={!!blocker}
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border px-4 py-3 text-left transition-colors",
        isSelected ? "border-[#0D9488] bg-[#F0FDFA]" : "border-border bg-card-primary",
        blocker ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-[#0D9488]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase text-text-primary break-words">
            {match.accountName}
          </p>
          <p className="text-xs text-secondary-text">{match.bankName}</p>
        </div>
        {isSelected && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0D9488] text-white">
            <Check className="h-3 w-3" aria-hidden />
          </span>
        )}
      </div>

      <div className="mt-2 border-t border-border pt-2">
        <p className="text-sm font-medium text-text-primary">{customerDisplayName(customer)}</p>
        <p className="text-xs text-secondary-text break-all">
          {[customer.xbId, customer.email].filter(Boolean).join(" · ")}
        </p>
      </div>

      {blocker && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-error-text">
          <Ban className="h-3.5 w-3.5" aria-hidden />
          {MATCH_BLOCKER_MESSAGE[blocker]}
        </p>
      )}

      {/* Informational only: the credit creates the wallet, so it doesn't block. */}
      {!blocker && hasNoWalletYet(match) && (
        <p className="mt-2 flex items-center gap-1 text-xs text-secondary-text">
          <Info className="h-3.5 w-3.5" aria-hidden />
          {NO_WALLET_NOTE}
        </p>
      )}
    </button>
  );
}
