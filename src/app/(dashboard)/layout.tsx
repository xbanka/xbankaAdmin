import AuthGuardDashboard from '@/components/auth/AuthGuard'
import { GlobalCustomerSidebar } from '@/components/customer-management/global-customer-sidebar'
import SidebarLayout from '@/components/layout/SidebarLayout'
import { RoleChangeConfirmProvider } from '@/components/layout/RoleChangeConfirmProvider'
import { SplashGate } from '@/components/layout/splash-gate'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlobalPayoutFlows } from '@/components/layout/global-payout-flows'
import React from 'react'

const DashboardLayout = ({children}: { children: React.ReactNode}) => {
  return (
    <SplashGate>
    <SidebarLayout>
      <AuthGuardDashboard>
        <RoleChangeConfirmProvider>
          {/* Header + route guard: mounted once, survives navigation. */}
          <DashboardShell>{children}</DashboardShell>
          <GlobalPayoutFlows />
        </RoleChangeConfirmProvider>
      </AuthGuardDashboard>
      <GlobalCustomerSidebar />
    </SidebarLayout>
    </SplashGate>
  )
}

export default DashboardLayout
