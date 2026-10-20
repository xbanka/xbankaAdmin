"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useBankLogos } from "@/lib/services/xbanka-accounts.service";
import { bankInitials, findBankLogo } from "@/lib/utils/xbanka-accounts";

/**
 * Bank logo from the third-party list, or an initials badge whenever it is
 * missing, still loading, or fails to load. Never blocks or errors.
 */
export function BankLogo({
  bankCode,
  bankName,
  size = 36,
  className,
}: {
  bankCode?: string;
  bankName?: string;
  size?: number;
  className?: string;
}) {
  const { data: logos } = useBankLogos();
  const [broken, setBroken] = useState<string | null>(null);
  const src = findBankLogo(logos, bankCode, bankName);
  const style = { width: size, height: size };

  if (src && broken !== src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={style}
        onError={() => setBroken(src)}
        className={cn("shrink-0 rounded-full border border-border bg-white object-contain", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      data-testid="bank-initials"
      style={{ ...style, fontSize: Math.max(10, size / 3) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#DDFFFB] font-semibold text-[#0D9488]",
        className,
      )}
    >
      {bankInitials(bankName)}
    </span>
  );
}
