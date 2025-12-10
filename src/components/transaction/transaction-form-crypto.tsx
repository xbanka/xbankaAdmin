"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { SelectFieldLayout } from "../layout/SelectFieldLayout"

interface CryptoTransactionFormProps {
  onSubmit: (data: Record<string, string>) => void
  isLoading?: boolean
}

export function CryptoTransactionForm({ onSubmit, isLoading = false }: CryptoTransactionFormProps) {
  const [formData, setFormData] = useState({
    serviceType: "",
    transactionType: "",
    customerAmount: "",
    vendor: "",
    vendorRate: "",
    xibakaRate: "",
    margin: "",
    expectedPayout: "",
    customerAccountWallet: "",
    xibakaAccount: "",
    paymentDate: "",
    meterNumber: "",
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
          options={["Crypto Transfer", "Crypto Exchange"]}
          placeholder="Select service"
          onChange={(value) => handleSelectChange("serviceType", value)}
        />
        <SelectFieldLayout
          id="transactionType"
          label="Transaction Type"
          options={["USDT - NGN", "BTC - NGN", "ETH - NGN"]}
          placeholder="Select type"
          onChange={(value) => handleSelectChange("transactionType", value)}
        />
      </div>

      {/* Customer Amount & Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerAmount">Customer Amount</Label>
          <Input
            id="customerAmount"
            name="customerAmount"
            placeholder="100 USDT"
            value={formData.customerAmount}
            onChange={handleInputChange}
            className="mt-2 h-10"
          />
        </div>
        <SelectFieldLayout
          id="vendor"
          label="Vendor"
          options={["Rayah", "Binance", "Kraken"]}
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

      {/* Expected Payout & Customer Account */}
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
      </div>

      {/* Xibaka Account & Payment Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="xibakaAccount">Xibaka Account</Label>
          <Input
            id="xibakaAccount"
            name="xibakaAccount"
            placeholder="GTB - 0123456789"
            value={formData.xibakaAccount}
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
