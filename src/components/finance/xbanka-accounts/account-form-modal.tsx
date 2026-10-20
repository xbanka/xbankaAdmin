"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/lib/services/profile.service";
import {
  useAccountLookup,
  useCreateXbankaAccount,
  useFundingBanks,
  useUpdateXbankaAccount,
} from "@/lib/services/xbanka-accounts.service";
import { xbankaAccountSchema, type XbankaAccountForm } from "@/lib/schema/xbanka-account.schema";
import { buildCreatePayload, buildUpdatePayload } from "@/lib/utils/xbanka-accounts";
import type { XbankaAccount } from "@/lib/types/xbanka-account-types";
import { BankSelect } from "./bank-select";

const ERROR = "text-[10px] text-mainRed";

/**
 * Add a new Xbanka receiving account, or edit one (`account` given).
 *
 * Flow per the backend docs: pick a bank -> type 10 digits -> the registered
 * account name is looked up and pre-filled -> save. The name stays editable
 * in case the account is labelled differently, and a failed lookup doesn't
 * block saving, but both are flagged so staff double-check.
 */
export function AccountFormModal({
  account,
  onClose,
}: {
  account?: XbankaAccount;
  onClose: () => void;
}) {
  const isEdit = !!account;
  const { data: profile } = useProfile();
  const updatedBy = profile?.data?.email ?? "";

  const banksQuery = useFundingBanks();
  const create = useCreateXbankaAccount();
  const update = useUpdateXbankaAccount();
  const isSaving = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<XbankaAccountForm>({
    resolver: zodResolver(xbankaAccountSchema),
    defaultValues: {
      bankCode: account?.bankCode ?? "",
      bankName: account?.bankName ?? "",
      accountNumber: account?.accountNumber ?? "",
      accountName: account?.accountName ?? "",
      isPrimary: false,
    },
  });

  const values = watch();
  const lookup = useAccountLookup(values.bankCode, values.accountNumber);
  const lookedUpName = lookup.data?.account_name;

  // Staff typed their own name: never overwrite it from a lookup.
  const [nameTouched, setNameTouched] = useState(false);
  // On edit, the saved name may be a deliberate label; only refill it when the
  // bank or number actually changed.
  const identityChanged =
    !isEdit ||
    values.bankCode !== account.bankCode ||
    values.accountNumber !== account.accountNumber;

  useEffect(() => {
    if (lookedUpName && !nameTouched && identityChanged) {
      setValue("accountName", lookedUpName, { shouldValidate: true });
    }
  }, [lookedUpName, nameTouched, identityChanged, setValue]);

  const updatePayload = isEdit ? buildUpdatePayload(account, values, updatedBy) : null;
  const nothingChanged = isEdit && !updatePayload;
  const nameDiffers =
    !!lookedUpName && values.accountName.trim().toUpperCase() !== lookedUpName.trim().toUpperCase();

  const onSubmit = (form: XbankaAccountForm) => {
    if (isEdit) {
      const payload = buildUpdatePayload(account, form, updatedBy);
      if (!payload) return;
      update.mutate(
        { accountId: account.id, payload, successMessage: "Account updated." },
        { onSuccess: onClose },
      );
    } else {
      create.mutate(buildCreatePayload(form, updatedBy), { onSuccess: onClose });
    }
  };

  const close = isSaving ? () => {} : onClose;

  return (
    <Modal onClose={close} className="max-w-[540px] px-0 pb-0 border-none">
      <ModalHeader
        title={isEdit ? "Edit Account" : "Add Xbanka Account"}
        subtitle={
          isEdit
            ? "Changes show to customers on the web app's bank transfer screen."
            : "Customers will see this account when they fund their wallet by bank transfer."
        }
        onClose={close}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-card-primary px-10 py-6 max-sm:px-6 space-y-5 rounded-b-2xl"
      >
        <div className="space-y-2">
          <Label htmlFor="bankCode">Bank</Label>
          <BankSelect
            banks={banksQuery.data ?? []}
            value={values.bankCode}
            fallbackName={account?.bankName}
            isLoading={banksQuery.isPending}
            isError={banksQuery.isError}
            invalid={!!errors.bankCode}
            onChange={(bank) => {
              setValue("bankCode", bank.code, { shouldValidate: true, shouldDirty: true });
              setValue("bankName", bank.name, { shouldValidate: true, shouldDirty: true });
            }}
          />
          {banksQuery.isError && (
            <p className={ERROR}>Couldn&apos;t load the bank list. Close and try again.</p>
          )}
          {errors.bankCode && <p className={ERROR}>{errors.bankCode.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account number</Label>
          <Input
            id="accountNumber"
            inputMode="numeric"
            maxLength={10}
            autoComplete="off"
            placeholder="10-digit NUBAN"
            className="font-mono"
            value={values.accountNumber}
            onChange={(e) =>
              setValue("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 10), {
                shouldValidate: values.accountNumber.length >= 10 || !!errors.accountNumber,
                shouldDirty: true,
              })
            }
          />
          {errors.accountNumber && <p className={ERROR}>{errors.accountNumber.message}</p>}

          <div aria-live="polite" className="min-h-[18px] text-xs">
            {lookup.isFetching && (
              <span className="flex items-center gap-1 text-secondary-text">
                <Loader2 className="h-3 w-3 animate-spin" /> Verifying account...
              </span>
            )}
            {!lookup.isFetching && lookedUpName && (
              <span className="flex items-center gap-1 text-success-text">
                <CheckCircle2 className="h-3 w-3" /> Verified: {lookedUpName}
              </span>
            )}
            {!lookup.isFetching && lookup.isError && (
              <span className="flex items-center gap-1 text-warning-text">
                <AlertTriangle className="h-3 w-3" />
                {(lookup.error as { message?: string })?.message || "Couldn't verify this account."}{" "}
                Check the number, or enter the name yourself.
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName">Account name</Label>
          <Input
            id="accountName"
            placeholder="e.g. XBANKA TECHNOLOGIES LTD"
            {...register("accountName", { onChange: () => setNameTouched(true) })}
          />
          {errors.accountName && <p className={ERROR}>{errors.accountName.message}</p>}
          {nameDiffers && (
            <p className="text-xs text-warning-text">
              This differs from the bank&apos;s registered name ({lookedUpName}). Customers see the name
              you enter here.
            </p>
          )}
        </div>

        {!isEdit && (
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" className="h-4 w-4 accent-[#0D9488]" {...register("isPrimary")} />
            Make this the primary account
          </label>
        )}

        {!updatedBy && (
          <p className="text-xs text-warning-text">Loading your profile. Changes are recorded under your email.</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!updatedBy || isSaving || nothingChanged || lookup.isFetching}
        >
          {isSaving ? "Saving..." : isEdit ? (nothingChanged ? "No changes" : "Save changes") : "Add account"}
        </Button>
      </form>
    </Modal>
  );
}
