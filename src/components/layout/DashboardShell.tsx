import React from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import RightRail from './RightRail'

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
        </div>
        <RightRail />
      </div>
      <BottomNav />
    </div>
  )
}

export default DashboardShell
