"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Check, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

/** Heading + supporting copy that opens every settings panel. */
export function SettingsPanelHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="px-5 pt-5 sm:px-7 sm:pt-6">
        <h2 className="text-[18px] font-semibold text-text-primary">{title}</h2>
        <p className="mt-1.5 text-[14px] text-secondary-text">{description}</p>
      </div>
      <div className="mt-5 h-px w-full bg-border-default" />
    </>
  );
}

/** Small label that titles each grouped block ("Account Information", ...). */
export function SettingsSectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "mb-3 text-[15px] font-medium text-text-primary",
        className,
      )}
    >
      {children}
    </h3>
  );
}

/** The tinted card that groups a run of rows. */
export function SettingsGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-[#F9FAFB]", className)}>
      {children}
    </div>
  );
}

/**
 * One row inside a group. Rows are hairline-separated, and the divider is
 * dropped on the last one so the group's rounded corners stay clean.
 */
export function SettingsRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#EDEFF2] px-4 py-4 last:border-b-0 sm:px-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Left-hand label of a simple label/value row. */
export function SettingsRowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[14px] text-text-primary">{children}</span>
  );
}

/** Filled teal tick shown beside values the backend has verified. */
export function VerifiedTick({ className }: { className?: string }) {
  return (
    <span
      aria-label="Verified"
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-full bg-abstractCyan",
        className,
      )}
    >
      <Check className="size-3 text-white" strokeWidth={3} />
    </span>
  );
}

/** Padlock marking a value this screen cannot change. */
export function ReadOnlyLock() {
  return (
    <Lock
      aria-label="Read only"
      className="size-[15px] shrink-0 text-[#98A2B3]"
    />
  );
}

/** The outlined "Edit" affordance used throughout the profile panel. */
export function EditButton({
  onClick,
  label = "Edit",
  disabled,
  title,
}: {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="shrink-0 cursor-pointer rounded-lg border border-grey-border bg-white px-5 py-2 text-[13px] font-medium text-grey-text transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

/**
 * Toggle used by the notification panel. Built straight on the Radix
 * primitive rather than the shared `ui/switch`, so the teal-on / slate-off
 * treatment from the design stays local to settings.
 */
export function SettingsSwitch({
  checked,
  onCheckedChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label": string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full px-0.5 outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-abstractCyan/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-abstractCyan data-[state=unchecked]:bg-[#3F4A5A]",
      )}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
}

/** Title + supporting line, shared by the channel and preference rows. */
export function SettingsRowText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[14px] text-text-primary">{title}</p>
      <p className="mt-0.5 text-[13px] text-secondary-text">{description}</p>
    </div>
  );
}
