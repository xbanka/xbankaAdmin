"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifyEmailAction } from "@/lib/actions/actions";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const VerifyPage = ({ token }: { token?: string }) => {

  const { data, mutate, isSuccess, isPending, error, isError } = useMutation({
    mutationFn: (token: string) => verifyEmailAction(token),
  });

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [mutate, token]);

  if (isSuccess && data?.success) {
    return (
      <Card className="w-full mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-2 text-center space-y-3">
            <div className="w-10 h-10 bg-[var(--customCyan)] rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5 text-[var(--abstractCyan)]" />
            </div>
            <h2 className="text-[20px] font-bold text-gray-900">
              Account Successfully Created
            </h2>
            <p className="text-gray-600 text-[16px]">You can now log in to your account.</p>
            <Link href="/signin">
              <Button
                className="w-full"
                style={{
                  backgroundColor: "var(--abstractCyan)",
                  borderColor: "var(--abstractCyan)",
                }}
              >
                Go to Login Page
              </Button>
            </Link>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-2 text-center space-y-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900">
            Verification Failed
          </h2>
          <p className="text-gray-600 text-[16px]">
            {error.message || "Invalid or expired token."}
          </p>
          <Link href="/signup">
            <Button className="w-full">
              Back to Signup
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if(isPending){
    return (
      <Card className="w-full mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-2 text-center space-y-3">
          <div className="w-10 h-10 bg-[var(--customCyan)] rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Mail className="w-5 h-5 text-[var(--abstractCyan)]" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900">
            Verifying your email...
          </h2>
          <p className="text-gray-600 text-[16px]">Please wait a moment.</p>
        </CardContent>
      </Card>
    );
  }
};

export default VerifyPage;
