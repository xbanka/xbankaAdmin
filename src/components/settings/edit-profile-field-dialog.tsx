"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogLayout } from "@/components/layout/modalLayout";

interface EditProfileFieldDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  placeholder?: string;
  initialValue: string;
  isSaving?: boolean;
  onSave: (value: string) => void;
}

/**
 * Single-field editor behind the profile rows' "Edit" buttons. The design
 * doesn't specify this dialog, so it deliberately stays plain and reuses the
 * app's existing modal shell.
 */
export function EditProfileFieldDialog({
  open,
  onClose,
  title,
  label,
  placeholder,
  initialValue,
  isSaving,
  onSave,
}: EditProfileFieldDialogProps) {
  const [value, setValue] = useState(initialValue);

  // Re-seed whenever the dialog is reopened, so a cancelled edit doesn't
  // linger into the next one.
  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const trimmed = value.trim();
  const isUnchanged = trimmed === initialValue.trim();

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={isSaving || !trimmed || isUnchanged}
            onClick={() => onSave(trimmed)}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="settings-edit-field">{label}</Label>
        <Input
          id="settings-edit-field"
          value={value}
          placeholder={placeholder}
          disabled={isSaving}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </DialogLayout>
  );
}
