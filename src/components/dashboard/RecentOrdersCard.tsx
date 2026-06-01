"use client"
import React from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import ResponsiveTable, { Column } from '@/components/ui/ResponsiveTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useRecentOrders } from '@/lib/dashboard'
import type { OrderResponse } from '@/lib/api/types'

type Props = {
  onViewAll?: () => void
}

const formatMoney = (raw: number) => {
  const n = Number(raw)
  return `₦${Number.isFinite(n) ? n.toLocaleString() : raw}`
}

const RecentOrdersCard = ({ onViewAll }: Props) => {
  const { data, isLoading, isError } = useRecentOrders()

  const columns: Column<OrderResponse>[] = [
    { key: 'number', header: 'Order', render: (r) => <span className="text-fg">{r.order_number}</span> },
    { key: 'customer', header: 'Customer', render: (r) => <span className="text-fg">{r.customer_name}</span> },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (r) => <span className="tnum text-fg">{formatMoney(r.total_amount)}</span>,
    },
    { key: 'status', header: 'Status', align: 'right', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <Card>
      <CardHeader
        title="Recent orders"
        action={
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm text-fg-muted hover:text-fg cursor-pointer"
          >
            view all →
          </button>
        }
      />
      <div className="mt-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-fg-muted">Loading…</div>
        ) : isError ? (
          <div className="py-8 text-center text-sm text-status-cancelled">Failed to load orders</div>
        ) : (
          <ResponsiveTable columns={columns} data={data ?? []} rowKey={(r) => r.id} />
        )}
      </div>
    </Card>
  )
}

export default RecentOrdersCard
