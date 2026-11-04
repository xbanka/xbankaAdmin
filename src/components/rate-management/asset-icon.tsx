"use client";

import { useState } from "react";
import { getAssetIconUrls, getAssetInitials } from "@/lib/utils/asset-icon";

export function AssetIcon({ currency }: { currency?: string | null }) {
  const urls = getAssetIconUrls(currency);
  // Index into urls; moves to the next source on each load error.
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = urls[sourceIndex];

  if (!src) {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/50 text-[10px] font-bold flex-shrink-0"
        aria-label={currency ?? "asset"}
      >
        {getAssetInitials(currency)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external CDN with fallback chain
    <img
      key={src}
      src={src}
      alt={currency ?? "asset"}
      width={32}
      height={32}
      loading="lazy"
      className="w-8 h-8 rounded-full flex-shrink-0 object-contain"
      onError={() => setSourceIndex((i) => i + 1)}
    />
  );
}
