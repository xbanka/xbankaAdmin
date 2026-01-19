"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical } from "lucide-react"
import { DataTableLayout } from "@/components/DataTableLayout/DataTableLayout"
import { FilterTabs } from "@/components/ui/FilterTabs"
import { AddStaffSidebar } from "@/components/staff/add-staff-sidebar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface StaffMember {
  id: string
  name: string
  email: string
  staffId: string
  role: string
  dateJoined: string
  lastLogin: string
  status: "active" | "inactive"
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
    staffId: "JD123465",
    role: "Super Admin",
    dateJoined: "01/05/2024",
    lastLogin: "03/03/2025",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "janesmith@gmail.com",
    staffId: "JS123456",
    role: "Admin",
    dateJoined: "01/05/2024",
    lastLogin: "03/03/2025",
    status: "active",
  },
]

export default function StaffPage() {
  const [filter, setFilter] = useState("all")
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)

  const filteredStaff = filter === "all" ? mockStaff : mockStaff.filter((staff) => staff.status === filter)

  const columns = [
    {
      key: "name" as const,
      header: "Staff name",
      render: (staff: StaffMember) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold text-purple-700">
            {staff.name.charAt(0)}
          </div>
          <span>{staff.name}</span>
        </div>
      ),
    },
    {
      key: "email" as const,
      header: "Email address",
    },
    {
      key: "staffId" as const,
      header: "Staff ID",
    },
    {
      key: "role" as const,
      header: "Role",
    },
    {
      key: "dateJoined" as const,
      header: "Date joined",
    },
    {
      key: "lastLogin" as const,
      header: "Last Login",
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: () => (
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff</h1>
          </div>
          <Button
            onClick={() => setIsAddStaffOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </Button>
        </div>

        <div className="mb-6">
          <FilterTabs filters={["All", "Active", "Inactive"]} value={filter} onChange={setFilter} />
        </div>

        <DataTableLayout
          data={filteredStaff}
          columns={columns}
          rowKey={(staff) => staff.id}
          emptyMessage="No staff members found"
        />
      </div>

      <AddStaffSidebar isOpen={isAddStaffOpen} onClose={() => setIsAddStaffOpen(false)} />
    </DashboardLayout>
  )
}
