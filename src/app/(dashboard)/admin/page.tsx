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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllUsers, updateUsers } from "@/lib/actions/allUsersActions"
import { toast } from "sonner"
import { updateUsersTypes, UserTypes } from "@/lib/actions/actionTypes"
import { useUserStore } from "@/store/userStore"


const availableRoles = ['SUPER_ADMIN', 'SEO_WRITER','CUSTOMER_SUPPORT', 'ADMIN']

export default function AdminPanel() {
  // const queryClient = useQueryClient();
  // const setUser = useUserStore((s) => s.setUser)
  // const currentUser = useUserStore((s) => s.user)
  // const [newUserName, setNewUserName] = useState("")
  // const [newUserEmail, setNewUserEmail] = useState("")
  // const [newUserRole, setNewUserRole] = useState("")
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // const [editingUser, setEditingUser] = useState<UserTypes | null>(null)
  // const [editUserRole, setEditUserRole] = useState("")

  // const { mutate, isPending: updateUserPending } = useMutation({
  //     mutationFn: (data: updateUsersTypes) =>
  //       updateUsers(
  //         data.role,
  //         data.id,
  //       ),
  //     onSuccess: (result) => {
  //       if (!result.success) {
  //         // Show API error in alert
  //         //   setErrorMessage(result.message)
  //       } else {
  //         console.log("Signup success!", result.data);
  //         setIsEditModalOpen(false)
  //         setEditingUser(null)
  //         setEditUserRole("")
  //         if (currentUser && currentUser.firstName === result.data.firstName) {
  //         setUser({
  //           ...currentUser,
  //           role: result.data.updatedUser.role, // update role locally in Zustand
  //         })
  //       }
  //         toast.success("User role updated successfully");
  //         queryClient.invalidateQueries({ queryKey: ["allUsers"] });
  //         queryClient.refetchQueries({ queryKey: ["allUsers"] });
  //       }
  //     },
  //     onError: (err) => {
  //       console.log("Signup failed:", err);
  //       toast.error("Something went wrong while updating the role")
  //     },
  //   });

  // const handleRoleUpdate = (userId: string, newRole: string) => {
  //   console.log(`Updating user ${userId} to role ${newRole}`)
  //   // setIsEditModalOpen(false)
  //   mutate({id: userId, role: newRole})
  // }

  // const { isPending, error, data } = useQuery({
  //   queryKey: ["allUsers"],
  //   queryFn: () => getAllUsers(),
  // });

  // useEffect(() => {
  //   console.log(data)
  //   getAllUsers()
  // }, [])
  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  // useEffect(() => {
  //   console.log(editingUser)
  // }, [editingUser])
  // const openEditModal = (user: UserTypes) => {
  //   setEditingUser(user)
  //   setEditUserRole(user.role)
  //   setIsEditModalOpen(true)
  // }

  // const getRoleColor = (role: string) => {
  //   switch (role) {
  //     case "Super Admin":
  //       return "bg-red-100 text-red-800"
  //     case "Support Manager":
  //       return "bg-blue-100 text-blue-800"
  //     case "Content Editor":
  //       return "bg-green-100 text-green-800"
  //     case "Finance Analyst":
  //       return "bg-purple-100 text-purple-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  // const getStatusColor = (status: string) => {
  //   return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  // }

  // if(isPending){
  //   return(
  //     <div className="flex flex-1 items-center justify-center text-gray-500">
  //           Loading...
  //         </div>
  //   )
  // }

  // if(error){
  //   return(
  //     <div className="flex flex-1 items-center justify-center text-gray-500">
  //           {error.message}
  //         </div>
  //   )
  // }

  return (
    // <DashboardLayout title="Admin Panel" breadcrumbs={[{ label: "Admin Panel" }]}>
    //   <Card className="bg-white">
    //     <CardHeader>
    //       <CardTitle className="flex items-center justify-between">
    //         <span className="flex items-center gap-2 text-gray-900">
    //           <Users className="h-5 w-5" />
    //           User Management
    //         </span>
    //         <Dialog>
    //           <DialogTrigger asChild>
    //             <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
    //               <UserPlus className="h-4 w-4" />
    //               Add User
    //             </Button>
    //           </DialogTrigger>
    //           <DialogContent>
    //             <DialogHeader>
    //               <DialogTitle>Add New User</DialogTitle>
    //             </DialogHeader>
    //             <div className="space-y-4">
    //               <div>
    //                 <Label htmlFor="userName">Full Name</Label>
    //                 <Input
    //                   id="userName"
    //                   value={newUserName}
    //                   onChange={(e) => setNewUserName(e.target.value)}
    //                   placeholder="Enter full name"
    //                 />
    //               </div>
    //               <div>
    //                 <Label htmlFor="userEmail">Email</Label>
    //                 <Input
    //                   id="userEmail"
    //                   type="email"
    //                   value={newUserEmail}
    //                   onChange={(e) => setNewUserEmail(e.target.value)}
    //                   placeholder="Enter email address"
    //                 />
    //               </div>
    //               <div>
    //                 <Label htmlFor="userRole">Role</Label>
    //                 <Select value={newUserRole} onValueChange={setNewUserRole}>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select a role" />
    //                   </SelectTrigger>
    //                   <SelectContent>
    //                     {availableRoles.map((role) => (
    //                       <SelectItem key={role} value={role}>
    //                         {role}
    //                       </SelectItem>
    //                     ))}
    //                   </SelectContent>
    //                 </Select>
    //               </div>
    //               <div className="flex gap-2">
    //                 <Button className="bg-blue-600 hover:bg-blue-700">Add User</Button>
    //                 <Button variant="outline">Cancel</Button>
    //               </div>
    //             </div>
    //           </DialogContent>
    //         </Dialog>
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>User</TableHead>
    //             <TableHead>Email</TableHead>
    //             <TableHead>Role</TableHead>
    //             {/* <TableHead>Status</TableHead> */}
    //             {/* <TableHead>Last Active</TableHead> */}
    //             <TableHead>Actions</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {data?.data?.users?.map((user: UserTypes) => (
    //             <TableRow key={user.id}>
    //               <TableCell>
    //                 <div className="flex items-center gap-3">
    //                   {/* <Avatar className="h-8 w-8">
    //                     <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
    //                     <AvatarFallback>
    //                       {user.name
    //                         .split(" ")
    //                         .map((n) => n[0])
    //                         .join("")}
    //                     </AvatarFallback>
    //                   </Avatar> */}
    //                   <span className="font-medium">{user.firstName}</span>
    //                 </div>
    //               </TableCell>
    //               <TableCell className="text-gray-600">{user.email}</TableCell>
    //               <TableCell>
    //                 <Badge variant="secondary" className={getRoleColor(user.role)}>
    //                   {user.role}
    //                 </Badge>
    //               </TableCell>
    //               {/* <TableCell>
    //                 <Badge variant="secondary" className={getStatusColor(user.status)}>
    //                   {user.status}
    //                 </Badge>
    //               </TableCell> */}
    //               {/* <TableCell className="text-sm text-gray-600">{user.lastActive}</TableCell> */}
    //               <TableCell>
    //                 <div className="flex gap-2">
    //                   <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                   <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
    //                     <Trash2 className="h-4 w-4" />
    //                   </Button>
    //                 </div>
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </CardContent>
    //   </Card>

    //   <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
    //     <DialogContent>
    //       <DialogHeader>
    //         <DialogTitle>Edit User Role</DialogTitle>
    //       </DialogHeader>
    //       {editingUser && (
    //         <div className="space-y-4">
    //           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    //             {/* <Avatar className="h-10 w-10">
    //               <AvatarImage src={editingUser.avatar || "/placeholder.svg"} alt={editingUser.name} />
    //               <AvatarFallback>
    //                 {editingUser.name
    //                   .split(" ")
    //                   .map((n: string) => n[0])
    //                   .join("")}
    //               </AvatarFallback>
    //             </Avatar> */}
    //             <div>
    //               <div className="font-medium">{editingUser.firstName}</div>
    //               <div className="text-sm text-gray-600">{editingUser.email}</div>
    //             </div>
    //           </div>
    //           <div>
    //             <Label htmlFor="editRole">Current Role</Label>
    //             <div className="mt-1 mb-3">
    //               <Badge variant="secondary" className={getRoleColor(editingUser.role)}>
    //                 {editingUser.role}
    //               </Badge>
    //             </div>
    //           </div>
    //           <div>
    //             <Label htmlFor="editRole">New Role</Label>
    //             <Select value={editUserRole} onValueChange={setEditUserRole}>
    //               <SelectTrigger>
    //                 <SelectValue placeholder="Select a new role" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 {availableRoles.map((role) => (
    //                   <SelectItem key={role} value={role}>
    //                     {role}
    //                   </SelectItem>
    //                 ))}
    //               </SelectContent>
    //             </Select>
    //           </div>
    //           <div className="flex gap-2">
    //             <Button
    //               className="bg-blue-600 hover:bg-blue-700"
    //               onClick={() => handleRoleUpdate(editingUser.id, editUserRole)}
    //               disabled={!editUserRole || editUserRole === editingUser.role || updateUserPending}
    //             >
    //               {updateUserPending ? "Updating user..." : "Update Role"}
    //             </Button>
    //             <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
    //               Cancel
    //             </Button>
    //           </div>
    //         </div>
    //       )}
    //     </DialogContent>
    //   </Dialog>
    // </DashboardLayout>
    <div>
      admin
    </div>
  )
}
