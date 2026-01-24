"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Lock, LockIcon, Mail, User, Users } from "lucide-react";
import FormField from "@/components/layout/FormField";
import PasswordField from "@/components/ui/PasswordField";
import { SignupFormData, signupSchema } from "@/lib/schema/signup.schema";
import { Alert, AlertDescription } from "../ui/alert";
import { useSuperAdminSignup } from "@/lib/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateAccountPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // ✅ validate as user types
    reValidateMode: "onChange",
  });

  const { error, mutate, data, isPending, isSuccess } = useSuperAdminSignup();

  const onSubmit = (data: SignupFormData) => {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    };
    mutate(payload, {
      onSuccess: () => {
        reset(), setShowSuccess(true);
      },
    });
  };

  if (showSuccess && isSuccess && data?.success) {
    return (
      <div className="bg-[#F9F9F9] flex items-center justify-center pb-4 px-4">
        <Card className="w-full max-w-md text-center space-y-[24px] border-[#E9EBEE] border p-10 rounded-[20px]">
          <div className="space-y-[38px]">
            <div className="flex justify-center">
              <div className="bg-green-500 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="font-[700] text-[20px] text-center leading-[44px]">
              Welcome to Xbanka ERP
            </h2>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 rounded-[8px] border border-dashed border-[#DADDE2] bg-[#F9F9F9] py-[12px] px-[16px]">
              <Check className="text-white bg-green-500 rounded-[4.67] p-[7px] h-[28px] w-[28px]" />
              <span className="text-sm text-[14px] leading-[20px] text-[#1B1D20]">
                Super Admin Role Created
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[8px] border border-dashed border-[#DADDE2] bg-[#F9F9F9] py-[12px] px-[16px]">
              <LockIcon className="text-white bg-green-500 rounded-[4.67] p-[7px] h-[28px] w-[28px]" />
              <span className="text-sm text-[14px] leading-[20px] text-[#1B1D20]">
                You control access to this system
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[8px] border border-dashed border-[#DADDE2] bg-[#F9F9F9] py-[12px] px-[16px]">
              <Users className="text-white bg-green-500 rounded-[4.67] p-[7px] h-[28px] w-[28px]" />
              <span className="text-sm text-[14px] leading-[20px] text-[#1B1D20]">
                Add your team to get started
              </span>
            </div>
          </div>
          <Link href="/signin">
            <Button className="w-full">Go to sign in page</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] flex items-center justify-center pb-4 px-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="font-[700] text-[20px] text-center leading-[44px]">
            Initialize Xbanka ERP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  icon={User}
                  register={register}
                  error={errors.firstName}
                />
                <FormField
                  id="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  icon={User}
                  register={register}
                  error={errors.lastName}
                />
              </div>

              <FormField
                id="email"
                label="Email Address"
                type="text" // <-- prevents native popup, uses Zod validation
                placeholder="john@example.com"
                icon={Mail}
                register={register}
                error={errors.email}
              />

              <PasswordField
                id="password"
                label="Password"
                placeholder="Enter your password"
                icon={Lock}
                register={register}
                error={errors.password}
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Enter your password"
                icon={Lock}
                register={register}
                error={errors.confirmPassword}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--abstractCyan)",
                  borderColor: "var(--abstractCyan)",
                }}
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
