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
    <Card className="w-[40%] mx-auto mt-[100px] shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to your xbanka dashboard account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="email"
            label="Email Address"
            type="text" // <-- prevents native popup, uses Zod validation
            placeholder="john@example.com"
            icon={Mail}
            register={register}
            error={errors.email}
          />

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-[var(--abstractCyan)] focus:ring-[var(--abstractCyan)]"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

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
            className="w-full h-12 text-gray-900 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--abstractCyan)",
              borderColor: "var(--abstractCyan)",
            }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
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
