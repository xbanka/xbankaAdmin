"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

export const WelcomePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  const handleContinue = () => {
    if (!email) {
      toast.error(
        "This link is invalid or expired. You need a valid invite link to sign up.",
      );
      return;
    }

    router.push(
      `/signup/complete?email=${encodeURIComponent(email)}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="w-full rounded-[24px]">
        <div className="flex flex-col items-center text-center space-y-6">
          <Image src="welcome_sticker.svg" alt="welcome-sticker" width={160} height={160} />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1B1D20]">
              Welcome to Xbanka ERP
            </h1>
            <p className="text-gray-600">
              You have been invited to create an account on Xbanka ERP.
            </p>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full max-w-md h-11 bg-[#14B8A6] hover:bg-[#0EA79A]"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}