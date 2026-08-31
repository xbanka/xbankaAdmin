"use client";

import { AlertTriangle, Clock, Info, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Modal } from "../ui/modal";
import { useState } from "react";
import { EditSpreadModalProps } from "./types";
import { PreviewRow } from "./preview-row";
import { fmt } from "@/lib/utils/formatNumber";
import { ModalHeader } from "../ui/modal-header";
import { Label } from "../ui/label";
import { useUpdateBuyAndSpreadRates } from "@/lib/services/rates.service";

type UpdateOutcome = "applied" | "pending";

export function EditSpreadModal({
  spreadData,
  onClose,
  onSave,
}: EditSpreadModalProps) {
  const [buySpread, setBuySpread] = useState(
    spreadData?.segment?.buySpread ?? 0,
  );
  const [sellSpread, setSellSpread] = useState(
    spreadData?.segment?.sellSpread ?? 0,
  );

  const [spreadActive, setSpreadActive] = useState(
    spreadData?.isActive ?? true,
  );
  const { mutate, error, isPending } = useUpdateBuyAndSpreadRates();

  const [outcome, setOutcome] = useState<UpdateOutcome | null>(null);
  const [outcomeMessage, setOutcomeMessage] = useState("");

  const OBIEX_BUY_RATE = spreadData?.obiexRate ?? 0;
  const OBIEX_SELL_RATE = spreadData?.obiexRate ?? 0;

  const buyAmt = OBIEX_BUY_RATE * (buySpread / 100);
  const customerBuyRate = OBIEX_BUY_RATE + buyAmt;
  const sellAmt = OBIEX_SELL_RATE * (sellSpread / 100);
  const customerSellRate = OBIEX_SELL_RATE - sellAmt;

  const handleUpdate = () => {
    // NOTE: backend hasn't confirmed the update schema yet — mirroring the
    // existing asset-level fields but marking them explicitly as percentage
    // spreads, since that's now what buySpread/sellSpread represent here.
    // Confirm with backend once they share the real update contract.
    mutate(
      {
        rateId: spreadData.id,
        payload: {
          currency: spreadData.currency,
          name: spreadData.name,
          isActive: spreadActive,
          buyFeeType: "PERCENTAGE",
          buyFeeValue: buySpread,
          sellFeeType: "PERCENTAGE",
          sellFeeValue: sellSpread,
          segmentId: spreadData.segmentId,
        },
      },
      {
        onSuccess: (data) => {
          const message: string = data?.message ?? "";
          const wasApplied =
            data?.proposed_change?.status === "APPROVED" ||
            message.toLowerCase().includes("applied");

          setOutcomeMessage(message);
          setOutcome(wasApplied ? "applied" : "pending");
        },
      },
    );
  };

  const handleDone = () => {
    onSave(buySpread, sellSpread);
    onClose();
  };

  if (outcome) {
    const isApplied = outcome === "applied";

    return (
      <Modal onClose={onClose} className="max-w-[480px] px-0 pb-0 border-none">
        <div className="flex flex-col items-center text-center px-10 pt-10 pb-8 bg-card-primary rounded-2xl">
          {isApplied ? (
            <Image
              src="/badge-success.svg"
              alt="Success"
              width={60}
              height={60}
              className="mb-4"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-[#D97706]" />
            </div>
          )}

          <h3 className="text-[18px] font-semibold text-text-primary mb-1">
            {isApplied ? "Spread Updated" : "Awaiting Approval"}
          </h3>
          <p className="text-[13px] text-text-secondary max-w-[340px]">
            {outcomeMessage ||
              (isApplied
                ? `The spread for ${spreadData?.name} has been updated and is now live.`
                : `Your change to ${spreadData?.name} has been submitted and is pending approval.`)}
          </p>

          <Button onClick={handleDone} className="mt-6 w-full">
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} className="max-w-[700px] px-0 pb-0 border-none">
      {/* Header */}
      <ModalHeader
        title={`Edit Spread — ${spreadData?.name} (${spreadData?.currency})`}
        subtitle="Changes take effect immediately across all active customer quotes."
        onClose={onClose}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />

      {/* Body */}
      <div className="bg-card-primary flex ">
        {/* Left: inputs */}
        <div className="bg-card-primary p-6">
          {/* Buy Spread */}
          <div className="mb-4 space-y-2">
            <Label>Buy Spread</Label>
            <div className="flex items-center border border-[#E5E7EB] rounded-[8px] bg-[#F9FAFB] overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
              <input
                type="number"
                value={buySpread}
                onChange={(e) => setBuySpread(Number(e.target.value))}
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
            <div className="flex items-center border border-[#E5E7EB] rounded-[8px] bg-[#F9FAFB] overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all">
              <input
                type="number"
                value={sellSpread}
                onChange={(e) => setSellSpread(Number(e.target.value))}
                className="flex-1 border-none outline-none px-3 py-2.5 text-[14px] font-medium bg-transparent"
              />
              <span className="px-3 py-2.5 text-[#9CA3AF] text-[14px] border-l border-[#E5E7EB]">
                %
              </span>
            </div>
            <p className="text-[12px] font-normal text-text-secondary mt-1">
              Deducted from Obiex sell rate when customers sell crypto.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] leading-[20px] font-medium text-text-primary">
                Spread Active
              </div>
              <div className="text-[11px] text-[#9CA3AF]">
                Enable or disable custom spread for {spreadData.currency}
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
            <PreviewRow label="Obiex Buy Rate" value={fmt(OBIEX_BUY_RATE)} />
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
            <div className="flex items-start gap-1 mt-2 bg-card-secondary rounded-[8px]">
              <p className="text-[12px] font-normal text-text-secondary py-1 px-2">
                Customer buys {spreadData.currency} at Obiex buy rate plus
                XBanka buy spread.
              </p>
            </div>
          </div>

          {/* Sell section */}
          <div className="mb-4 bg-card-primary p-3 border-l-3 rounded-[12px] border-error-border">
            <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Sell spread
            </div>
            <PreviewRow label="Obiex Sell Rate" value={fmt(OBIEX_SELL_RATE)} />
            <PreviewRow
              label="Sell Spread"
              value={`-${sellSpread.toFixed(2)}%`}
              valueClass="text-[#EF4444]"
            />
            <PreviewRow label="Spread Amount" value={fmt(sellAmt)} />
            <PreviewRow
              label="Customer Sell Rate"
              value={fmt(customerSellRate)}
              valueClass="text-[15px] text-[#0D9488] font-semibold"
            />
            <div className="flex items-start gap-1 mt-2 bg-card-secondary rounded-[8px]">
              <p className="text-[12px] font-normal text-text-secondary py-1 px-2">
                XBanka pays customer Obiex sell rate minus XBanka sell spread.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-1">
            <Info size={13} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#9CA3AF]">
              Actual customer rates update automatically as Obiex rates refresh.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center p-6 bg-card-secondary rounded-bl-2xl rounded-br-2xl border-t border-card-border-secondary justify-between">
        {/* Warning bar */}
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-[#D97706] flex-shrink-0" />
          <p className="text-[11px] text-[#92400E]">
            Saving this change will update the active spread rule for{" "}
            {spreadData?.name}.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isPending}>
            Update Spread
          </Button>
        </div>
      </div>
    </Modal>
  );
}
