"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock } from "lucide-react";
import FormField from "./FormField";
import PasswordField from "../ui/PasswordField";
import Image from "next/image";
import { LoginFormData, loginSchema } from "@/lib/schema/login.schema";
import { useLogin } from "@/lib/services/login.service";

export default function LoginForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { error, mutate, isPending } = useLogin()

  const onSubmit = async (data: LoginFormData) => {
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
      <div className="px-[25px] md:px-0">
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Welcome Back, Login to your account</CardTitle>
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
                <PasswordField
                  id="password"
                  label="Password"
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
    </div>
  );
}
