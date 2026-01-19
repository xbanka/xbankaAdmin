"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import FormField from "../FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import z from "zod";
import { forgotPasswordErp } from "@/lib/actions/passwordActions";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordTypes } from "@/lib/actions/actionTypes";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type forgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { error, mutate, isPending } = useMutation({
    mutationFn: (data: forgotPasswordTypes) => forgotPasswordErp(data),
    onSuccess: (result) => {
      toast.success(result.data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (data: forgotPasswordData) => {
    mutate(data);
  };
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
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-6">
              <FormField
                id="email"
                label="Email Address"
                type="text" // <-- prevents native popup, uses Zod validation
                placeholder="john@example.com"
                icon={Mail}
                register={register}
                error={errors.email}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {/* <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--abstractCyan)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div> */}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                style={{
                  backgroundColor: "var(--abstractCyan)",
                  borderColor: "var(--abstractCyan)",
                }}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[var(--abstractCyan)] hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
