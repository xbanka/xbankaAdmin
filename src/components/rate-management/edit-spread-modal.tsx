"use client";

import { AlertTriangle, Info, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Modal } from "../ui/modal";
import { useState } from "react";
import { EditSpreadModalProps } from "./types";
import { PreviewRow } from "./preview-row";
import { fmt } from "@/lib/utils/formatNumber";
import { ModalHeader } from "../ui/modal-header";

export function EditSpreadModal({
  asset,
  symbol,
  color,
  initial,
  defaultBuySpread,
  defaultSellSpread,
  onClose,
  onSave,
}: EditSpreadModalProps) {
  const [buySpread, setBuySpread] = useState(defaultBuySpread);
  const [sellSpread, setSellSpread] = useState(defaultSellSpread);
  const [spreadActive, setSpreadActive] = useState(true);

  const OBLEX_BUY_RATE = 150_000_000;
  const OBLEX_SELL_RATE = 149_500_000;

  const buyAmt = OBLEX_BUY_RATE * (buySpread / 100);
  const customerBuyRate = OBLEX_BUY_RATE + buyAmt;
  const sellAmt = OBLEX_SELL_RATE * (sellSpread / 100);
  const customerSellRate = OBLEX_SELL_RATE - sellAmt;

  return (
    <Modal onClose={onClose} className="max-w-[700px] px-0 pb-0">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
            style={{ background: color }}
          >
            {initial}
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#111827]">
              Edit Spread — {asset} ({symbol})
            </h2>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">
              Changes take effect immediately across all active customer quotes.
            </p>
          </div>
        </div>
        <ModalHeader title={`Edit Spread — ${asset} (${symbol})`} subtitle="" onClose={onClose} />
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-0 px-7 pt-5">
        {/* Left: inputs */}
        <div className="pr-5">
          {/* Buy Spread */}
          <div className="mb-4">
            <label className="block text-[12px] font-medium text-[#374151] mb-1.5">
              Buy Spread
            </label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
              <input
                type="number"
                value={buySpread}
                onChange={(e) => setBuySpread(parseFloat(e.target.value) || 0)}
                className="flex-1 border-none outline-none px-3 py-2.5 text-[14px] font-medium bg-transparent"
              />
              <span className="px-3 py-2.5 text-[#9CA3AF] text-[14px] border-l border-[#E5E7EB]">
                %
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Added above Oblex buy rate when customers buy crypto.
            </p>
          </div>

          {/* Sell Spread */}
          <div className="mb-4">
            <label className="block text-[12px] font-medium text-[#374151] mb-1.5">
              Sell Spread
            </label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
              <input
                type="number"
                value={sellSpread}
                onChange={(e) => setSellSpread(parseFloat(e.target.value) || 0)}
                className="flex-1 border-none outline-none px-3 py-2.5 text-[14px] font-medium bg-transparent"
              />
              <span className="px-3 py-2.5 text-[#9CA3AF] text-[14px] border-l border-[#E5E7EB]">
                %
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Added above Oblex buy rate when customers buy crypto.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium text-[#374151]">
                Spread Active
              </div>
              <div className="text-[11px] text-[#9CA3AF]">
                Enable or disable custom spread for {symbol}
              </div>
            </div>
            <button
              onClick={() => setSpreadActive(!spreadActive)}
              className={cn(
                "w-10 h-[22px] rounded-full relative transition-colors flex-shrink-0",
                spreadActive ? "bg-[#0D9488]" : "bg-[#D1D5DB]",
              )}
              aria-label="Toggle spread active"
              role="switch"
              aria-checked={spreadActive}
            >
              <span
                className={cn(
                  "absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all",
                  spreadActive ? "right-[3px]" : "left-[3px]",
                )}
              />
            </button>
          </div>
        </div>

        {/* Right: preview */}
        <div className="bg-[#F9FAFB] rounded-xl p-4 ml-3">
          <div className="text-[13px] font-semibold text-[#374151] mb-3">
            Customer Rate Preview
          </div>

          {/* Buy section */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Buy spread
            </div>
            <PreviewRow label="Oblex Buy Rate" value={fmt(OBLEX_BUY_RATE)} />
            <PreviewRow
              label="Buy Spread"
              value={`+${buySpread.toFixed(2)}%`}
              valueClass="text-[#059669]"
            />
            <PreviewRow label="Spread Amount" value={fmt(buyAmt)} />
            <PreviewRow
              label="Customer Buy Rate"
              value={fmt(customerBuyRate)}
              valueClass="text-[15px] text-[#0D9488] font-semibold"
            />
            <div className="flex items-start gap-1 mt-2">
              <Info size={13} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#9CA3AF]">
                Customer buys {symbol} at Oblex buy rate plus XBanka buy spread.
              </p>
            </div>
          </div>

          <hr className="border-[#E5E7EB] my-3" />

          {/* Sell section */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Sell spread
            </div>
            <PreviewRow label="Oblex Sell Rate" value={fmt(OBLEX_SELL_RATE)} />
            <PreviewRow
              label="Buy Spread"
              value={`-${sellSpread.toFixed(2)}%`}
              valueClass="text-[#EF4444]"
            />
            <PreviewRow label="Spread Amount" value={fmt(sellAmt)} />
            <PreviewRow
              label="Customer Buy Rate"
              value={fmt(customerSellRate)}
              valueClass="text-[15px] text-[#0D9488] font-semibold"
            />
            <div className="flex items-start gap-1 mt-2">
              <Info size={13} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#9CA3AF]">
                XBanka pays customer Oblex sell rate minus XBanka sell spread.
              </p>
            </div>
          </div>

          <hr className="border-[#E5E7EB] my-3" />

          <div className="flex items-start gap-1">
            <Info size={13} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#9CA3AF]">
              Actual customer rates update automatically as Oblex rates refresh.
            </p>
          </div>
        </div>
      </div>

      {/* Warning bar */}
      <div className="flex items-center gap-2 px-7 py-2.5 bg-[#FEF9EC] border-t border-[#FCD34D] mt-4">
        <AlertTriangle size={15} className="text-[#D97706] flex-shrink-0" />
        <p className="text-[11px] text-[#92400E]">
          Saving this change will update the active spread rule for {asset}.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2.5 px-7 py-4 border-t border-[#E5E7EB]">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(buySpread, sellSpread)}>
          Update Spread
        </Button>
      </div>
    </Modal>
  );
}
