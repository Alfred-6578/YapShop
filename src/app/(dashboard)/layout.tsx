import React from 'react'
import DashboardShell from '@/components/layout/DashboardShell'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardShell>{children}</DashboardShell>
}

export default DashboardLayout
