import PageHeader from '@/components/dashboard/PageHeader'
import DashboardKpis from '@/components/dashboard/DashboardKpis'
import OrderStatusCard from '@/components/dashboard/OrderStatusCard'
import RevenueTrendCard from '@/components/dashboard/RevenueTrendCard'
import TopProductsCard from '@/components/dashboard/TopProductsCard'
import LowStockCard from '@/components/dashboard/LowStockCard'
import RecentOrdersCard from '@/components/dashboard/RecentOrdersCard'
import HandoffAlertBanner from '@/components/dashboard/HandoffAlertBanner'

/**
 * Pure composition — every widget owns its own data fetching via hooks in
 * lib/dashboard.ts, which in turn hit the /analytics/* endpoints. Page has
 * no props, no hardcoded sample data, no state.
 */
const DashboardPage = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="md:hidden">
        <HandoffAlertBanner />
      </div>

      <div className="hidden md:block">
        <PageHeader
          header="Good morning, Admin"
          subheader="Here is what’s happening with your store today."
          // dateSelector
        />
      </div>

      <DashboardKpis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrderStatusCard />
        <RevenueTrendCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProductsCard />
        <LowStockCard />
      </div>

      <RecentOrdersCard />
    </div>
  )
}

export default DashboardPage
