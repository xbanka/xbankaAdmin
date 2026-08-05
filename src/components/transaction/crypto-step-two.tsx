// components/transaction/crypto-step-two.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectFieldLayout } from "../forms/SelectFieldLayout";
import FormField from "../forms/FormField";
import { AmountField } from "../forms/AmountField";
import { useEffect, useMemo } from "react";
import { CardLayout } from "../ui/card-layout";

const PARTNERS = ["Luno"];
const CRYPTO_CURRENCIES = ["USDT", "BTC", "ETH", "NGN"];
const DELIVERY_SOURCES = [
  "Luno Wallet",
  "Rayosh",
  "Obiex",
  "Salmnine",
  "GredoEx",
];

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

  const customerPaysCurrencies = useMemo(() => {
    if (isBuy) {
      return CRYPTO_CURRENCIES;
    }

    // Sell Crypto: remove NGN from Customer Pays
    return CRYPTO_CURRENCIES.filter((currency) => currency !== "NGN");
  }, [isBuy]);

  useEffect(() => {
  if (!isBuy && customerPaysCurrency === "NGN") {
    setValue("details.customerPaysCurrency", "USDT");
  }
}, [isBuy, customerPaysCurrency, setValue]);

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
          <CardLayout className="flex gap-2 items-end">
            <SelectFieldLayout
              label="Customer Pays"
              id="details.customerPaysCurrency"
              options={customerPaysCurrencies}
              value={customerPaysCurrency}
              onChange={(v) => setValue("details.customerPaysCurrency", v)}
              className="w-28"
            />
            <AmountField id="details.customerPays" placeholder="1,000,000" />
          </CardLayout>
          {/* Customer Receives */}
          <CardLayout className="flex gap-2 items-end">
            <SelectFieldLayout
              label="Customer Receives"
              id="details.customerReceivesCurrency"
              options={CRYPTO_CURRENCIES}
              value={customerReceivesCurrency}
              onChange={(v) => setValue("details.customerReceivesCurrency", v)}
              className="w-28"
            />
            <AmountField id="details.customerReceives" placeholder="2,000" />
          </CardLayout>
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
            options={DELIVERY_SOURCES}
            placeholder="Select partner"
            value={watch("details.partner") ?? ""}
            onChange={(v) => setValue("details.partner", v)}
          />
          <CardLayout className="space-y-2">
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
            <div className="text-xs flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="font-medium leading-[20px] text-secondary-text">
                  Partners cost
                </span>
                {calculations?.partnerCost > 0 ? (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    ₦{calculations.partnerCost.toLocaleString()}
                  </span>
                ) : (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    ₦0.00
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="font-medium leading-[20px] text-secondary-text">
                  Margin per USDT
                </span>
                {calculations?.marginPerUnit > 0 ? (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    +₦{calculations.marginPerUnit.toLocaleString()}
                  </span>
                ) : (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    ₦0.00
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="font-medium leading-[20px] text-secondary-text">
                  Gross Margin
                </span>
                {calculations?.grossMargin > 0 ? (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    +₦{calculations.grossMargin.toLocaleString()}
                  </span>
                ) : (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    ₦0.00
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="font-medium leading-[20px] text-secondary-text">
                  Margin percentage
                </span>
                {calculations?.marginPercentage > 0 ? (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    {calculations.marginPercentage.toFixed(2)}%
                  </span>
                ) : (
                  <span className="font-normal text-[16px] text-text-teal leading-[24px]">
                    0.00%
                  </span>
                )}
              </div>
            </div>
          </CardLayout>
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Additional Info
        </h3>
        <CardLayout>
          <FormField
            id="details.internalNotes"
            label="Internal Notes (Optional)"
            register={register}
            placeholder="Add internal notes..."
            inputClassName="h-20"
          />
        </CardLayout>
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
