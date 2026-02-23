import AuthGuardDashboard from '@/components/auth/AuthGuard'
import SidebarLayout from '@/components/layout/SidebarLayout'
import React from 'react'

const DashboardLayout = ({children}: { children: React.ReactNode}) => {
  return (
    <div>
        <SidebarLayout>{children}</SidebarLayout>
    </div>
  )
}

export default DashboardLayout