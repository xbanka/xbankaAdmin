"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User } from "lucide-react";
import FormField from "./FormField";
import PasswordField from "../ui/PasswordField";
import { useSignup } from "@/lib/services/signup.service";
import { useState } from "react";
import { SignupFormData, signupSchema } from "@/lib/schema/signup.schema";

export default function SignupForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { data, error, mutate, isSuccess, isPending } = useSignup();

  const onSubmit = async (data: SignupFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset(), 
        setShowSuccess(true);
      },
    });
  };

  if (showSuccess && isSuccess && data?.success) {
    return (
      <Card className="w-full max-w-sm mx-auto p-[40px] rounded-[20px]">
        <CardContent className="p-0">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 bg-[var(--customCyan)] rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5 text-[var(--abstractCyan)]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1B1D20]">
              Go to sign in page
            </h2>
            <p className="text-[#4B5563] font-[400] text-[16px]">
              Your account has been created successfully
            </p>
            <Link href="/signin">
              <Button
                className="w-full"
                size="sm"
              >
                Ok
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="px-[25px] md:px-0">
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Signup to your account</CardTitle>
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

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-semibold text-[var(--abstractCyan)] hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
