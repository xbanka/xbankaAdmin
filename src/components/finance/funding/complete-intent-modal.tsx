"use client";

import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { CopyButton } from "@/components/ui/copy-button";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AmountField } from "@/components/forms/AmountField";
import { SelectFieldLayout } from "@/components/forms/SelectFieldLayout";
import { useProfile } from "@/lib/services/profile.service";
import { useCompleteFundingIntent } from "@/lib/services/funding.service";
import { completeIntentSchema, type CompleteIntentForm } from "@/lib/schema/funding-intent.schema";
import {
  buildCompletePayload,
  cleanBankReference,
  formatNaira,
  isAmountOverridden,
} from "@/lib/utils/funding";
import type { FundingIntent } from "@/lib/types/funding-types";
import { ProofUploadField, useProofUploads } from "./proof-upload-field";
import { ReviewRow } from "./review-row";

const ERROR = "text-[10px] text-mainRed";

export function CompleteIntentModal({
  intent,
  onClose,
}: {
  intent: FundingIntent;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "review">("form");
  const { data: profile } = useProfile();
  const creditedBy = profile?.data?.email ?? "";
  const { mutate, isPending } = useCompleteFundingIntent();
  const proofs = useProofUploads();

  const accounts = intent.registeredFundingAccounts ?? [];
  const schema = useMemo(() => completeIntentSchema(intent.declaredAmount), [intent.declaredAmount]);
  const form = useForm<CompleteIntentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankReference: "",
      amount: String(intent.declaredAmount ?? ""),
      overrideReason: "",
      // One registered sender account is the only possible match.
      fundingAccountId: accounts.length === 1 ? accounts[0].id : "",
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const amount = watch("amount");
  const overridden = isAmountOverridden(amount ?? "", intent.declaredAmount);
  const selectedAccountId = watch("fundingAccountId");
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const intentReference = intent.intentReference || intent.reference;
  const bankReferenceField = register("bankReference");
  const setBankReference = (raw: string) =>
    setValue("bankReference", cleanBankReference(raw), { shouldValidate: true, shouldDirty: true });

  // readText needs a secure context and isn't in every browser (Firefox gates it).
  const canReadClipboard = typeof navigator !== "undefined" && !!navigator.clipboard?.readText;
  const pasteBankReference = async () => {
    try {
      setBankReference(await navigator.clipboard.readText());
    } catch {
      toast.error("Clipboard access was blocked. Paste with Ctrl/Cmd + V instead.");
    }
  };

  const close = isPending ? () => {} : onClose;
  const proofBlocked = proofs.isUploading || proofs.hasFailed;

  const handleConfirm = () => {
    mutate(
      {
        transactionId: intent.transactionId,
        payload: buildCompletePayload(getValues(), {
          declaredAmount: intent.declaredAmount,
          creditedBy,
          attachmentUrls: proofs.urls,
        }),
      },
      { onSuccess: onClose },
    );
  };

  const header = (
    <ModalHeader
      title={step === "form" ? "Confirm Funding" : "Review & Credit"}
      subtitle={
        step === "form"
          ? "Match this declaration to a credit on the bank statement."
          : "This credits the customer's NGN wallet immediately."
      }
      onBack={step === "review" && !isPending ? () => setStep("form") : undefined}
      onClose={close}
      className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
    />
  );

  if (step === "review") {
    const values = getValues();
    return (
      <Modal onClose={close} className="max-w-[520px] px-0 pb-0 border-none">
        {header}
        <div className="bg-card-primary px-10 py-6 max-sm:px-6 rounded-b-2xl">
          <div className="divide-y divide-border">
            <ReviewRow label="Customer" value={intent.customer?.name} />
            <ReviewRow label="Declared" value={formatNaira(intent.declaredAmount, intent.currency)} />
            <ReviewRow
              label="Amount to credit"
              value={
                <span className={overridden ? "text-warning-text" : undefined}>
                  {formatNaira(Number(values.amount), intent.currency)}
                </span>
              }
            />
            {overridden && <ReviewRow label="Override reason" value={values.overrideReason.trim()} />}
            <ReviewRow
              label="Bank reference"
              value={<span className="font-mono">{values.bankReference.trim()}</span>}
            />
            {intentReference && (
              <ReviewRow
                label="Intent reference"
                value={<span className="font-mono text-secondary-text">{intentReference}</span>}
              />
            )}
            {selectedAccount && (
              <ReviewRow
                label="Sender account"
                value={`${selectedAccount.bankName} · ${selectedAccount.accountNumber}`}
              />
            )}
            <ReviewRow label="Proof" value={proofs.urls.length ? `${proofs.urls.length} file(s)` : "None"} />
            <ReviewRow label="Credited by" value={creditedBy} />
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep("form")} disabled={isPending}>
              Edit
            </Button>
            <Button className="flex-1" onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Crediting..." : "Credit wallet"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={close} className="max-w-[560px] px-0 pb-0 border-none">
      {header}
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(() => setStep("review"))}
          className="bg-card-primary px-10 py-6 max-sm:px-6 space-y-5 rounded-b-2xl max-h-[70vh] overflow-y-auto"
          noValidate
        >
          <div className="rounded-lg border border-border bg-[#F9FAFB] px-4 py-3">
            <p className="text-sm font-medium text-text-primary">{intent.customer?.name}</p>
            <p className="text-xs text-secondary-text">
              {[intent.customer?.xbId, intent.customer?.email].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-2 text-xs text-secondary-text">
              Declared{" "}
              <span className="font-medium text-text-primary">
                {formatNaira(intent.declaredAmount, intent.currency)}
              </span>
            </p>
            {intentReference && (
              <div className="mt-1 flex items-center gap-1 text-xs text-secondary-text">
                <span>Intent reference</span>
                <span className="font-mono text-text-primary break-all">{intentReference}</span>
                <CopyButton value={intentReference} label="Copy intent reference" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankReference">Bank reference / session ID</Label>
            <div className="flex gap-2">
              <Input
                id="bankReference"
                placeholder="e.g. NIP/20261015/000123"
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="off"
                className="font-mono"
                {...bankReferenceField}
                onPaste={(e) => {
                  e.preventDefault();
                  setBankReference(e.clipboardData.getData("text"));
                }}
              />
              {canReadClipboard && (
                <Button type="button" variant="outline" className="h-9 text-[#111827]" onClick={pasteBankReference}>
                  <ClipboardPaste />
                  Paste
                </Button>
              )}
            </div>
            <p className="text-xs text-secondary-text">
              Copy it from the matching line on the bank statement. This is not the intent reference above.
            </p>
            {errors.bankReference && <p className={ERROR}>{errors.bankReference.message}</p>}
          </div>

          <div>
            <AmountField id="amount" label="Amount received" currencySymbol="₦" inputClassName="pl-8" />
            {errors.amount && <p className={`mt-1 ${ERROR}`}>{errors.amount.message}</p>}
          </div>

          {overridden && (
            <div className="space-y-2">
              <Label htmlFor="overrideReason">Why does it differ from the declared amount?</Label>
              <Input
                id="overrideReason"
                placeholder="e.g. Customer sent 48k, not 50k"
                {...register("overrideReason")}
              />
              {errors.overrideReason && <p className={ERROR}>{errors.overrideReason.message}</p>}
            </div>
          )}

          {accounts.length > 0 && (
            <SelectFieldLayout
              id="fundingAccountId"
              label="Sender account (optional)"
              placeholder="Which account did the money come from?"
              options={accounts.map((a) => ({
                value: a.id,
                label: `${a.bankName} · ${a.accountNumber} (${a.accountName})`,
              }))}
              value={selectedAccountId}
              onChange={(v) => setValue("fundingAccountId", v)}
            />
          )}

          <div className="space-y-2">
            <Label>Proof of transfer (optional)</Label>
            <ProofUploadField proofs={proofs} />
            {proofs.hasFailed && (
              <p className={ERROR}>Retry or remove the files that failed to upload.</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!creditedBy || proofBlocked}>
            {proofs.isUploading ? "Uploading proof..." : "Review"}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
