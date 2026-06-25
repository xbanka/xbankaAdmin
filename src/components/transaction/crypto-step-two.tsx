// components/transaction/crypto-step-two.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import FormField from "../forms/FormField";
import { AmountField } from "../forms/AmountField";
import { useMemo } from "react";

const PARTNERS = ["Luno", "Quidax", "Bybit", "Obiex", "Binance"];
const CRYPTO_CURRENCIES = ["USDT", "BTC", "ETH", "NGN"];

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function CryptoStepTwo({ onContinue, onBack }: Props) {
  const { watch, setValue, register } = useFormContext();

  const customerPays = watch("details.customerPays") ?? "";
  const customerPaysCurrency = watch("details.customerPaysCurrency") ?? "NGN";
  const customerReceivesCurrency = watch("details.customerReceivesCurrency") ?? "USDT";
  const partnerRate = watch("details.partnerRate") ?? "";
  const xbankaRate = watch("details.xbankaRate") ?? "";

  // Auto-calculate margin per unit and totals
  const marginPerUnit = useMemo(() => {
    const pr = parseFloat(partnerRate);
    const xr = parseFloat(xbankaRate);
    if (!isNaN(pr) && !isNaN(xr)) return (xr - pr).toFixed(2);
    return "";
  }, [partnerRate, xbankaRate]);

  const totalMargin = useMemo(() => {
    const pays = parseFloat(customerPays);
    const mg = parseFloat(marginPerUnit);
    if (!isNaN(pays) && !isNaN(mg)) return (pays * mg).toFixed(2); // simplified
    return "";
  }, [customerPays, marginPerUnit]);

  const isValid = customerPays && partnerRate && xbankaRate;

  return (
    <div className="flex flex-col gap-4">
      {/* Trade Amount */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Trade Amount
        </h3>
        <div className="flex flex-col gap-3">
          {/* Customer Pays row with currency select + amount */}
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-secondary)]">Customer Pays</label>
            <div className="flex gap-2">
              <SelectFieldLayout
                id="details.customerPaysCurrency"
                options={CRYPTO_CURRENCIES}
                value={customerPaysCurrency}
                onChange={(v) => setValue("details.customerPaysCurrency", v)}
                className="w-28"
              />
              <AmountField
                id="details.customerPays"
                placeholder="1,000,000"
              />
            </div>
          </div>
          {/* Customer Receives */}
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-secondary)]">Customer Receives</label>
            <div className="flex gap-2">
              <SelectFieldLayout
                id="details.customerReceivesCurrency"
                options={CRYPTO_CURRENCIES}
                value={customerReceivesCurrency}
                onChange={(v) => setValue("details.customerReceivesCurrency", v)}
                className="w-28"
              />
              <AmountField
                id="details.customerReceives"
                placeholder="2,000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Execution Details */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Execution Details
        </h3>
        <div className="flex flex-col gap-3">
          <SelectFieldLayout
            id="details.partner"
            label="Partner"
            options={PARTNERS}
            placeholder="Select partner"
            value={watch("details.partner") ?? ""}
            onChange={(v) => setValue("details.partner", v)}
          />
          {/* Rates row */}
          <div className="grid grid-cols-2 gap-3">
            <AmountField
              id="details.partnerRate"
              label="Partner Rate"
              placeholder="$ 1,500.00"
            />
            <AmountField
              id="details.xbankaRate"
              label="Xbanka Rate"
              placeholder="$ 1,518.00"
            />
          </div>
          {/* Margin summary */}
          {marginPerUnit && (
            <div className="bg-[var(--grey-light)] rounded-lg p-3 text-xs flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Margin per USDT</span>
                <span className="text-[var(--text-teal)] font-medium">+${marginPerUnit}</span>
              </div>
              {totalMargin && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Total Margin</span>
                  <span className="text-[var(--text-teal)] font-semibold">₦{totalMargin}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Additional Info
        </h3>
        <FormField
          id="details.internalNotes"
          label="Internal Notes (Optional)"
          register={register}
          placeholder="Add internal notes..."
        />
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
          Continue to Settlement
        </Button>
      </div>
    </div>
  );
}