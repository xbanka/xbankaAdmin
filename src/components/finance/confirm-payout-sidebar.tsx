"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload, Trash2 } from "lucide-react"
import type { PayoutData } from "@/app/(dashboard)/finance/page"

interface ConfirmPayoutSidebarProps {
  isOpen: boolean
  onClose: () => void
  payout: PayoutData
  onConfirm: () => void
}

export function ConfirmPayoutSidebar({ isOpen, onClose, payout, onConfirm }: ConfirmPayoutSidebarProps) {
  const [formData, setFormData] = useState({
    accountSource: "DTB - 0123456789",
    paymentReference: "",
    bankReference: "",
    attachments: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: Array.from(e.target.files || []),
      }))
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Confirm Payout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Details Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-semibold text-foreground">₦{payout.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm font-semibold text-foreground">{payout.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bank Details</span>
                <span className="text-sm font-semibold text-foreground font-mono">{payout.bankDetails}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Processing Information</h3>
            <div className="space-y-4">
              {/* Account Source */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Select Account Source</label>
                <div className="relative">
                  <select className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>DTB - 0123456789</option>
                    <option>GTBank - 0987654321</option>
                    <option>Access Bank - 0111222333</option>
                  </select>
                </div>
              </div>

              {/* Payment Reference */}
              <div>
                <label htmlFor="paymentReference" className="block text-xs font-semibold text-gray-700 mb-2">
                  Payment Reference
                </label>
                <Input
                  id="paymentReference"
                  name="paymentReference"
                  placeholder="e.g REF88656WER"
                  value={formData.paymentReference}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>

              {/* Bank Reference */}
              <div>
                <label htmlFor="bankReference" className="block text-xs font-semibold text-gray-700 mb-2">
                  Bank Reference
                </label>
                <Input
                  id="bankReference"
                  name="bankReference"
                  placeholder="e.g REF88656WER"
                  value={formData.bankReference}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Attachments</h3>
            <p className="text-xs text-gray-500 mb-3">Upload screenshot, receipt or proof of transaction</p>

            {/* Upload Area */}
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-5 h-5 text-gray-400" />
                <div className="text-xs">
                  <p className="font-medium text-gray-700">Upload screenshot, receipt or proof document</p>
                  <p className="text-gray-500">JPG, PNG, PDF, Max 5 MB</p>
                </div>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </label>

            {/* Uploaded Files */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleConfirm}>
            Confirm Payout
          </Button>
        </div>
      </div>
    </>
  )
}
