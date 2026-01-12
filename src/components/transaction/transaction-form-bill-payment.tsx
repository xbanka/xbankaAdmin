"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { SelectFieldLayout } from "../layout/SelectFieldLayout";
import { TransactionType } from "../../lib/types/transactionTypes";
import { SERVICE_TYPE_LABELS } from "@/lib/utils/helper";
import {
  BillPaymentTransactionFormValues,
  billPaymentTransactionSchema,
} from "@/lib/schema/bill-payment-transaction.schema";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../layout/FormField";
import { SearchSelectFieldLayout } from "../layout/SearchableSelectLayout";

export function BillPaymentTransactionForm() {
  //  const {
  //     register,
  //     handleSubmit,
  //     setValue,
  //     watch,
  //     formState: { errors },
  //   } = useForm<BillPaymentTransactionFormValues>({
  //     resolver: zodResolver(billPaymentTransactionSchema),
  //     defaultValues: {
  //       serviceType: "",
  //       billCategory: "",
  //       amountToPay: "",
  //       quantity: "",
  //       vendor: "",
  //       meterNumber: "",
  //       meterType: "",
  //       transactionFee: "",
  //       receivingAccountWallet: "",
  //       paymentDate: "",
  //     },
  //   })

  const { watch, setValue, register } = useFormContext();

  const onSubmit = (data: BillPaymentTransactionFormValues) => {
    console.log("Bill payment transaction:", data);
  };

  return (
    <form className="space-y-5">
      {/* Service Type & Transaction Type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="serviceType"
          label="Service Type"
          options={["crypto", "gift-card", "bill-payments"]}
          value={watch("serviceType")}
          onChange={(value) =>
            setValue("serviceType", value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          // error={errors.serviceType}
        />

        <SearchSelectFieldLayout
          id="billCategory"
          label="Bill Category"
          options={["Electricity", "Water", "Internet", "Gas"]}
          value={watch("billCategory")}
          onChange={(value) => setValue("billCategory", value)}
          // error={errors.billCategory}
        />
      </div>

      {/* Meter Number & Meter Type */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="meterNumber"
          label="Meter Number"
          placeholder="01234567"
          register={register}
          // error={errors.meterNumber}
        />

        <SelectFieldLayout
          id="meterType"
          label="Meter Type"
          options={["Prepaid", "Postpaid"]}
          value={watch("meterType")}
          onChange={(value) => setValue("meterType", value)}
          // error={errors.meterType}
        />
      </div>

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="amountToPay"
          label="Amount to Pay"
          placeholder="₦5,000"
          register={register}
          // error={errors.amountToPay}
        />

        <FormField
          id="transactionFee"
          label="Transaction Fee"
          placeholder="₦5,000"
          register={register}
          // error={errors.transactionFee}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="quantity"
          label="Quantity"
          placeholder="₦5,000"
          register={register}
          // error={errors.quantity}
        />

        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["Rayosh"]}
          value={watch("vendor")}
          onChange={(value) => setValue("vendor", value)}
          // error={errors.vendor}
        />
      </div>

      {/* Receiving Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="receivingAccountWallet"
          label="Receiving Account / Wallet"
          placeholder="GTB - 0123456789"
          register={register}
          // error={errors.receivingAccountWallet}
        />

        <FormField
          id="paymentDate"
          label="Payment Date"
          type="date"
          register={register}
          // error={errors.paymentDate}
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
      <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11">
        Submit for Verification
      </Button>
    </form>
  );
}
