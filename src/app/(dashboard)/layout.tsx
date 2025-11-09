import AuthGuardDashboard from '@/components/layout/AuthGuard'
import SidebarLayout from '@/components/layout/SidebarLayout'
import React from 'react'

const DashboardLayout = ({children}: { children: React.ReactNode}) => {
  return (
    <div>
      <AuthGuardDashboard>
        <SidebarLayout>{children}</SidebarLayout>
      </AuthGuardDashboard>
    </div>
  )
}

export default DashboardLayout