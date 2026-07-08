// components/transaction/crypto-step-two.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import FormField from "../forms/FormField";
import { AmountField } from "../forms/AmountField";
import { useMemo } from "react";

const PARTNERS = ["Luno"];
const CRYPTO_CURRENCIES = ["USDT", "BTC", "ETH", "NGN"];

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function CryptoStepTwo({ onContinue, onBack }: Props) {
  const { watch, setValue, register } = useFormContext();

  const tradeDirection = watch("details.tradeDirection");
  const isBuy = tradeDirection === "Buy Crypto";

  const customerPays = watch("details.customerPays") ?? "";
  const customerPaysCurrency =
    watch("details.customerPaysCurrency") ?? (isBuy ? "NGN" : "USDT");
  const customerReceivesCurrency =
    watch("details.customerReceivesCurrency") ?? (isBuy ? "USDT" : "NGN");
  const partnerRate = watch("details.partnerRate") ?? "";
  const xbankaRate = watch("details.xbankaRate") ?? "";

  const customerPaysAmount = parseFloat(watch("details.customerPays") || "0");
  const customerReceivesAmount = parseFloat(
    watch("details.customerReceives") || "0",
  );

  const partnerRateValue = parseFloat(partnerRate || "0");
  const xbankaRateValue = parseFloat(xbankaRate || "0");

  const calculations = useMemo(() => {
    if (
      isNaN(customerPaysAmount) ||
      isNaN(customerReceivesAmount) ||
      isNaN(partnerRateValue) ||
      isNaN(xbankaRateValue)
    ) {
      return {
        partnerCost: 0,
        marginPerUnit: 0,
        grossMargin: 0,
        marginPercentage: 0,
      };
    }

    const partnerCost = customerReceivesAmount * partnerRateValue;

    const marginPerUnit = xbankaRateValue - partnerRateValue;

    const grossMargin = customerPaysAmount - partnerCost;

    const marginPercentage =
      partnerCost > 0 ? (grossMargin / partnerCost) * 100 : 0;

    return {
      partnerCost,
      marginPerUnit,
      grossMargin,
      marginPercentage,
    };
  }, [
    customerPaysAmount,
    customerReceivesAmount,
    partnerRateValue,
    xbankaRateValue,
  ]);

  const totalMargin = useMemo(() => {
    const pays = parseFloat(customerPays);
    const mg = calculations?.marginPerUnit ?? 0;
    if (!isNaN(pays) && !isNaN(mg)) return (pays * mg).toFixed(2); // simplified
    return "";
  }, [customerPays, calculations.marginPerUnit]);

  const isValid = customerPays && partnerRate && xbankaRate;

  return (
    <div className="flex flex-col gap-4">
      {/* Trade Amount */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium leading-5 text-text-primary-font-color ">
          Trade Amount
        </h3>
        <div className="flex flex-col gap-3">
          {/* Customer Pays row with currency select + amount */}
          <div className="flex gap-2 items-end">
            <SelectFieldLayout
              label="Customer Pays"
              id="details.customerPaysCurrency"
              options={CRYPTO_CURRENCIES}
              value={customerPaysCurrency}
              onChange={(v) => setValue("details.customerPaysCurrency", v)}
              className="w-28"
            />
            <AmountField id="details.customerPays" placeholder="1,000,000" />
          </div>
          {/* Customer Receives */}
          <div className="flex gap-2 items-end">
            <SelectFieldLayout
              label="Customer Receives"
              id="details.customerReceivesCurrency"
              options={CRYPTO_CURRENCIES}
              value={customerReceivesCurrency}
              onChange={(v) => setValue("details.customerReceivesCurrency", v)}
              className="w-28"
            />
            <AmountField id="details.customerReceives" placeholder="2,000" />
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
              placeholder=" 1,500.00"
              currencySymbol="₦"
              currency="/USDT"
              inputClassName="pl-6"
            />
            <AmountField
              id="details.xbankaRate"
              label="Xbanka Rate"
              placeholder=" 1,500.00"
              currencySymbol="₦"
              currency="/USDT"
              inputClassName="pl-6"
            />
          </div>
          {/* Margin summary */}
          {calculations?.marginPerUnit && (
            <div className="bg-[var(--grey-light)] rounded-lg p-3 text-xs flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Partners cost
                </span>
                <span className="text-[var(--text-teal)] font-medium">
                  ₦{calculations.partnerCost.toLocaleString()}
                </span>
              </div>
              {calculations?.marginPerUnit && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    Margin per USDT
                  </span>
                  <span className="text-[var(--text-teal)] font-semibold">
                    +₦{calculations.marginPerUnit.toLocaleString()}
                  </span>
                </div>
              )}
              {calculations?.grossMargin && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    Gross Margin
                  </span>
                  <span className="text-[var(--text-teal)] font-semibold">
                    ₦{calculations.grossMargin.toLocaleString()}
                  </span>
                </div>
              )}
              {calculations?.marginPercentage && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    Margin percentage
                  </span>
                  <span className="text-[var(--text-teal)] font-semibold">
                    {calculations.marginPercentage.toFixed(2)}%
                  </span>
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
