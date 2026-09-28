"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface CustomerActionMenuProps {
  onEditPermissions?: () => void;
  onEditRoles?: () => void;
  onDelete?: () => void;
  canEditPermissions?: boolean;
  canEditRoles?: boolean;
}

export default function StaffActionMenu({
  onEditPermissions,
  onEditRoles,
  onDelete,
  canEditPermissions = false,
  canEditRoles = false,
}: CustomerActionMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-[400] text-[14px] text-[#28282B] rounded-[12px] p-3 bg-[#FFFFFF]" align="end">
          {canEditPermissions && (
            <DropdownMenuItem
            className="font-[400] text-[14px] text-[#28282B] py-2 px-3"
              onClick={() => {
                setMenuOpen(false);
                onEditPermissions?.();
              }}
            >
              Edit Permissions
            </DropdownMenuItem>
          )}
          {canEditRoles && (
            <DropdownMenuItem
            className="font-[400] text-[14px] text-[#28282B] py-2 px-3"
              onClick={() => {
                setMenuOpen(false);
                onEditRoles?.();
              }}
            >
              Edit Roles & Permissions
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
          className="font-[400] text-[14px] text-error-text py-2 px-3"
            onClick={() => {
              setMenuOpen(false);
              onDelete?.();
            }}
          >
            Delete Staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
