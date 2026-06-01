import React from 'react'

import PageHeader from '@/components/dashboard/PageHeader'
import DashboardKpis from '@/components/dashboard/DashboardKpis'
import OrderStatusCard from '@/components/dashboard/OrderStatusCard'
import RevenueTrendCard from '@/components/dashboard/RevenueTrendCard'
import TopProductsCard from '@/components/dashboard/TopProductsCard'
import LowStockCard from '@/components/dashboard/LowStockCard'
import RecentOrdersCard from '@/components/dashboard/RecentOrdersCard'
import HandoffAlertBanner from '@/components/dashboard/HandoffAlertBanner'

const revenuePoints = [60, 68, 72, 78, 84, 90, 88, 92, 95, 98, 96, 100]
const revenueXLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const topProducts = [
  { name: 'Ankara Midi Dress', units: 142 },
  { name: 'Senator Kaftan', units: 98 },
  { name: 'Lace Gown', units: 76 },
  { name: 'Agbada Set', units: 54 },
  { name: 'Gele Headwrap', units: 31 },
]

const lowStock = [
  { id: '1', name: 'Gele Headwrap', variant: 'one size', qty: 1, threshold: 10 },
  { id: '2', name: 'Ankara Midi Dress', variant: 'size M', qty: 2, threshold: 5 },
  { id: '3', name: 'Senator Kaftan', variant: 'size XL', qty: 3, threshold: 5 },
  { id: '4', name: 'Lace Gown', variant: 'size L', qty: 4, threshold: 5 },
]

const DashboardPage = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="md:hidden">
        <HandoffAlertBanner count={3} longestWait="22m" />
      </div>

      <div className="hidden md:block">
        <PageHeader
          header="Good morning, Admin"
          subheader="Here is what’s happening with your store today."
          dateSelector
        />
      </div>

      <DashboardKpis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrderStatusCard />
        <RevenueTrendCard points={revenuePoints} delta="9%" xLabels={revenueXLabels} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProductsCard items={topProducts} />
        <LowStockCard rows={lowStock} />
      </div>

      <RecentOrdersCard />
    </div>
  )
}

export default DashboardPage
