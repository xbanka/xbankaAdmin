"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { SelectFieldLayout } from "../layout/SelectFieldLayout"
import { TransactionType } from "./types"
import { SERVICE_TYPE_LABELS } from "@/lib/helper"
import { BillPaymentTransactionFormValues, billPaymentTransactionSchema } from "@/lib/schema/bill-payment-transaction.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormField from "../layout/FormField"

interface BillPaymentTransactionFormProps {
     serviceType: TransactionType
  isLoading?: boolean
}

export function BillPaymentTransactionForm({ isLoading = false, serviceType }: BillPaymentTransactionFormProps) {
 const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BillPaymentTransactionFormValues>({
    resolver: zodResolver(billPaymentTransactionSchema),
    defaultValues: {
      serviceType: "",
      transactionType: "",
      billCategory: "",
      customerAmount: "",
      vendor: "",
      vendorRate: "",
      xibakaRate: "",
      margin: "",
      meterNumber: "",
      meterType: "",
      prepaid: "",
      transactionFee: "",
      receivingAccountWallet: "",
      paymentDate: "",
    },
  })

  useEffect(() => {
    if (serviceType) {
      setValue("serviceType", SERVICE_TYPE_LABELS[serviceType])
    }
  }, [serviceType, setValue])

  const onSubmit = (data: BillPaymentTransactionFormValues) => {
    console.log("Bill payment transaction:", data)
  }


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
          options={["Electricity Bill", "Water Bill", "Internet Bill"]}
          value={watch("transactionType")}
          onChange={(value) => setValue("transactionType", value)}
          error={errors.transactionType}
        />
      </div>

      {/* Bill Category */}
      <SelectFieldLayout
        id="billCategory"
        label="Bill Category"
        options={["Electricity", "Water", "Internet", "Gas"]}
        value={watch("billCategory")}
        onChange={(value) => setValue("billCategory", value)}
        error={errors.billCategory}
      />

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="customerAmount"
          label="Customer Amount"
          placeholder="₦5,000"
          register={register}
          error={errors.customerAmount}
        />

        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["EKEDC", "IKEJA", "ENUGU", "JED"]}
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
          id="xibakaRate"
          label="Xibaka Rate"
          placeholder="1467.5"
          register={register}
          error={errors.xibakaRate}
        />

        <FormField
          id="margin"
          label="Margin"
          placeholder="0.5"
          register={register}
          error={errors.margin}
        />
      </div>

      {/* Meter Number & Meter Type */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="meterNumber"
          label="Meter Number"
          placeholder="01234567"
          register={register}
          error={errors.meterNumber}
        />

        <SelectFieldLayout
          id="meterType"
          label="Meter Type"
          options={["Prepaid", "Postpaid"]}
          value={watch("meterType")}
          onChange={(value) => setValue("meterType", value)}
          error={errors.meterType}
        />
      </div>

      {/* Prepaid & Transaction Fee */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="prepaid"
          label="Prepaid"
          options={["Yes", "No"]}
          value={watch("prepaid")}
          onChange={(value) => setValue("prepaid", value)}
          error={errors.prepaid}
        />

        <FormField
          id="transactionFee"
          label="Transaction Fee"
          placeholder="₦50"
          register={register}
          error={errors.transactionFee}
        />
      </div>

      {/* Receiving Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="receivingAccountWallet"
          label="Receiving Account / Wallet"
          placeholder="GTB - 0123456789"
          register={register}
          error={errors.receivingAccountWallet}
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
    </form>
  )
}
