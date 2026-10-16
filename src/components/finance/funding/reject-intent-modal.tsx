"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/lib/services/profile.service";
import { useRejectFundingIntent } from "@/lib/services/funding.service";
import { rejectIntentSchema, type RejectIntentForm } from "@/lib/schema/funding-intent.schema";
import { formatNaira } from "@/lib/utils/funding";
import type { FundingIntent } from "@/lib/types/funding-types";

export function RejectIntentModal({
  intent,
  onClose,
}: {
  intent: FundingIntent;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const { data: profile } = useProfile();
  const rejectedBy = profile?.data?.email ?? "";
  const { mutate, isPending } = useRejectFundingIntent();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RejectIntentForm>({
    resolver: zodResolver(rejectIntentSchema),
    defaultValues: { reason: "" },
  });

  const close = isPending ? () => {} : onClose;
  const amount = formatNaira(intent.declaredAmount, intent.currency);

  const handleReject = () => {
    mutate(
      {
        transactionId: intent.transactionId,
        payload: { rejectedBy, reason: getValues("reason").trim() },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal onClose={close} className="max-w-[500px] px-0 pb-0 border-none">
      <ModalHeader
        title="Reject Funding Request"
        subtitle={`${intent.customer?.name} declared ${amount}. Rejecting leaves their wallet untouched.`}
        onClose={close}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />

      {confirming ? (
        <div className="bg-card-primary px-10 py-6 max-sm:px-6 rounded-b-2xl">
          <div className="flex items-start gap-3 rounded-lg bg-error-light p-4 text-sm text-error-text">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Reject this {amount} declaration? This is final. It moves to the Failed list and
              cannot be completed afterwards.
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirming(false)}
              disabled={isPending}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
              disabled={isPending}
            >
              {isPending ? "Rejecting..." : "Yes, reject"}
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(() => setConfirming(true))}
          className="bg-card-primary px-10 py-6 max-sm:px-6 space-y-4 rounded-b-2xl"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <textarea
              id="reason"
              rows={3}
              placeholder="e.g. No matching credit on the 15 Oct statement"
              className="w-full rounded-[0.5rem] border border-input px-3 py-2 text-sm outline-none focus-visible:border-[#2DD4BF] focus-visible:ring-[3px] focus-visible:ring-[#2DD4BF]/50"
              {...register("reason")}
            />
            {errors.reason && <p className="text-[10px] text-mainRed">{errors.reason.message}</p>}
            <p className="text-xs text-secondary-text">
              Internal only. The customer sees a neutral message, not this reason.
            </p>
          </div>
          <Button type="submit" variant="destructive" className="w-full" disabled={!rejectedBy}>
            Continue
          </Button>
        </form>
      )}
    </Modal>
  );
}
