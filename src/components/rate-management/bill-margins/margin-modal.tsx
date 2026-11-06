"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Modal } from "../../ui/modal";
import { ModalHeader } from "../../ui/modal-header";
import {
  BillMargin,
  BillMarginType,
} from "@/lib/types/bill-margins-types";
import {
  useCreateBillMargin,
  useUpdateBillMargin,
} from "@/lib/services/bill-margins.service";
import {
  MARGIN_TYPE_LABELS,
  MarginFormErrors,
  MarginFormValues,
  buildUpdatePayload,
  productLabel,
  validateMarginForm,
} from "@/lib/utils/bill-margins";

const MARGIN_TYPES: BillMarginType[] = ["PERCENTAGE", "FIXED"];

const FIELD_BOX =
  "flex items-center border border-[#E5E7EB] rounded-[8px] bg-[#F9FAFB] overflow-hidden focus-within:border-[#0D9488] focus-within:ring-[3px] focus-within:ring-[#0D9488]/10 transition-all";

function ReasonField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="margin-reason">Reason</Label>
      <textarea
        id="margin-reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Why is this changing? Recorded in the change history."
        className="w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-[14px] outline-none focus:border-[#0D9488] focus:ring-[3px] focus:ring-[#0D9488]/10 transition-all resize-none"
      />
      {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

function ActiveSwitch({
  active,
  onToggle,
  label,
  hint,
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[14px] leading-[20px] font-medium text-text-primary">
          {label}
        </div>
        <div className="text-[11px] text-[#9CA3AF]">{hint}</div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-10 h-[22px] rounded-full relative transition-colors flex-shrink-0",
          active ? "bg-[#0D9488]" : "bg-[#D1D5DB]",
        )}
        aria-label={label}
        role="switch"
        aria-checked={active}
      >
        <span
          className={cn(
            "absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all",
            active ? "right-[3px]" : "left-[3px]",
          )}
        />
      </button>
    </div>
  );
}

/** Add a margin to an unconfigured product, or edit an existing one. */
export function MarginModal({
  margin,
  onClose,
}: {
  margin: BillMargin;
  onClose: () => void;
}) {
  const isEdit = margin.configured;
  const name = productLabel(margin.product);

  const [values, setValues] = useState<MarginFormValues>({
    marginType: margin.marginType ?? "PERCENTAGE",
    marginValue: isEdit ? String(margin.marginValue) : "",
    // A new margin starts on. The API itself defaults to off, so this is
    // always sent explicitly.
    isActive: isEdit ? margin.isActive : true,
    reason: "",
  });
  const [errors, setErrors] = useState<MarginFormErrors>({});
  const [formError, setFormError] = useState("");

  const create = useCreateBillMargin();
  const update = useUpdateBillMargin();
  const isPending = create.isPending || update.isPending;

  const set = <K extends keyof MarginFormValues>(
    key: K,
    value: MarginFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleTypeChange = (type: BillMarginType) => {
    if (type === values.marginType) return;
    // A percentage and a naira amount are not interchangeable.
    setValues((prev) => ({ ...prev, marginType: type, marginValue: "" }));
  };

  const handleSubmit = () => {
    const nextErrors = validateMarginForm(values);
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    if (isEdit) {
      const payload = buildUpdatePayload(margin, values);
      if (!payload) {
        setFormError("Nothing has changed. Edit a field before saving.");
        return;
      }
      update.mutate(
        { product: margin.product, payload },
        { onSuccess: onClose },
      );
      return;
    }

    create.mutate(
      {
        product: margin.product,
        marginType: values.marginType,
        marginValue: Number(values.marginValue),
        isActive: values.isActive,
        reason: values.reason.trim(),
      },
      { onSuccess: onClose },
    );
  };

  const isFixed = values.marginType === "FIXED";

  return (
    <Modal onClose={onClose} className="max-w-[520px] px-0 pb-0 border-none">
      <ModalHeader
        title={`${isEdit ? "Edit" : "Add"} margin — ${name}`}
        subtitle="Applies to the next payment a user starts. Payments already quoted keep their margin."
        onClose={onClose}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />

      <div className="bg-card-primary p-6 space-y-5">
        <div className="space-y-2">
          <Label>Margin type</Label>
          <div className="flex items-center gap-3">
            {MARGIN_TYPES.map((type) => {
              const selected = values.marginType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  aria-pressed={selected}
                  className={cn(
                    "flex-1 flex items-center gap-2 px-4 py-3 rounded-[8px] border text-[14px] font-medium text-text-primary transition-colors",
                    selected
                      ? "border-[#0D9488] bg-[#F0FDFA]"
                      : "border-[#E5E7EB] bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-4 h-4 rounded-full border-2 flex-shrink-0",
                      selected ? "border-[#0D9488]" : "border-[#D1D5DB]",
                    )}
                  >
                    {selected && (
                      <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                    )}
                  </span>
                  {MARGIN_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin-value">Margin value</Label>
          <div className={FIELD_BOX}>
            {isFixed && (
              <span className="pl-3 text-[#9CA3AF] text-[14px]">₦</span>
            )}
            <input
              id="margin-value"
              type="number"
              min={0}
              max={isFixed ? undefined : 100}
              step="any"
              value={values.marginValue}
              onChange={(e) => set("marginValue", e.target.value)}
              className="flex-1 border-none outline-none px-3 py-2.5 text-[14px] font-medium bg-transparent"
            />
            {!isFixed && (
              <span className="px-3 py-2.5 text-[#9CA3AF] text-[14px] border-l border-[#E5E7EB]">
                %
              </span>
            )}
          </div>
          <p className="text-[12px] text-text-secondary">
            {isFixed
              ? "Flat naira amount added on top of the provider's charge."
              : "Percentage (0–100) added on top of the provider's charge."}
          </p>
          {errors.marginValue && (
            <p className="text-[12px] text-[#EF4444]">{errors.marginValue}</p>
          )}
        </div>

        <ActiveSwitch
          active={values.isActive}
          onToggle={() => set("isActive", !values.isActive)}
          label="Margin active"
          hint={`The margin is only charged on ${name} payments while this is on.`}
        />

        <ReasonField
          value={values.reason}
          onChange={(reason) => set("reason", reason)}
          error={errors.reason}
        />

        {formError && <p className="text-[12px] text-[#EF4444]">{formError}</p>}
      </div>

      <div className="flex items-center justify-end gap-4 p-6 bg-card-secondary rounded-bl-2xl rounded-br-2xl border-t border-card-border-secondary">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isEdit ? "Save changes" : "Add margin"}
        </Button>
      </div>
    </Modal>
  );
}

/** Switch a configured margin on or off. The API requires a reason either way. */
export function ToggleMarginModal({
  margin,
  onClose,
}: {
  margin: BillMargin;
  onClose: () => void;
}) {
  const turningOn = !margin.isActive;
  const name = productLabel(margin.product);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useUpdateBillMargin();

  const handleConfirm = () => {
    const { reason: reasonError } = validateMarginForm({
      marginType: "FIXED",
      marginValue: "0",
      isActive: turningOn,
      reason,
    });
    setError(reasonError ?? "");
    if (reasonError) return;

    mutate(
      {
        product: margin.product,
        payload: { isActive: turningOn, reason: reason.trim() },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal onClose={onClose} className="max-w-[460px] px-0 pb-0 border-none">
      <ModalHeader
        title={`${turningOn ? "Turn on" : "Turn off"} ${name} margin`}
        subtitle={
          turningOn
            ? "The margin will be charged on the next payment a user starts."
            : "No margin will be charged on new payments. Quoted payments keep theirs."
        }
        onClose={onClose}
        className="border-b border-card-border-secondary bg-card-primary rounded-tl-2xl rounded-tr-2xl"
      />
      <div className="bg-card-primary p-6">
        <ReasonField value={reason} onChange={setReason} error={error} />
      </div>
      <div className="flex items-center justify-end gap-4 p-6 bg-card-secondary rounded-bl-2xl rounded-br-2xl border-t border-card-border-secondary">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={isPending}>
          {turningOn ? "Turn on" : "Turn off"}
        </Button>
      </div>
    </Modal>
  );
}
