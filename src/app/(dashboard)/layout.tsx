import AuthGuardDashboard from '@/components/auth/AuthGuard'
import { GlobalCustomerSidebar } from '@/components/customer-management/global-customer-sidebar'
import SidebarLayout from '@/components/layout/SidebarLayout'
import React from 'react'

const DashboardLayout = ({children}: { children: React.ReactNode}) => {
  return (
    <div>
        <SidebarLayout>{children}</SidebarLayout>
        <GlobalCustomerSidebar />
    </div>
  )
}

export default DashboardLayout