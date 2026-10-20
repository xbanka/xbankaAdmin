"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FundingBank } from "@/lib/types/xbanka-account-types";
import { BankLogo } from "./bank-logo";

/**
 * Searchable bank picker with logos. Picking a bank yields both its name and
 * code, so staff never type a bank code. Rendered inline (no portal) so it
 * works inside the modal's own scroll container.
 */
export function BankSelect({
  banks,
  value,
  onChange,
  isLoading,
  isError,
  invalid,
  fallbackName,
}: {
  banks: FundingBank[];
  /** Shown when `value` isn't in the list (e.g. an older account's code). */
  fallbackName?: string;
  value: string;
  onChange: (bank: FundingBank) => void;
  isLoading?: boolean;
  isError?: boolean;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    banks.find((b) => b.code === value) ??
    (value && fallbackName ? { code: value, name: fallbackName } : undefined);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? banks.filter((b) => b.name.toLowerCase().includes(q) || b.code.includes(q)) : banks;
  }, [banks, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const pick = (bank: FundingBank) => {
    onChange(bank);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="bankCode"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isLoading || (isError && !selected)}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-[0.5rem] border border-input px-3 text-sm text-left disabled:opacity-60",
          invalid && "border-destructive",
        )}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2">
            <BankLogo bankCode={selected.code} bankName={selected.name} size={24} />
            <span className="truncate text-text-primary">{selected.name}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isLoading ? "Loading banks..." : isError ? "Couldn't load banks" : "Select bank"}
          </span>
        )}
        <ChevronDown className="h-4 w-4 shrink-0 text-secondary-text" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-[0.5rem] border border-border bg-card-primary shadow-lg">
          <div className="relative border-b border-border p-2">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              aria-label="Search banks"
              placeholder="Search banks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input pl-8 pr-2 text-sm outline-none focus:border-[#2DD4BF]"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-secondary-text">No bank matches “{query}”</li>
            ) : (
              filtered.map((bank) => (
                <li key={bank.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={bank.code === value}
                    onClick={() => pick(bank)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F9FAFB]",
                      bank.code === value && "bg-[#F0FDFA]",
                    )}
                  >
                    <BankLogo bankCode={bank.code} bankName={bank.name} size={24} />
                    <span className="truncate">{bank.name}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
