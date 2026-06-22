// components/transaction/crypto-step-one.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";

const TRANSACTION_TYPES = ["Crypto Trade"];
const TRADE_DIRECTIONS = ["Buy Crypto", "Sell Crypto", "Convert Crypto"];
// const TRADE_DIRECTIONS = ["NGN-USDT", "USDT-NGN", "BTC-NGN", "NGN-BTC", "ETH-NGN", "NGN-ETH"];
const CHANNEL_ORIGINS = ["WhatsApp", "Web App", "Walk-in", "Phone Call"];

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function CryptoStepOne({ onContinue, onBack }: Props) {
  const { watch, setValue, formState: { errors } } = useFormContext();

  const transactionType = watch("details.transactionType");
  const tradeDirection = watch("details.tradeDirection");
  const channelOrigin = watch("details.channelOrigin");

  const isValid = transactionType && tradeDirection && channelOrigin;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Transaction Information
        </h3>
        <div className="flex flex-col gap-4">
          <SelectFieldLayout
            id="details.transactionType"
            label="Transaction Type"
            options={TRANSACTION_TYPES}
            placeholder="Select transaction type"
            value={transactionType ?? ""}
            onChange={(v) => setValue("details.transactionType", v, { shouldValidate: true })}
          />
          <SelectFieldLayout
            id="details.tradeDirection"
            label="Trade Direction"
            options={TRADE_DIRECTIONS}
            placeholder="Select trade direction"
            value={tradeDirection ?? ""}
            onChange={(v) => setValue("details.tradeDirection", v, { shouldValidate: true })}
          />
          <SelectFieldLayout
            id="details.channelOrigin"
            label="Channel Origin"
            options={CHANNEL_ORIGINS}
            placeholder="Select channel origin"
            value={channelOrigin ?? ""}
            onChange={(v) => setValue("details.channelOrigin", v, { shouldValidate: true })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[var(--border-default)] mt-auto">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1 bg-[var(--button-primary-bg)] text-white"
          disabled={!isValid}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}