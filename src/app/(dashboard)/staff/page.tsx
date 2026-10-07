"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Mail } from "lucide-react";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { AddStaffSidebar } from "@/components/staff/add-staff-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetAllStaff } from "@/lib/services/staff.service";
import { StaffMember } from "@/lib/types/staffTypes";
import { formatDate } from "@/lib/formatDate";
import StaffActionMenu from "@/components/staff/staff-action-menu";
import DeleteStaffModal from "@/components/staff/delete-staff-modal";
import { EditPermissionsSidebar } from "@/components/staff/edit-permissions-sidebar";
import { usePermissions } from "@/hooks/usePermissions";
import { ActiveBadge } from "@/components/customer-management/active-badge";
import { EditRolesPermissionsModal } from "@/components/staff/edit-role_permission-modal";
import {
  RoleChangeCell,
  NoRoleChangeCell,
} from "@/components/staff/role-change-cell";

export default function StaffPage() {
  const [filter, setFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const canAddStaff = hasPermission("staff:add");
  const canEditRoles = hasPermission("staff:edit_roles");
  const canEditPermissions = hasPermission("staff:edit_permissions");

  // const { data, error, isLoading } = useGetStaff(role)
  const { data, isError, error, isPending } = useGetAllStaff();
  // const { data, isError, error, isPending } = useDeleteStaff();

  const filteredStaff = (data?.data?.staff ?? []).filter(
    (staff: StaffMember) => {
      if (filter === "all") return true;
      return filter === "active" ? staff.verified : !staff.verified;
    },
  );
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [editPermissionsOpen, setEditPermissionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editRolesOpen, setEditRolesOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected =
    filteredStaff.length > 0 &&
    filteredStaff.every((s: StaffMember) => selectedIds.has(s.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStaff.map((s: StaffMember) => s.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const hasRoleChange = filteredStaff.some(
    (staff: StaffMember) => staff.role_change,
  );

  const columns = [
    {
      key: "name" as const,
      header: "Staff name",
      className: "w-[195px]",
      render: (staff: StaffMember) => {
        const isInvitePending = !staff.first_name && !staff.last_name;

        if (isInvitePending) {
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 shrink-0 rounded-full bg-warning-light flex items-center justify-center">
                <Mail className="w-4 h-4 text-warning-text" />
              </div>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full bg-warning-light text-warning-text">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning-text" />
                Invite pending
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold text-purple-700">
              {staff.first_name.charAt(0).toUpperCase()}
              {staff.last_name.charAt(0).toUpperCase()}
            </div>
            <span className="whitespace-nowrap">
              {staff.first_name} {staff.last_name}
            </span>
          </div>
        );
      },
    },
    {
      key: "email" as const,
      header: "Email address",
    },
    {
      key: "staff_code" as const,
      header: "Staff ID",
    },
    {
      key: "role" as const,
      header: "Role",
      render: (staff: StaffMember) => (
        <div className="">
          <span>{staff.role.name}</span>
        </div>
      ),
    },
    ...(hasRoleChange
      ? [
          {
            key: "role_change" as const,
            header: "Role Change",
            className: "w-[195px]",
            render: (staff: StaffMember) =>
              staff.role_change ? (
                <RoleChangeCell
                  from={staff.role_change.previous_role}
                  to={staff.role_change.new_role}
                  subStatus="Pending confirmation"
                />
              ) : (
                <NoRoleChangeCell />
              ),
          },
        ]
      : []),
    {
      key: "created_at" as const,
      header: "Date joined",
      render: (staff: StaffMember) => (
        <div className="">
          <span>{formatDate(staff.created_at)}</span>
        </div>
      ),
    },
    {
      key: "verified" as const,
      header: "Status",
      render: (staff: StaffMember) => <ActiveBadge active={staff.verified} />,
    },
    // {
    //   key: "lastLogin" as const,
    //   header: "Last Login",
    // },
    {
      key: "actions",
      header: "",
      render: (item: StaffMember) => (
        <StaffActionMenu
          canEditPermissions={canEditPermissions}
          canEditRoles={canEditRoles}
          onEditPermissions={() => {
            setSelectedStaff(item);
            setEditPermissionsOpen(true);
          }}
          onEditRoles={() => {
            setSelectedStaff(item);
            setEditRolesOpen(true);
          }}
          onDelete={() => {
            setSelectedStaff(item);
            setDeleteOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="w-full mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff</h1>
            </div>
            {canAddStaff && (
              <Button onClick={() => setIsAddStaffOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            )}
          </div>

          <div className="mb-6">
            <FilterTabs
              filters={["All", "Active", "Inactive"]}
              value={filter}
              onChange={setFilter}
            />
          </div>

          <DataTableLayout
            data={filteredStaff}
            columns={columns}
            isError={isError}
            isLoading={isPending}
            errorMessage={error?.message}
            rowKey={(staff) => staff?.id}
            emptyMessage="No staff members found"
          />
        </div>

        <AddStaffSidebar
          isOpen={isAddStaffOpen}
          onClose={() => setIsAddStaffOpen(false)}
        />
        <EditPermissionsSidebar
          isOpen={editPermissionsOpen}
          onClose={() => setEditPermissionsOpen(false)}
          staff={selectedStaff}
        />

        <EditRolesPermissionsModal
          isOpen={editRolesOpen}
          onClose={() => setEditRolesOpen(false)}
          staff={selectedStaff}
        />

        <DeleteStaffModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          staff={selectedStaff}
        />
      </div>
    </DashboardLayout>
  );
}
