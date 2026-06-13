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
import { Label } from "../ui/label";

export function EditSpreadModal({
  asset,
  symbol,
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
    <Modal onClose={onClose} className="max-w-[700px] px-0 pb-0 border-none">
      {/* Header */}
      <ModalHeader
        title={`Edit Spread — ${asset} (${symbol})`}
        subtitle="Changes take effect immediately across all active customer quotes."
        onClose={onClose}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />

      {/* Body */}
      <div className="grid grid-cols-2 bg-card-primary">
        {/* Left: inputs */}
        <div className="bg-card-primary p-6">
          {/* Buy Spread */}
          <div className="mb-4 space-y-2">
            <Label>Buy Spread</Label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
              <input
                type="number"
                value={buySpread}
                onChange={(e) => setBuySpread(parseFloat(e.target.value))}
                className="flex-1 border-none outline-none px-3 py-2.5 text-[14px] font-medium bg-transparent"
              />
              <span className="px-3 py-2.5 text-[#9CA3AF] text-[14px] border-l border-[#E5E7EB]">
                %
              </span>
            </div>
            <p className="text-[12px] font-normal text-text-secondary">
              Added above Obiex buy rate when customers buy crypto.
            </p>
          </div>

          {/* Sell Spread */}
          <div className="mb-4 space-y-2">
            <Label>Sell Spread</Label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
              <input
                type="number"
                value={sellSpread}
                onChange={(e) => setSellSpread(parseFloat(e.target.value))}
                className="flex-1 border-none outline-none px-3 py-2.5 text-[14px] font-medium bg-transparent"
              />
              <span className="px-3 py-2.5 text-[#9CA3AF] text-[14px] border-l border-[#E5E7EB]">
                %
              </span>
            </div>
            <p className="text-[12px] font-normal text-text-secondary mt-1">
              Added above Oblex buy rate when customers buy crypto.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] leading-[20px] font-medium text-text-primary">
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
        <div className="bg-card-secondary border border-card-border-secondary p-6">
          <div className="text-[16px] font-medium text-text-primary mb-4">
            Customer Rate Preview
          </div>

          {/* Buy section */}
          <div className="mb-4 bg-card-primary p-3 border-l-3 rounded-[12px] border-success-border">
            <div className="text-[14px] font-medium leading-[20px] text-text-primary uppercase tracking-wide mb-2">
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

          {/* Sell section */}
          <div className="mb-4 bg-card-primary p-3 border-l-3 rounded-[12px] border-error-border">
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

          <div className="flex items-start gap-1">
            <Info size={13} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#9CA3AF]">
              Actual customer rates update automatically as Oblex rates refresh.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center p-6 bg-card-secondary rounded-bl-2xl rounded-br-2xl border-t border-card-border-secondary justify-between">
        {/* Warning bar */}
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-[#D97706] flex-shrink-0" />
          <p className="text-[11px] text-[#92400E]">
            Saving this change will update the active spread rule for {asset}.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(buySpread, sellSpread)}>
            Update Spread
          </Button>
        </div>
      </div>
    </Modal>
  );
}
