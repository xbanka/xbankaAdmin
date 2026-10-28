"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock } from "lucide-react";
import FormField from "../forms/FormField";
import PasswordField from "../ui/PasswordField";
import Image from "next/image";
import { LoginFormData, loginSchema } from "@/lib/schema/login.schema";
import { useLogin } from "@/lib/services/login.service";
import { TwoFactorLoginStep } from "./two-factor-login-step";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Set when the password was right but the account has 2FA on. Memory only:
  // the doc forbids persisting it, and a reload should restart the login.
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const { error, mutate, isPending, reset } = useLogin({
    onMfaRequired: (token) => {
      setNotice(null);
      setMfaToken(token);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setNotice(null);
    mutate(data);
  };

  const backToPassword = useCallback(
    (message: string | null) => {
      setMfaToken(null);
      setNotice(message);
      reset();
    },
    [reset],
  );
  const onExpired = useCallback(
    (message: string) => backToPassword(message),
    [backToPassword],
  );

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
        <Card className="w-full max-w-[500px] mx-auto">
          <CardHeader>
            <CardTitle className="font-[700] text-[36px] leading-[44px] text-[#1B1D20] text-center">
              Sign Into Your Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mfaToken ? (
              <TwoFactorLoginStep
                mfaToken={mfaToken}
                onExpired={onExpired}
                onBack={() => backToPassword(null)}
              />
            ) : (
            <>
            {notice && (
              <Alert>
                <AlertDescription>{notice}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-6">
                <FormField
                  id="email"
                  type="text"
                  placeholder="john@example.com"
                  icon={Mail}
                  register={register}
                  error={errors.email}
                />
                <PasswordField
                  id="password"
                  placeholder="Enter your password"
                  icon={Lock}
                  register={register}
                  error={errors.password}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--abstractCyan)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full text-[#FFFFFF] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
