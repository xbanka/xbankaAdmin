"use client"

// import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Switch } from "@/components/ui/switch"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Users, Shield, Bell, ToggleLeft, Plus, Edit, Trash2 } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"

// const userRoles = [
//   {
//     id: "ROLE001",
//     name: "Super Admin",
//     description: "Full system access",
//     permissions: ["all"],
//     userCount: 2,
//     lastModified: "2024-01-15",
//   },
//   {
//     id: "ROLE002",
//     name: "Support Manager",
//     description: "Manage support tickets and escalations",
//     permissions: ["support.read", "support.write", "customers.read"],
//     userCount: 3,
//     lastModified: "2024-01-14",
//   },
//   {
//     id: "ROLE003",
//     name: "Content Editor",
//     description: "Create and edit content",
//     permissions: ["content.read", "content.write", "knowledge.read"],
//     userCount: 5,
//     lastModified: "2024-01-13",
//   },
//   {
//     id: "ROLE004",
//     name: "Finance Analyst",
//     description: "View financial data and reports",
//     permissions: ["transactions.read", "audit.read", "reports.read"],
//     userCount: 2,
//     lastModified: "2024-01-12",
//   },
// ]

// const systemAlerts = [
//   {
//     id: "ALERT001",
//     title: "High Transaction Volume",
//     description: "Transaction volume exceeded 150% of normal",
//     severity: "Warning",
//     isActive: true,
//     lastTriggered: "2024-01-16 14:30",
//   },
//   {
//     id: "ALERT002",
//     title: "Payment Gateway Down",
//     description: "Flutterwave gateway is not responding",
//     severity: "Critical",
//     isActive: true,
//     lastTriggered: "2024-01-16 13:45",
//   },
//   {
//     id: "ALERT003",
//     title: "Low Gift Card Stock",
//     description: "Amazon gift cards below threshold",
//     severity: "Info",
//     isActive: false,
//     lastTriggered: "2024-01-16 10:20",
//   },
// ]

// const escalationRules = [
//   {
//     id: "ESC001",
//     name: "High Value Transaction",
//     condition: "Transaction amount > $10,000",
//     action: "Auto-escalate to Finance Team",
//     isActive: true,
//     priority: "High",
//   },
//   {
//     id: "ESC002",
//     name: "Multiple Failed Attempts",
//     condition: "3+ failed login attempts in 5 minutes",
//     action: "Lock account and notify security",
//     isActive: true,
//     priority: "Critical",
//   },
//   {
//     id: "ESC003",
//     name: "Customer Complaint",
//     condition: "Support ticket tagged as complaint",
//     action: "Escalate to Support Manager",
//     isActive: true,
//     priority: "Medium",
//   },
// ]

// const featureToggles = [
//   {
//     id: "FEAT001",
//     name: "Crypto Trading",
//     description: "Enable cryptocurrency trading features",
//     isEnabled: true,
//     environment: "Production",
//   },
//   {
//     id: "FEAT002",
//     name: "Advanced Analytics",
//     description: "Show advanced analytics dashboard",
//     isEnabled: false,
//     environment: "Production",
//   },
//   {
//     id: "FEAT003",
//     name: "Beta Features",
//     description: "Enable beta features for testing",
//     isEnabled: true,
//     environment: "Staging",
//   },
// ]

export default function AdminPanel() {
  // const [selectedRole, setSelectedRole] = useState<any>(null)
  // const [newRoleName, setNewRoleName] = useState("")
  // const [newRoleDescription, setNewRoleDescription] = useState("")

  // const getSeverityColor = (severity: string) => {
  //   switch (severity.toLowerCase()) {
  //     case "critical":
  //       return "bg-main-red"
  //     case "warning":
  //       return "bg-yellow-500"
  //     case "info":
  //       return "bg-blue-500"
  //     default:
  //       return "bg-gray-500"
  //   }
  // }

  // const getPriorityColor = (priority: string) => {
  //   switch (priority.toLowerCase()) {
  //     case "critical":
  //       return "bg-main-red"
  //     case "high":
  //       return "bg-yellow-500"
  //     case "medium":
  //       return "bg-blue-500"
  //     default:
  //       return "bg-gray-500"
  //   }
  // }

  return(
    <DashboardLayout title="Admin Panel" breadcrumbs={[{ label: "Admin Panel" }]}>
      <h1>Admin Dashboard</h1>
    </DashboardLayout>
  )

  // return (
  //   <DashboardLayout title="Admin Panel" breadcrumbs={[{ label: "Admin Panel" }]}>
  //     <Tabs defaultValue="roles" className="w-full">
  //       <TabsList className="grid w-full grid-cols-4">
  //         <TabsTrigger value="roles">User Roles</TabsTrigger>
  //         <TabsTrigger value="alerts">System Alerts</TabsTrigger>
  //         <TabsTrigger value="escalation">Escalation Rules</TabsTrigger>
  //         <TabsTrigger value="features">Feature Toggles</TabsTrigger>
  //       </TabsList>

  //       <TabsContent value="roles" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center justify-between">
  //               <span className="flex items-center gap-2 text-deep-blue">
  //                 <Users className="h-5 w-5" />
  //                 User Role Management
  //               </span>
  //               <Dialog>
  //                 <DialogTrigger asChild>
  //                   <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
  //                     <Plus className="h-4 w-4" />
  //                     New Role
  //                   </Button>
  //                 </DialogTrigger>
  //                 <DialogContent>
  //                   <DialogHeader>
  //                     <DialogTitle>Create New Role</DialogTitle>
  //                   </DialogHeader>
  //                   <div className="space-y-4">
  //                     <div>
  //                       <Label htmlFor="roleName">Role Name</Label>
  //                       <Input
  //                         id="roleName"
  //                         value={newRoleName}
  //                         onChange={(e) => setNewRoleName(e.target.value)}
  //                         placeholder="Enter role name"
  //                       />
  //                     </div>
  //                     <div>
  //                       <Label htmlFor="roleDescription">Description</Label>
  //                       <Input
  //                         id="roleDescription"
  //                         value={newRoleDescription}
  //                         onChange={(e) => setNewRoleDescription(e.target.value)}
  //                         placeholder="Enter role description"
  //                       />
  //                     </div>
  //                     <div>
  //                       <Label>Permissions</Label>
  //                       <div className="grid grid-cols-2 gap-2 mt-2">
  //                         {[
  //                           "support.read",
  //                           "support.write",
  //                           "customers.read",
  //                           "transactions.read",
  //                           "content.write",
  //                         ].map((permission) => (
  //                           <div key={permission} className="flex items-center space-x-2">
  //                             <Switch id={permission} />
  //                             <Label htmlFor={permission} className="text-sm">
  //                               {permission}
  //                             </Label>
  //                           </div>
  //                         ))}
  //                       </div>
  //                     </div>
  //                     <div className="flex gap-2">
  //                       <Button className="bg-main-green hover:bg-main-green/90">Create Role</Button>
  //                       <Button variant="outline">Cancel</Button>
  //                     </div>
  //                   </div>
  //                 </DialogContent>
  //               </Dialog>
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <Table>
  //               <TableHeader>
  //                 <TableRow>
  //                   <TableHead>Role Name</TableHead>
  //                   <TableHead>Description</TableHead>
  //                   <TableHead>Users</TableHead>
  //                   <TableHead>Permissions</TableHead>
  //                   <TableHead>Last Modified</TableHead>
  //                   <TableHead>Actions</TableHead>
  //                 </TableRow>
  //               </TableHeader>
  //               <TableBody>
  //                 {userRoles.map((role) => (
  //                   <TableRow key={role.id}>
  //                     <TableCell className="font-medium">{role.name}</TableCell>
  //                     <TableCell>{role.description}</TableCell>
  //                     <TableCell>
  //                       <Badge variant="outline">{role.userCount} users</Badge>
  //                     </TableCell>
  //                     <TableCell>
  //                       <div className="flex flex-wrap gap-1">
  //                         {role.permissions.slice(0, 2).map((permission) => (
  //                           <Badge key={permission} variant="secondary" className="text-xs">
  //                             {permission}
  //                           </Badge>
  //                         ))}
  //                         {role.permissions.length > 2 && (
  //                           <Badge variant="secondary" className="text-xs">
  //                             +{role.permissions.length - 2}
  //                           </Badge>
  //                         )}
  //                       </div>
  //                     </TableCell>
  //                     <TableCell className="text-sm">{role.lastModified}</TableCell>
  //                     <TableCell>
  //                       <div className="flex gap-2">
  //                         <Button variant="ghost" size="sm">
  //                           <Edit className="h-4 w-4" />
  //                         </Button>
  //                         <Button variant="ghost" size="sm" className="text-main-red">
  //                           <Trash2 className="h-4 w-4" />
  //                         </Button>
  //                       </div>
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>

  //       <TabsContent value="alerts" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2 text-deep-blue">
  //               <Bell className="h-5 w-5" />
  //               System-wide Alerts
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-4">
  //               {systemAlerts.map((alert) => (
  //                 <Card key={alert.id} className="bg-off-white">
  //                   <CardContent className="p-4">
  //                     <div className="flex items-center justify-between mb-2">
  //                       <div className="flex items-center gap-3">
  //                         <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
  //                         <h4 className="font-medium text-deep-blue">{alert.title}</h4>
  //                       </div>
  //                       <div className="flex items-center gap-2">
  //                         <Switch checked={alert.isActive} />
  //                         <span className="text-sm text-muted-foreground">
  //                           {alert.isActive ? "Active" : "Inactive"}
  //                         </span>
  //                       </div>
  //                     </div>
  //                     <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
  //                     <div className="flex items-center justify-between">
  //                       <span className="text-xs text-muted-foreground">Last triggered: {alert.lastTriggered}</span>
  //                       <div className="flex gap-2">
  //                         <Button variant="outline" size="sm">
  //                           Edit
  //                         </Button>
  //                         <Button variant="outline" size="sm">
  //                           Test
  //                         </Button>
  //                       </div>
  //                     </div>
  //                   </CardContent>
  //                 </Card>
  //               ))}
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>

  //       <TabsContent value="escalation" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center justify-between">
  //               <span className="flex items-center gap-2 text-deep-blue">
  //                 <Shield className="h-5 w-5" />
  //                 Auto-escalation Rules
  //               </span>
  //               <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
  //                 <Plus className="h-4 w-4" />
  //                 New Rule
  //               </Button>
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <Table>
  //               <TableHeader>
  //                 <TableRow>
  //                   <TableHead>Rule Name</TableHead>
  //                   <TableHead>Condition</TableHead>
  //                   <TableHead>Action</TableHead>
  //                   <TableHead>Priority</TableHead>
  //                   <TableHead>Status</TableHead>
  //                   <TableHead>Actions</TableHead>
  //                 </TableRow>
  //               </TableHeader>
  //               <TableBody>
  //                 {escalationRules.map((rule) => (
  //                   <TableRow key={rule.id}>
  //                     <TableCell className="font-medium">{rule.name}</TableCell>
  //                     <TableCell className="text-sm">{rule.condition}</TableCell>
  //                     <TableCell className="text-sm">{rule.action}</TableCell>
  //                     <TableCell>
  //                       <Badge className={getPriorityColor(rule.priority)}>{rule.priority}</Badge>
  //                     </TableCell>
  //                     <TableCell>
  //                       <div className="flex items-center gap-2">
  //                         <Switch checked={rule.isActive} />
  //                         <span className="text-sm">{rule.isActive ? "Active" : "Inactive"}</span>
  //                       </div>
  //                     </TableCell>
  //                     <TableCell>
  //                       <div className="flex gap-2">
  //                         <Button variant="ghost" size="sm">
  //                           <Edit className="h-4 w-4" />
  //                         </Button>
  //                         <Button variant="ghost" size="sm" className="text-main-red">
  //                           <Trash2 className="h-4 w-4" />
  //                         </Button>
  //                       </div>
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>

  //       <TabsContent value="features" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2 text-deep-blue">
  //               <ToggleLeft className="h-5 w-5" />
  //               Feature Toggles
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-4">
  //               {featureToggles.map((feature) => (
  //                 <Card key={feature.id} className="bg-off-white">
  //                   <CardContent className="p-4">
  //                     <div className="flex items-center justify-between">
  //                       <div className="flex-1">
  //                         <div className="flex items-center gap-3 mb-2">
  //                           <h4 className="font-medium text-deep-blue">{feature.name}</h4>
  //                           <Badge variant="outline" className="text-xs">
  //                             {feature.environment}
  //                           </Badge>
  //                         </div>
  //                         <p className="text-sm text-muted-foreground">{feature.description}</p>
  //                       </div>
  //                       <div className="flex items-center gap-3">
  //                         <div className="text-right">
  //                           <div className="text-sm font-medium">{feature.isEnabled ? "Enabled" : "Disabled"}</div>
  //                           <div className="text-xs text-muted-foreground">{feature.environment}</div>
  //                         </div>
  //                         <Switch checked={feature.isEnabled} />
  //                       </div>
  //                     </div>
  //                   </CardContent>
  //                 </Card>
  //               ))}
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>
  //     </Tabs>
  //   </DashboardLayout>
  // )
}