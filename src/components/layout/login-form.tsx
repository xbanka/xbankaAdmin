"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginAction } from "@/lib/actions/actions";
import { useMutation } from "@tanstack/react-query";
import { loginTypes } from "@/lib/actions/actionTypes";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import { toast } from "sonner";
import { decodeAccessToken } from "@/lib/decodeToken";
import { useUserStore } from "@/store/userStore";
import PasswordField from "../ui/PasswordField";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { data, mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: loginTypes) => loginAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        // Show API error in alert
        console.log(result.message);
        toast.error(result.message);
        //   setErrorMessage(result.message)
      } else {
        console.log("Signup success!", result.data);
        decodeAccessToken(result.data.accessToken);
        const data = {
          firstName: result.data.firstName,
          role: result.data.role,
        };
        console.log(data);
        setUser(data);
        toast.success("User Loggedin");
        router.push("/dashboard");
      }
    },
    onError: (err) => {
      console.log("Signup failed:", err);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back, Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
              href="/auth/signup"
              className="font-semibold text-[var(--abstractCyan)] hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
