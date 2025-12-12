"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { SelectFieldLayout } from "../layout/SelectFieldLayout"

interface BillPaymentTransactionFormProps {
  onSubmit: (data: Record<string, string>) => void
  isLoading?: boolean
}

export function BillPaymentTransactionForm({ onSubmit, isLoading = false }: BillPaymentTransactionFormProps) {
  const [formData, setFormData] = useState({
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
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <div className="space-y-5">
      {/* Service Type & Transaction Type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="serviceType"
          label="Service Type"
           options={["Crypto", "Gift Card", "Bills Payment"]}
          placeholder="Select service"
          onChange={(value) => handleSelectChange("serviceType", value)}
        />
        <SelectFieldLayout
          id="transactionType"
          label="Transaction Type"
          options={["Electricity Bill", "Water Bill", "Internet Bill"]}
          placeholder="Select type"
          onChange={(value) => handleSelectChange("transactionType", value)}
        />
      </div>

      {/* Bill Category */}
      <SelectFieldLayout
        id="billCategory"
        label="Bill Category"
        options={["Electricity", "Water", "Internet", "Gas"]}
        placeholder="Select category"
        onChange={(value) => handleSelectChange("billCategory", value)}
      />

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerAmount">Customer Amount</Label>
          <Input
            id="customerAmount"
            name="customerAmount"
            placeholder="₦5,000"
            value={formData.customerAmount}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["EKEDC", "IKEJA", "ENUGU", "JED"]}
          placeholder="Select vendor"
          onChange={(value) => handleSelectChange("vendor", value)}
        />
      </div>

      {/* Vendor Rate, Xibaka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="vendorRate">Vendor Rate</Label>
          <Input
            id="vendorRate"
            name="vendorRate"
            placeholder="1467"
            value={formData.vendorRate}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <div>
          <Label htmlFor="xibakaRate">Xibaka Rate</Label>
          <Input
            id="xibakaRate"
            name="xibakaRate"
            placeholder="1467.5"
            value={formData.xibakaRate}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <div>
          <Label htmlFor="margin">Margin</Label>
          <Input
            id="margin"
            name="margin"
            placeholder="0.5"
            value={formData.margin}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
      </div>

      {/* Meter Number & Meter Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meterNumber">Meter Number</Label>
          <Input
            id="meterNumber"
            name="meterNumber"
            placeholder="01234567"
            value={formData.meterNumber}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <SelectFieldLayout
          id="meterType"
          label="Meter Type"
          options={["Prepaid", "Postpaid"]}
          placeholder="Select type"
          onChange={(value) => handleSelectChange("meterType", value)}
        />
      </div>

      {/* Prepaid & Transaction Fee */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="prepaid"
          label="Prepaid"
          options={["Yes", "No"]}
          placeholder="Select"
          onChange={(value) => handleSelectChange("prepaid", value)}
        />
        <div>
          <Label htmlFor="transactionFee">Transaction Fee</Label>
          <Input
            id="transactionFee"
            name="transactionFee"
            placeholder="₦50"
            value={formData.transactionFee}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
      </div>

      {/* Receiving Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="receivingAccountWallet">Receiving Account/Wallet</Label>
          <Input
            id="receivingAccountWallet"
            name="receivingAccountWallet"
            placeholder="GTB - 0123456789"
            value={formData.receivingAccountWallet}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <div>
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input
            id="paymentDate"
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
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
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11"
      >
        {isLoading ? "Submitting..." : "Submit for Verification"}
      </Button>
    </div>
  )
}
