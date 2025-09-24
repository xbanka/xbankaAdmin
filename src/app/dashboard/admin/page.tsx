"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Edit, Trash2, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "@/lib/actions/allUsersActions"

const users = [
  {
    id: "USER001",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Super Admin",
    avatar: "/placeholder-user.jpg",
    lastActive: "2024-01-15",
    status: "active",
  },
  {
    id: "USER002",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Support Manager",
    avatar: "/placeholder-user.jpg",
    lastActive: "2024-01-14",
    status: "active",
  },
  {
    id: "USER003",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "Content Editor",
    avatar: "/placeholder-user.jpg",
    lastActive: "2024-01-13",
    status: "active",
  },
  {
    id: "USER004",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Finance Analyst",
    avatar: "/placeholder-user.jpg",
    lastActive: "2024-01-12",
    status: "inactive",
  },
  {
    id: "USER005",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    role: "Content Editor",
    avatar: "/placeholder-user.jpg",
    lastActive: "2024-01-11",
    status: "active",
  },
]

const availableRoles = ["Super Admin", "Support Manager", "Content Editor", "Finance Analyst", "Viewer"]

export default function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editUserRole, setEditUserRole] = useState("")

  const handleRoleUpdate = (userId: string, newRole: string) => {
    console.log(`[v0] Updating user ${userId} to role ${newRole}`)
    setIsEditModalOpen(false)
    setEditingUser(null)
    setEditUserRole("")
  }

  const { isPending, error, data } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(),
  });
  const openEditModal = (user: any) => {
    setEditingUser(user)
    setEditUserRole(user.role)
    setIsEditModalOpen(true)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-800"
      case "Support Manager":
        return "bg-blue-100 text-blue-800"
      case "Content Editor":
        return "bg-green-100 text-green-800"
      case "Finance Analyst":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout title="Admin Panel" breadcrumbs={[{ label: "Admin Panel" }]}>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5" />
              User Management
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Role</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">Add User</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{user.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={editingUser.avatar || "/placeholder.svg"} alt={editingUser.name} />
                  <AvatarFallback>
                    {editingUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{editingUser.name}</div>
                  <div className="text-sm text-gray-600">{editingUser.email}</div>
                </div>
              </div>
              <div>
                <Label htmlFor="editRole">Current Role</Label>
                <div className="mt-1 mb-3">
                  <Badge variant="secondary" className={getRoleColor(editingUser.role)}>
                    {editingUser.role}
                  </Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="editRole">New Role</Label>
                <Select value={editUserRole} onValueChange={setEditUserRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a new role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleRoleUpdate(editingUser.id, editUserRole)}
                  disabled={!editUserRole || editUserRole === editingUser.role}
                >
                  Update Role
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
