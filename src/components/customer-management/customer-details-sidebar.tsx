"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useGetCustomerById } from "@/lib/services/customer.service";
import { tierImages } from "@/lib/utils/tier-images";

interface Props {
  isOpen: boolean;
  customerId: string | null;
  onClose: () => void;
}

export default function CustomerDetailsSidebar({
  isOpen,
  customerId,
  onClose,
}: Props) {
  const { data, isLoading } = useGetCustomerById(customerId || "");

  if (!isOpen) return null;

  const customer = data?.data?.data;

  const tier = customer?.tier ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="w-full md:w-[600px] bg-white h-full overflow-y-auto">
        {isLoading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b p-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200" />

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold">
                      {customer?.firstName} {customer?.lastName}
                    </h2>

                    <Image
                      src={tierImages[tier]}
                      alt={`Tier ${tier}`}
                      width={67}
                      height={24}
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    UID: {customer?.userId}
                  </div>

                  <div className="text-sm text-gray-500">
                    {customer?.email}
                  </div>
                </div>
              </div>

              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Personal Details */}
            <div className="p-6">
              <h3 className="font-semibold mb-4">
                Personal Details
              </h3>

              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>
                  <p>
                    {customer?.firstName} {customer?.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>
                  <p>{customer?.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>
                  <p>{customer?.phoneNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Date Joined
                  </p>
                  <p>
                    {new Date(
                      customer?.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Current Step
                  </p>
                  <p>{customer?.currentStep}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Tier
                  </p>
                  <p>Tier {customer?.tier}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}