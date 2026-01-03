"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"
import type { CustomerLogDetails } from "./types"

const customerLogSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankAccount: z.string().min(1, "Bank account is required"),
})

type CustomerLogFormValues = z.infer<typeof customerLogSchema>

interface CustomerLogDetailsFormProps {
  onClose: () => void
  onSave: (data: CustomerLogDetails) => void
}

export function CustomerLogDetailsForm({ onClose, onSave }: CustomerLogDetailsFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerLogFormValues>({
    resolver: zodResolver(customerLogSchema),
    defaultValues: {
      customerName: "John Doe",
      email: "john@gmail.com",
      phoneNumber: "+234 7073456678",
      address: "Start typing address",
      bankName: "GTB",
      bankAccount: "e.g 0123456789",
    },
  })

  const onSubmit = (data: CustomerLogFormValues) => {
    onSave({
      ...data,
      documents: [],
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Customer Log Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer name</label>
            <Controller
              name="customerName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="John Doe" className={errors.customerName ? "border-red-500" : ""} />
              )}
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="john@gmail.com"
                  className={errors.email ? "border-red-500" : ""}
                />
              )}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="+234 7073456678"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
              )}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">📍</div>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Start typing address"
                    className={`pl-8 ${errors.address ? "border-red-500" : ""}`}
                  />
                )}
              />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Bank</option>
                  <option value="GTB">GTB</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="First Bank">First Bank</option>
                  <option value="UBA">UBA</option>
                </select>
              )}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>}
          </div>

          {/* Bank Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
            <Controller
              name="bankAccount"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g 0123456789" className={errors.bankAccount ? "border-red-500" : ""} />
              )}
            />
            {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount.message}</p>}
          </div>

          {/* Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
            <p className="text-xs text-gray-500 mb-3">You can add any of your NIN, Voter card, etc</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag and drop an image here, or</p>
              <p className="text-sm text-teal-600 font-medium">Browse Files</p>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF • Max 5MB</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
              Save Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
