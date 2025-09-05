"use client";

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
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signupAction } from "@/lib/actions/actions";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
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

  // if (showSuccess && isSuccess && data?.success) {
  //   return (
  //     <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
  //       <CardContent className="pt-2">
  //         <div className="text-center space-y-3">
  //           <div className="w-10 h-10 bg-[var(--customCyan)] rounded-full flex items-center justify-center mx-auto">
  //             <Mail className="w-5 h-5 text-[var(--abstractCyan)]" />
  //           </div>
  //           <h2 className="text-[20px] font-bold text-gray-900">
  //             Check Your Email
  //           </h2>
  //           <p className="text-gray-600 text-[16px]">
  //             We&apos;ve sent a verification link to your email address. Please
  //             check your inbox and click the link to verify your account.
  //           </p>
  //           <Link href="">
  //             <Button
  //               className="w-full h-12 text-gray-900 font-semibold"
  //               style={{
  //                 backgroundColor: "var(--abstractCyan)",
  //                 borderColor: "var(--abstractCyan)",
  //               }}
  //               onClick={() => setShowSuccess(false)}
  //             >
  //               Ok
  //             </Button>
  //           </Link>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card className="w-[60%] mx-auto mt-[100px] shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-foreground">
          Join Our Team
        </CardTitle>
        <CardDescription className="text-foreground">
          Create your xbanka dashboard account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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
              <p className="text-[10px] text-mainRed">{errors.password.message}</p>
            )}
          </div>

          {isSuccess && !data?.success && (
            <Alert variant="destructive">
              <AlertDescription>{data.message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-gray-900 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--abstractCyan)",
              borderColor: "var(--abstractCyan)",
            }}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/affiliate/auth/login"
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
