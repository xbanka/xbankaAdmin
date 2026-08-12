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
import { StaffUser } from "@/lib/types/staffTypes";

interface CustomerActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function StaffActionMenu({
  onEdit,
  onDelete,
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setMenuOpen(false);
              onEdit?.();
            }}
          >
            Edit Staff Role
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setMenuOpen(false);
              onDelete?.();
            }}
            className="text-red-600"
          >
            Delete Staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
