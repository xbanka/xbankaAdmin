"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signupAction } from "@/lib/actions/actions";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordField from "../ui/PasswordField";

const signupSchema = z.object({
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
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { data, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: SignupFormData) => signupAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        // Show API error in alert
        console.log(result.message);
        //   setErrorMessage(result.message)
      } else {
        console.log("Signup success!", result.data);
        router.push("/auth/verify");
        reset();
      }
    },
    onError: (err) => {
      console.log("Signup failed:", err);
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Signup to your account</CardTitle>
        <CardDescription>
          Enter your details below to signup to your account
        </CardDescription>
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
            {isSuccess && !data?.success && (
              <Alert variant="destructive">
                <AlertDescription>{data.message}</AlertDescription>
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
              href="/auth/signin"
              className="font-semibold text-[var(--abstractCyan)] hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
