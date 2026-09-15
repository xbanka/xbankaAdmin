"use client";

import { useRef, useState } from "react";
import { Lock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/lib/services/profile.service";
import {
  useUpdateProfile,
  useUploadProfilePicture,
} from "@/lib/services/settings.service";

import { ChangePasswordDialog } from "./change-password-dialog";
import { EditProfileFieldDialog } from "./edit-profile-field-dialog";
import {
  EditButton,
  ReadOnlyLock,
  SettingsGroup,
  SettingsPanelHeader,
  SettingsRow,
  SettingsRowLabel,
  SettingsSectionLabel,
  VerifiedTick,
} from "./settings-ui";

/**
 * Shape this panel reads off `GET /api/erp/me`. Only `first_name`,
 * `last_name` and `role` are confirmed to exist today — the rest are optional
 * so the panel degrades to a dash rather than breaking once the backend
 * starts returning them.
 */
type SettingsProfile = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  staff_code?: string;
  department?: string;
  avatar_url?: string;
  verified?: boolean;
  phone_verified?: boolean;
  role?: { name?: string; managed_by?: string };
};

/** Values the backend hasn't supplied yet read as a dash, not an empty gap. */
const EMPTY = "—";

/**
 * Profile editing is switched off until the backend can accept it.
 * `PATCH /api/erp/me` answers 405 (the path is GET-only) and there is no
 * avatar upload route at all, so all three Edit buttons could only fail in
 * the user's face. They stay visible but inert, which reads as unfinished
 * rather than broken.
 *
 * Flip this to `true` once those endpoints exist — the dialogs, mutations and
 * upload handler behind these buttons are already written and wired.
 */
const PROFILE_EDITING_ENABLED = false;

const EDITING_DISABLED_HINT = "Not available yet — waiting on the backend endpoint";

function ValueText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[14px] text-secondary-text">{children}</span>
  );
}

export function MyProfileTab() {
  const { data, isLoading } = useProfile();
  const user: SettingsProfile = data?.data ?? {};

  const updateProfile = useUpdateProfile();
  const uploadPicture = useUploadProfilePicture();

  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");
  const initials =
    [user.first_name?.[0], user.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  const role = user.role?.name;
  // The design renders "Admin · Managed by Super Admin"; the trailing clause
  // only appears when the backend actually says who manages the role.
  const roleLabel = role
    ? [role, user.role?.managed_by && `Managed by ${user.role.managed_by}`]
        .filter(Boolean)
        .join(" · ")
    : EMPTY;

  const handleAvatarPicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadPicture.mutate(file);
    // Reset so picking the same file twice still fires a change event.
    event.target.value = "";
  };

  const handleSaveName = (value: string) => {
    const [first, ...rest] = value.split(" ").filter(Boolean);
    updateProfile.mutate(
      { first_name: first ?? "", last_name: rest.join(" ") },
      { onSuccess: () => setEditingName(false) },
    );
  };

  const handleSavePhone = (value: string) => {
    updateProfile.mutate(
      { phone_number: value },
      { onSuccess: () => setEditingPhone(false) },
    );
  };

  return (
    <>
      <SettingsPanelHeader
        title="My Profile"
        description="Manage your personal information and account details."
      />

      <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
        <SettingsSectionLabel>My Profile</SettingsSectionLabel>
        <SettingsGroup>
          <SettingsRow>
            <div className="flex min-w-0 items-center gap-3.5">
              {isLoading ? (
                <Skeleton className="size-12 rounded-full" />
              ) : (
                <Avatar className="size-12">
                  <AvatarImage src={user.avatar_url} alt={fullName} />
                  <AvatarFallback className="bg-teal-light text-[14px] font-semibold text-text-teal">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="min-w-0">
                <p className="text-[14px] text-text-primary">Profile Picture</p>
                <p className="mt-0.5 text-[13px] text-secondary-text">
                  Your profile photo displayed across the XBanka ERP
                </p>
              </div>
            </div>
            <EditButton
              onClick={() => fileInputRef.current?.click()}
              disabled={!PROFILE_EDITING_ENABLED || uploadPicture.isPending}
              title={PROFILE_EDITING_ENABLED ? undefined : EDITING_DISABLED_HINT}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarPicked}
            />
          </SettingsRow>

          <SettingsRow>
            <SettingsRowLabel>Full Name</SettingsRowLabel>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <>
                  {user.verified && <VerifiedTick />}
                  <ValueText>{fullName || EMPTY}</ValueText>
                </>
              )}
              <EditButton
                onClick={() => setEditingName(true)}
                disabled={!PROFILE_EDITING_ENABLED}
                title={
                  PROFILE_EDITING_ENABLED ? undefined : EDITING_DISABLED_HINT
                }
              />
            </div>
          </SettingsRow>

          <SettingsRow>
            <SettingsRowLabel>Email Address</SettingsRowLabel>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <ValueText>{user.email || EMPTY}</ValueText>
              )}
              <ReadOnlyLock />
            </div>
          </SettingsRow>

          <SettingsRow>
            <SettingsRowLabel>Phone Number</SettingsRowLabel>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  {user.phone_verified && (
                    <VerifiedTick className="bg-[#12B76A]" />
                  )}
                  <ValueText>{user.phone_number || EMPTY}</ValueText>
                </>
              )}
              <EditButton
                onClick={() => setEditingPhone(true)}
                disabled={!PROFILE_EDITING_ENABLED}
                title={
                  PROFILE_EDITING_ENABLED ? undefined : EDITING_DISABLED_HINT
                }
              />
            </div>
          </SettingsRow>
        </SettingsGroup>

        <SettingsSectionLabel className="mt-7">
          Account Information
        </SettingsSectionLabel>
        <SettingsGroup>
          <SettingsRow>
            <SettingsRowLabel>Staff ID</SettingsRowLabel>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <ValueText>{user.staff_code || EMPTY}</ValueText>
              )}
              <ReadOnlyLock />
            </div>
          </SettingsRow>

          <SettingsRow>
            <SettingsRowLabel>Role</SettingsRowLabel>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                <ValueText>{roleLabel}</ValueText>
              )}
              <ReadOnlyLock />
            </div>
          </SettingsRow>

          <SettingsRow>
            <SettingsRowLabel>Department</SettingsRowLabel>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <ValueText>{user.department || EMPTY}</ValueText>
              )}
              <ReadOnlyLock />
            </div>
          </SettingsRow>
        </SettingsGroup>

        <SettingsSectionLabel className="mt-7">Password</SettingsSectionLabel>
        <SettingsGroup>
          <SettingsRow>
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-light">
                <Lock className="size-[18px] text-text-teal" />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] text-text-primary">Password</p>
                <p className="mt-0.5 text-[13px] text-secondary-text">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChangingPassword(true)}
              className="shrink-0 cursor-pointer rounded-lg border border-grey-border bg-white px-5 py-2 text-[13px] font-medium text-text-teal transition-colors hover:bg-teal-light"
            >
              Change Password
            </button>
          </SettingsRow>
        </SettingsGroup>
      </div>

      <EditProfileFieldDialog
        open={editingName}
        onClose={() => setEditingName(false)}
        title="Edit Full Name"
        label="Full name"
        placeholder="Enter your full name"
        initialValue={fullName}
        isSaving={updateProfile.isPending}
        onSave={handleSaveName}
      />

      <EditProfileFieldDialog
        open={editingPhone}
        onClose={() => setEditingPhone(false)}
        title="Edit Phone Number"
        label="Phone number"
        placeholder="+234 700 123 4567"
        initialValue={user.phone_number ?? ""}
        isSaving={updateProfile.isPending}
        onSave={handleSavePhone}
      />

      <ChangePasswordDialog
        open={changingPassword}
        onClose={() => setChangingPassword(false)}
      />
    </>
  );
}
