"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, Mail, User } from "lucide-react"
import FormField from "@/components/layout/FormField"
import PasswordField from "@/components/ui/PasswordField"

interface CreateAccountFormData {
  fullName: string
  workEmail: string
  password: string
  confirmPassword: string
}

export default function CreateAccountPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateAccountFormData>()

  const password = watch("password")

  const onSubmit = (data: CreateAccountFormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match")
      return
    }
    console.log("Account created:", data)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-12 text-center border-blue-500 border-2">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-500 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Xbanka ERP</h2>
          <p className="text-gray-600 text-sm mb-6">Your account setup is complete</p>

          <div className="space-y-3 text-left mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">Super Admin Role Created</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.256 7.178a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75z" />
                <path
                  fillRule="evenodd"
                  d="M8.256 2.75a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM1.256 8.25a7 7 0 1114 0 7 7 0 01-14 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">You control access to this system</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.42 5.951 1.42a1 1 0 001.169-1.409l-7-14z" />
              </svg>
              <span className="text-sm text-gray-700">Add your team to get started</span>
            </div>
          </div>

          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12">Go to Dashboard</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">Initialize Xbanka ERP</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            id="fullName"
            label="Full name"
            placeholder="Enter your full name"
            icon={User}
            register={register}
            error={errors.fullName}
          />

          <FormField
            id="workEmail"
            label="Work Email address"
            type="email"
            placeholder="your.email@company.com"
            icon={Mail}
            register={register}
            error={errors.workEmail}
          />

          <PasswordField
            id="password"
            label="Password"
            placeholder="Enter password"
            icon={Lock}
            register={register}
            error={errors.password}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            icon={Lock}
            register={register}
            error={errors.confirmPassword}
          />

          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12">
            Create Super Admin Account
          </Button>
        </form>
      </Card>
    </div>
  )
}
