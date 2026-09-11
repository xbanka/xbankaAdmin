"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import PasswordField from "@/components/ui/PasswordField";
import { DialogLayout } from "@/components/layout/modalLayout";
import { useChangePassword } from "@/lib/services/settings.service";

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine((values) => values.new_password !== values.current_password, {
    message: "New password must differ from the current one",
    path: ["new_password"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { mutate, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Never leave a typed password sitting in state once the dialog is closed.
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (values: ChangePasswordForm) => {
    mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      title="Change Password"
      description="Keep your account secure by using a strong password."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? "Saving..." : "Change Password"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          id="current_password"
          label="Current password"
          placeholder="Enter current password"
          autoComplete="current-password"
          register={register}
          error={errors.current_password}
          disabled={isPending}
        />
        <PasswordField
          id="new_password"
          label="New password"
          placeholder="Enter new password"
          autoComplete="new-password"
          register={register}
          error={errors.new_password}
          disabled={isPending}
        />
        <PasswordField
          id="confirm_password"
          label="Confirm new password"
          placeholder="Re-enter new password"
          autoComplete="new-password"
          register={register}
          error={errors.confirm_password}
          disabled={isPending}
        />
      </form>
    </DialogLayout>
  );
}
