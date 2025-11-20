"use client";

import type React from "react";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  passwordResetErp,
  passwordResetErpProps,
} from "@/lib/actions/passwordActions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PasswordField from "../ui/PasswordField";
import Image from "next/image";
// import { useRouter } from "next/navigation"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent({ token }: { token?: string }) {
  //   const router = useRouter()

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: passwordResetErpProps) => passwordResetErp(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      toast.success(data.data?.message || "Bank details updated successfully!");
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    mutate({ ...data, token });
  };

  return (
    <main className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Password</CardTitle>
          <CardDescription>
            Enter your new password below to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PasswordField
              id="password"
              label="New Password"
              placeholder="••••••••"
              register={register}
              error={errors.password}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters required
            </p>

            <PasswordField
              id="confirm"
              label="Confirm Password"
              placeholder="••••••••"
              register={register}
              error={errors.confirm}
              disabled={isPending}
            />

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              type="submit"
              size="sm"
              disabled={isPending}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm">
            <p className="text-muted-foreground">
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage({ token }: { token?: string }) {
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
      <Suspense
        fallback={
          <main className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </main>
        }
      >
        <ResetPasswordContent token={token} />
      </Suspense>
    </div>
  );
}
