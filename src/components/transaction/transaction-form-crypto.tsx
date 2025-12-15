"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { TransactionType } from "./types";
import { useForm } from "react-hook-form";
import { SERVICE_TYPE_LABELS } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CryptoTransactionFormValues,
  cryptoTransactionSchema,
} from "@/lib/schema/crypto-transaction.schema";
import FormField from "../layout/FormField";

interface CryptoTransactionFormProps {
  serviceType: TransactionType;
  isLoading?: boolean;
}

export function CryptoTransactionForm({
  isLoading = false,
  serviceType,
}: CryptoTransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CryptoTransactionFormValues>({
    resolver: zodResolver(cryptoTransactionSchema),
    defaultValues: {
      serviceType: "",
      transactionType: "",
      customerAmount: "",
      vendor: "",
      vendorRate: "",
      xbankaRate: "",
      margin: "",
      expectedPayout: "",
      customerAccountWallet: "",
      xbankaAccount: "",
      paymentDate: "",
    },
  });

  useEffect(() => {
    if (serviceType) {
      setValue("serviceType", SERVICE_TYPE_LABELS[serviceType]);
    }
  }, [serviceType, setValue]);

  const onSubmit = (data: CryptoTransactionFormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service Type & Transaction Type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="serviceType"
          label="Service Type"
          options={["Crypto", "Gift Card", "Bills Payment"]}
          value={watch("serviceType")}
          onChange={(value) => setValue("serviceType", value)}
          error={errors.serviceType}
        />

        <SelectFieldLayout
          id="transactionType"
          label="Transaction Type"
          options={["USDT - NGN", "BTC - NGN", "ETH - NGN"]}
          value={watch("transactionType")}
          onChange={(value) => setValue("transactionType", value)}
          error={errors.transactionType}
        />
      </div>

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="customerAmount"
          label="Customer Amount"
          placeholder="100 USDT"
          register={register}
          error={errors.customerAmount}
        />

        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["Rayah", "Binance", "Kraken"]}
          value={watch("vendor")}
          onChange={(value) => setValue("vendor", value)}
          error={errors.vendor}
        />
      </div>

      {/* Vendor Rate, Xibaka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          id="vendorRate"
          label="Vendor Rate"
          placeholder="1467"
          register={register}
          error={errors.vendorRate}
        />
        <FormField
          id="xbankaRate"
          label="Xbanka Rate"
          placeholder="1467.5"
          register={register}
          error={errors.xbankaRate}
        />
        <FormField
          id="margin"
          label="Margin"
          placeholder="0.5"
          register={register}
          error={errors.margin}
        />
      </div>

      {/* Expected Payout & Customer Account */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="expectedPayout"
          label="Expected Payout"
          placeholder="₦146,750"
          register={register}
          error={errors.expectedPayout}
        />
        <FormField
          id="customerAccountWallet"
          label="Customer Account / Wallet"
          placeholder="GTB - 0123456789"
          register={register}
          error={errors.customerAccountWallet}
        />
      </div>

      {/* Xibaka Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="xbankaAccount"
          label="Xbanka Account"
          placeholder="GTB - 0123456789"
          register={register}
          error={errors.xbankaAccount}
        />
        <FormField
          id="paymentDate"
          label="Payment Date"
          type="date"
          register={register}
          error={errors.paymentDate}
        />
      </div>

      {/* Attachments */}
      <div>
        <Label>Attachments</Label>
        <div className="mt-2 border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Upload screenshot, receipt, or proof document
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, OR PDF • Max 5MB
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        disabled={isLoading}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11"
      >
        {isLoading ? "Submitting..." : "Submit for Verification"}
      </Button>
    </form>
  );
}
