"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectFieldLayout } from "../layout/SelectFieldLayout"
import { Upload } from "lucide-react"
import { TransactionType } from "./types"
import { GiftCardTransactionFormValues, giftCardTransactionSchema } from "@/lib/schema/giftcard-transaction.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormField from "../layout/FormField"
import { SERVICE_TYPE_LABELS } from "@/lib/helper"

interface GiftCardTransactionFormProps {
    serviceType: TransactionType
  isLoading?: boolean
}

export function GiftCardTransactionForm({ isLoading = false, serviceType }: GiftCardTransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GiftCardTransactionFormValues>({
    resolver: zodResolver(giftCardTransactionSchema),
    defaultValues: {
      serviceType: "",
      cardType: "",
      cardFaceValue: "",
      currency: "",
      quantity: "",
      rayah: "",
      vendor: "",
      xbankaRate: "",
      margin: "",
      expectedPayout: "",
      giftCardCode: "",
      customerAccountWallet: "",
      paymentDate: "",
    },
  })

  useEffect(() => {
    if (serviceType) {
      setValue("serviceType", SERVICE_TYPE_LABELS[serviceType])
    }
  }, [serviceType, setValue])

  const onSubmit = (data: GiftCardTransactionFormValues) => {
    console.log("Gift card transaction:", data)
  }

  return (
    <div onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Service Type & Card Type */}
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
          id="cardType"
          label="Card Type"
          options={["Amazon", "iTunes", "Steam", "Google Play"]}
          value={watch("cardType")}
          onChange={(value) => setValue("cardType", value)}
          error={errors.cardType}
        />
      </div>

      {/* Card Face Value & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="cardFaceValue"
          label="Card Face Value"
          placeholder="$100"
          register={register}
          error={errors.cardFaceValue}
        />

        <SelectFieldLayout
          id="currency"
          label="Currency"
          options={["Dollar (USD)", "Euro (EUR)", "Pound (GBP)"]}
          value={watch("currency")}
          onChange={(value) => setValue("currency", value)}
          error={errors.currency}
        />
      </div>

      {/* Quantity & Rayah */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="quantity"
          label="Quantity"
          placeholder="2"
          register={register}
          error={errors.quantity}
        />

        <SelectFieldLayout
          id="rayah"
          label="Rayah"
          options={["Rayah"]}
          value={watch("rayah")}
          onChange={(value) => setValue("rayah", value)}
          error={errors.rayah}
        />
      </div>

      {/* Vendor, Xbanka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["Rayah", "Direct", "Broker"]}
          value={watch("vendor")}
          onChange={(value) => setValue("vendor", value)}
          error={errors.vendor}
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

      {/* Expected Payout & Gift Card Code */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="expectedPayout"
          label="Expected Payout"
          placeholder="₦146,750"
          register={register}
          error={errors.expectedPayout}
        />

        <FormField
          id="giftCardCode"
          label="Gift Card Code"
          placeholder="00234564684648"
          register={register}
          error={errors.giftCardCode}
        />
      </div>

      {/* Customer Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="customerAccountWallet"
          label="Customer Account / Wallet"
          placeholder="GTB - 0123456789"
          register={register}
          error={errors.customerAccountWallet}
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
          <p className="text-sm text-gray-600">Upload screenshot, receipt, or proof document</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, OR PDF • Max 5MB</p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        disabled={isLoading}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11"
      >
        {isLoading ? "Submitting..." : "Submit for Verification"}
      </Button>
    </div>
  )
}
