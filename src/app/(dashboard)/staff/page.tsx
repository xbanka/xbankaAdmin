"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { AddStaffSidebar } from "@/components/staff/add-staff-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetAllStaff } from "@/lib/services/staff.service";
import { StaffMember, StaffUser } from "@/lib/types/staffTypes";
import { formatDate } from "@/lib/formatDate";
import StaffActionMenu from "@/components/staff/staff-action-menu";
import DeleteStaffModal from "@/components/staff/delete-staff-modal";
import { EditStaffSidebar } from "@/components/staff/edit-staff-sidebar";

export default function StaffPage() {
  const [filter, setFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // const { data, error, isLoading } = useGetStaff(role)
  const { data, isError, error, isPending } = useGetAllStaff();
  // const { data, isError, error, isPending } = useDeleteStaff();

  // const filteredStaff =
  //   filter === "all"
  //     ? data?.data?.staff
  //     : data?.data?.staff.filter((staff: StaffUser) => staff.status === filter);
  const filteredStaff = data?.data?.staff ?? [];
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const columns = [
    {
      key: "name" as const,
      header: "Staff name",
      render: (staff: StaffMember) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold text-purple-700">
            {staff.first_name.charAt(0).toUpperCase()}
            {staff.last_name.charAt(0).toUpperCase()}
          </div>
          <span>
            {staff.first_name} {staff.last_name}
          </span>
        </div>
      ),
    },
    {
      key: "email" as const,
      header: "Email address",
    },
    {
      key: "id" as const,
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
    {
      key: "created_at" as const,
      header: "Date joined",
      render: (staff: StaffMember) => (
        <div className="">
          <span>{formatDate(staff.created_at)}</span>
        </div>
      ),
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
          onEdit={() => {
            setSelectedStaff(item);
            setEditOpen(true);
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
            <Button onClick={() => setIsAddStaffOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Staff
            </Button>
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
        <EditStaffSidebar
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
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
