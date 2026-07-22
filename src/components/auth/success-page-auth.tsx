"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SignupSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role") || "Admin";
  const email = searchParams.get("email") || "";

  const [agreed, setAgreed] = useState(false);
4
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <Card className="w-full max-w-lg rounded-[24px] shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-700" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#1B1D20]">
              Account Successfully Created
            </h1>
            <p className="text-gray-600">
              Your ERP account is ready to use.
            </p>
          </div>

          {/* <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Assigned Role</p>
              <p className="font-semibold text-[#1B1D20]">{role}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-3">Permissions</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  View, manage and refund transactions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  View customers and manage KYC
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  View payments and operational reports
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  Add staff and manage roles & permissions
                </li>
              </ul>
            </div>
          </div> */}

          <div className="flex items-center space-x-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the role and permissions assigned to me
            </label>
          </div>

          <Button
            disabled={!agreed}
            onClick={() => router.push("/signin")}
            className="w-full h-11 bg-[#14B8A6] hover:bg-[#0EA79A]"
          >
            Go to Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}