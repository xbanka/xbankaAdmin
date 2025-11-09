"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { PayoutData } from "@/app/(dashboard)/finance/page"
import CustomDetailsName from "./CustomDetailsName"

interface PayoutDetailsSidebarProps {
  isOpen: boolean
  onClose: () => void
  payout: PayoutData
  onDecline: () => void
  onProcess: () => void
}

export function PayoutDetailsSidebar({ isOpen, onClose, payout, onDecline, onProcess }: PayoutDetailsSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 overflow-hidden transition-opacity" onClick={onClose} />

      {/* Sidebar - slides from right */}
      <div
        className={`fixed bg-white right-0 top-0 h-screen w-full overflow-x-hidden max-w-md shadow-lg z-50 transform flex flex-col justify-between items-start transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#E5E3E3] px-4 py-[19px] flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Request Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="py-[16px] px-[24px] space-y-6 bg-[#F5F5F5]">
            {/* Affiliate Info */}
            <div>
              <h3 className="text-[14px] leading-[20px] font-[500] text-[#585859] mb-2">Affiliate Info</h3>
              <div className="grid grid-cols-3 gap-4 bg-white rounded-2 p-3">
              
                <CustomDetailsName title="Name" body={payout.affiliate} />
                <CustomDetailsName title="Username" body={payout.affiliateHandle} />
                <CustomDetailsName title="Status" body="Verified" />
                <CustomDetailsName title="Commission rate" body={`${payout.commissionRate}%`} />
                <CustomDetailsName title="Total payout" body={`₦${payout.walletBalance.toLocaleString()}`} />
                <CustomDetailsName title="Joined" body={`₦${payout.walletBalance.toLocaleString()}`} />
              </div>
            </div>
            {/* Note */}
            {payout.note && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Note</h3>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">{payout.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 py-[16px] px-[20px] flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent w-[176px]" onClick={onDecline}>
            Decline Request
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent w-[176px]" onClick={onDecline}>
            Hold/Flag Payout
          </Button>
          <Button className="flex-1 text-white w-[176px]" onClick={onProcess}>
            Process Payout
          </Button>
        </div>
      </div>
    </>
  )
}
