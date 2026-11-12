"use client";

import { useState } from "react";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ClipboardPaste, Clock } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AmountField } from "@/components/forms/AmountField";
import { useProfile } from "@/lib/services/profile.service";
import { useCreditFundingDirectly } from "@/lib/services/funding.service";
import { directCreditSchema, type DirectCreditForm } from "@/lib/schema/funding-intent.schema";
import {
  MAX_PROOF_FILES,
  buildDirectCreditPayload,
  classifyCreditError,
  cleanBankReference,
  formatNaira,
  storedReference,
  type CreditFailure,
} from "@/lib/utils/funding";
import type {
  DirectCreditResult,
  FundingIntent,
  FundingLookupMatch,
} from "@/lib/types/funding-types";
import { FindSenderStep } from "./find-sender-step";
import { ProofUploadField, useProofUploads } from "./proof-upload-field";
import { ReviewRow } from "./review-row";

const ERROR = "text-[10px] text-mainRed";
const HEADER_CLASS = "border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl";
// The backend checks the content too; this just keeps the picker honest.
const PROOF_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

type Step = "find" | "details" | "review" | "done";

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  find: {
    title: "Credit Directly",
    subtitle: "Step 1 of 3 · Find the customer who sent the money.",
  },
  details: {
    title: "Credit Directly",
    subtitle: "Step 2 of 3 · Enter what the bank statement shows.",
  },
  review: {
    title: "Review & Credit",
    subtitle: "Step 3 of 3 · This credits the customer's NGN wallet immediately.",
  },
  done: { title: "Wallet Credited", subtitle: "" },
};

const FAILURE_COPY: Record<CreditFailure, string> = {
  retry:
    "That didn't complete. Retrying is safe: the bank reference prevents a double credit.",
  "reference-conflict":
    "This bank reference was already used with a different amount or account. Re-check the reference. Don't retry.",
  "not-found": "That funding account could not be found. Start over and look it up again.",
  rejected: "The credit was refused.",
};

interface Failure {
  kind: CreditFailure;
  message?: string;
}

/**
 * Credit a wallet when the customer never declared the transfer (no funding
 * intent). Remounting via `key` is how "Credit another" starts clean: form,
 * proof uploads, selection and result all reset together.
 */
export function CreditDirectlyModal({
  initialAccount = "",
  onClose,
  onOpenIntent,
}: {
  /** Pre-fills step 1, e.g. the sender account staff just searched for. */
  initialAccount?: string;
  onClose: () => void;
  /** Hands a pending intent to the normal Confirm flow. */
  onOpenIntent: (intent: FundingIntent) => void;
}) {
  const [run, setRun] = useState(0);

  return (
    <CreditDirectlyFlow
      key={run}
      initialAccount={run === 0 ? initialAccount : ""}
      onClose={onClose}
      onOpenIntent={onOpenIntent}
      onCreditAnother={() => setRun((n) => n + 1)}
    />
  );
}

function CreditDirectlyFlow({
  initialAccount,
  onClose,
  onOpenIntent,
  onCreditAnother,
}: {
  initialAccount: string;
  onClose: () => void;
  onOpenIntent: (intent: FundingIntent) => void;
  onCreditAnother: () => void;
}) {
  const [step, setStep] = useState<Step>("find");
  const [account, setAccount] = useState(initialAccount.replace(/\D/g, "").slice(0, 10));
  const [selectedId, setSelectedId] = useState("");
  const [match, setMatch] = useState<FundingLookupMatch | null>(null);
  const [result, setResult] = useState<DirectCreditResult | null>(null);
  const [failure, setFailure] = useState<Failure | null>(null);

  const { data: profile } = useProfile();
  const creditedBy = profile?.data?.email ?? "";
  const { mutate, isPending } = useCreditFundingDirectly();
  const proofs = useProofUploads(undefined, { max: MAX_PROOF_FILES });

  const form = useForm<DirectCreditForm>({
    resolver: zodResolver(directCreditSchema),
    defaultValues: { bankReference: "", amount: "" },
  });
  const { register, handleSubmit, watch, setValue, getValues, formState } = form;
  const { errors } = formState;

  const referenceText = watch("bankReference");
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

  // Closing mid-request would hide whether the credit landed.
  const close = isPending ? () => {} : onClose;
  const proofBlocked = proofs.isUploading || proofs.hasFailed;

  const goTo = (next: Step) => {
    setFailure(null);
    setStep(next);
  };

  const handleCredit = () => {
    if (!match) return;
    setFailure(null);
    mutate(
      buildDirectCreditPayload(getValues(), {
        fundingAccountId: match.fundingAccountId,
        creditedBy,
        attachmentUrls: proofs.urls,
      }),
      {
        onSuccess: (data) => {
          setResult(data);
          setStep("done");
        },
        onError: (err) =>
          setFailure({
            kind: classifyCreditError(err),
            message: (err as { message?: string })?.message,
          }),
      },
    );
  };

  const onBack =
    step === "details" && !isPending
      ? () => goTo("find")
      : step === "review" && !isPending
        ? () => goTo("details")
        : undefined;

  const header = (
    <ModalHeader
      title={STEP_COPY[step].title}
      subtitle={STEP_COPY[step].subtitle}
      onBack={onBack}
      onClose={close}
      className={HEADER_CLASS}
    />
  );

  /* ---------------------------------------------------------------- step 4 */
  if (step === "done" && result) {
    const already = result.duplicate;
    return (
      <Modal onClose={close} className="max-w-[520px] px-0 pb-0 border-none">
        {header}
        <div className="bg-card-primary px-10 py-6 max-sm:px-6 rounded-b-2xl">
          <div className="flex flex-col items-center text-center mb-4">
            {already ? (
              <div className="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3">
                <Clock className="w-7 h-7 text-[#D97706]" aria-hidden />
              </div>
            ) : (
              <Image src="/badge-success.svg" alt="" width={56} height={56} className="mb-3" />
            )}
            <h3 className="text-[18px] font-semibold text-text-primary">
              {already ? "Already credited" : "Wallet credited"}
            </h3>
            <p className="text-[13px] text-secondary-text max-w-[340px]">
              {already
                ? "This bank reference was already credited with these details. No second credit was made."
                : `${match?.customer.name ?? "The customer"} has been notified in the app.`}
            </p>
          </div>

          <div className="divide-y divide-border">
            <ReviewRow label="Customer" value={match?.customer.name} />
            <ReviewRow label="Amount credited" value={formatNaira(result.amount)} />
            <ReviewRow label="New balance" value={formatNaira(result.balance)} />
            <ReviewRow
              label="Transaction ID"
              value={
                <span className="inline-flex items-center gap-1">
                  <span className="font-mono text-xs">{result.transactionId}</span>
                  <CopyButton value={result.transactionId} label="Copy transaction ID" />
                </span>
              }
            />
            <ReviewRow label="Reference" value={<span className="font-mono">{result.reference}</span>} />
            {result.creditedAt && (
              <ReviewRow label="Credited at" value={new Date(result.creditedAt).toLocaleString("en-GB")} />
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1 text-[#111827]" onClick={onCreditAnother}>
              Credit another
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  /* ---------------------------------------------------------------- step 3 */
  if (step === "review" && match) {
    const values = getValues();
    const amount = formatNaira(Number(values.amount));
    return (
      <Modal onClose={close} className="max-w-[520px] px-0 pb-0 border-none">
        {header}
        <div className="bg-card-primary px-10 py-6 max-sm:px-6 rounded-b-2xl">
          <div className="divide-y divide-border">
            <ReviewRow
              label="Customer"
              value={
                <>
                  {match.customer.name}
                  <span className="block text-xs font-normal text-secondary-text">
                    {[match.customer.xbId, match.customer.email].filter(Boolean).join(" · ")}
                  </span>
                </>
              }
            />
            <ReviewRow
              label="Sender account"
              value={`${match.bank} · ${account} (${match.accountName})`}
            />
            <ReviewRow label="Amount to credit" value={<span className="text-[#0D9488]">{amount}</span>} />
            <ReviewRow
              label="Bank reference"
              value={
                <>
                  <span className="font-mono">{values.bankReference.trim()}</span>
                  <span className="block text-xs font-normal text-secondary-text">
                    Stored as {storedReference(values.bankReference)}
                  </span>
                </>
              }
            />
            <ReviewRow label="Proof" value={proofs.urls.length ? `${proofs.urls.length} file(s)` : "None"} />
            <ReviewRow label="Credited by" value={creditedBy} />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-warning-light px-3 py-2 text-xs text-warning-text">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            This credits the customer&apos;s wallet immediately and can&apos;t be undone from here.
          </div>

          {failure && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-error-border bg-error-light px-3 py-2 text-sm text-error-text"
            >
              <p>{FAILURE_COPY[failure.kind]}</p>
              {failure.message && failure.kind !== "retry" && (
                <p className="mt-1 text-xs">{failure.message}</p>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 text-[#111827]"
              onClick={() => goTo("details")}
              disabled={isPending}
            >
              Edit
            </Button>
            {failure?.kind === "reference-conflict" ? (
              <Button className="flex-1" onClick={() => goTo("details")}>
                Edit reference
              </Button>
            ) : failure?.kind === "not-found" ? (
              <Button
                className="flex-1"
                onClick={() => {
                  setMatch(null);
                  goTo("find");
                }}
              >
                Start over
              </Button>
            ) : (
              <Button className="flex-1" onClick={handleCredit} disabled={isPending || !creditedBy}>
                {isPending ? "Crediting..." : failure?.kind === "retry" ? "Retry credit" : `Credit ${amount}`}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  /* ---------------------------------------------------------------- step 2 */
  if (step === "details" && match) {
    return (
      <Modal onClose={close} className="max-w-[560px] px-0 pb-0 border-none">
        {header}
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(() => goTo("review"))}
            className="bg-card-primary px-10 py-6 max-sm:px-6 space-y-5 rounded-b-2xl max-h-[70vh] overflow-y-auto"
            noValidate
          >
            <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-[#F9FAFB] px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{match.customer.name}</p>
                <p className="text-xs text-secondary-text break-all">
                  {[match.customer.xbId, match.customer.email].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-1 text-xs text-secondary-text">
                  {match.bank} · {account} ·{" "}
                  <span className="uppercase text-text-primary">{match.accountName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => goTo("find")}
                className="shrink-0 text-xs text-text-teal underline cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="space-y-2">
              <AmountField id="amount" label="Amount received" currencySymbol="₦" inputClassName="pl-8" />
              <p className="text-xs text-secondary-text">Enter exactly what the bank statement shows.</p>
              {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankReference">Bank reference / session ID</Label>
              <div className="flex gap-2">
                <Input
                  id="bankReference"
                  placeholder="e.g. 100004261006204500123456"
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
                Copy it from the matching line on the bank statement. Each reference can be credited once.
                {referenceText.trim().length >= 4 && (
                  <>
                    {" "}
                    Stored as <span className="font-mono">{storedReference(referenceText)}</span>.
                  </>
                )}
              </p>
              {errors.bankReference && <p className={ERROR}>{errors.bankReference.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Proof of transfer (optional)</Label>
              <ProofUploadField proofs={proofs} accept={PROOF_ACCEPT} />
              <p className="text-xs text-secondary-text">
                Up to {MAX_PROOF_FILES} files · JPEG, PNG, WebP or PDF · 5 MB each.
              </p>
              {proofs.hasFailed && <p className={ERROR}>Retry or remove the files that failed to upload.</p>}
            </div>

            <Button type="submit" className="w-full" disabled={!creditedBy || proofBlocked}>
              {proofs.isUploading ? "Uploading proof..." : "Review"}
            </Button>
          </form>
        </FormProvider>
      </Modal>
    );
  }

  /* ---------------------------------------------------------------- step 1 */
  return (
    <Modal onClose={close} className="max-w-[560px] px-0 pb-0 border-none">
      {header}
      <div className="bg-card-primary px-10 py-6 max-sm:px-6 rounded-b-2xl max-h-[70vh] overflow-y-auto">
        <FindSenderStep
          account={account}
          onAccountChange={setAccount}
          selectedId={selectedId}
          onSelectedIdChange={setSelectedId}
          onContinue={(selected) => {
            setMatch(selected);
            goTo("details");
          }}
          onOpenIntent={onOpenIntent}
        />
      </div>
    </Modal>
  );
}
