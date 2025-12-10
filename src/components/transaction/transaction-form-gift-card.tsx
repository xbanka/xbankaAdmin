"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectFieldLayout } from "../layout/SelectFieldLayout"
import { Upload } from "lucide-react"

interface GiftCardTransactionFormProps {
  onSubmit: (data: Record<string, string>) => void
  isLoading?: boolean
}

export function GiftCardTransactionForm({ onSubmit, isLoading = false }: GiftCardTransactionFormProps) {
  const [formData, setFormData] = useState({
    serviceType: "",
    cardType: "",
    cardFaceValue: "",
    currency: "",
    quantity: "",
    rayah: "",
    vendor: "",
    xibakaRate: "",
    margin: "",
    expectedPayout: "",
    giftCardCode: "",
    customerAccountWallet: "",
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
      {/* Service Type & Card Type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectFieldLayout
          id="serviceType"
          label="Service Type"
          options={["Gift Card", "Digital Card"]}
          placeholder="Select service"
          onChange={(value) => handleSelectChange("serviceType", value)}
        />
        <SelectFieldLayout
          id="cardType"
          label="Card Type"
          options={["Amazon", "iTunes", "Steam", "Google Play"]}
          placeholder="Select card type"
          onChange={(value) => handleSelectChange("cardType", value)}
        />
      </div>

      {/* Card Face Value & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardFaceValue">Card Face Value</Label>
          <Input
            id="cardFaceValue"
            name="cardFaceValue"
            placeholder="$100"
            value={formData.cardFaceValue}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <SelectFieldLayout
          id="currency"
          label="Currency"
          options={["Dollar (USD)", "Euro (EUR)", "Pound (GBP)"]}
          placeholder="Select currency"
          onChange={(value) => handleSelectChange("currency", value)}
        />
      </div>

      {/* Quantity & Rayah */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            placeholder="2"
            value={formData.quantity}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <SelectFieldLayout
          id="rayah"
          label="Rayah"
          options={["Rayah"]}
          placeholder="Select"
          onChange={(value) => handleSelectChange("rayah", value)}
        />
      </div>

      {/* Vendor, Xibaka Rate, Margin */}
      <div className="grid grid-cols-3 gap-4">
        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["Rayah", "Direct", "Broker"]}
          placeholder="Select vendor"
          onChange={(value) => handleSelectChange("vendor", value)}
        />
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

      {/* Expected Payout & Gift Card Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expectedPayout">Expected Payout</Label>
          <Input
            id="expectedPayout"
            name="expectedPayout"
            placeholder="₦146,750"
            value={formData.expectedPayout}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <div>
          <Label htmlFor="giftCardCode">Gift Card Code</Label>
          <Input
            id="giftCardCode"
            name="giftCardCode"
            placeholder="00234564684648"
            value={formData.giftCardCode}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
      </div>

      {/* Customer Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerAccountWallet">Customer Account/Wallet</Label>
          <Input
            id="customerAccountWallet"
            name="customerAccountWallet"
            placeholder="GTB - 0123456789"
            value={formData.customerAccountWallet}
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
