"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerProps } from "@/lib/types/customer";
import { DialogLayout } from "../layout/modalLayout";
import { useDeleteCustomer } from "@/lib/services/customer.service";

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProps | null;
}

export default function DeleteCustomerModal({
  isOpen,
  onClose,
  customer,
}: DeleteCustomerModalProps) {
  const { mutate, isPending } = useDeleteCustomer();

  const handleDelete = async () => {
    mutate(customer?.userId ?? "", {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <DialogLayout
      open={isOpen}
      onClose={onClose}
      title="Delete Customer"
      footer={
        <>
          <Button
            className="flex-1 bg-transparent"
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </>
      }
    >
      <div className="flex gap-3 py-4">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Are you sure you want to delete this customer?
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">
              {customer?.firstName} {customer?.lastName}
            </span>{" "}
            will be permanently deleted. This action cannot be undone.
          </p>
        </div>
      </div>
    </DialogLayout>
  );
}
