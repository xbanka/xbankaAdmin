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
import { useSignup } from "@/hooks/SignupService";
import Image from "next/image";
import { useState } from "react";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

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
      <Card className="w-full max-w-sm mx-auto">
        <CardContent>
          <div className="text-center space-y-3">
            <div className="w-10 h-10 bg-[var(--customCyan)] rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5 text-[var(--abstractCyan)]" />
            </div>
            <h2 className="text-[20px] font-bold text-gray-900">
              Check Your Email
            </h2>
            <p className="text-gray-600 text-[16px]">
              We&apos;ve sent a verification link to your email address. Please
              check your inbox and click the link to verify your account.
            </p>
            <Link href="">
              <Button
                className="w-full"
                size="sm"
                onClick={() => setShowSuccess(false)}
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
      <div className="relative h-[100px] mx-auto w-[200px]">
        <Image
          src="/xBankaLogo.svg"
          alt="xbanka"
          className="object-cover"
          fill
        />
      </div>
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
