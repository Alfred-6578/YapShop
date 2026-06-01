"use client"
import React from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import DonutChart, { DonutSegment } from '@/components/ui/DonutChart'
import { useOrderStatusBreakdown } from '@/lib/dashboard'
import type { OrderStatus } from '@/lib/api/types'

const LABELS: Record<OrderStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const COLORS: Record<OrderStatus, string> = {
  paid: 'var(--status-paid)',
  pending: 'var(--status-pending)',
  shipped: 'var(--status-shipped)',
  delivered: 'var(--status-delivered)',
  cancelled: 'var(--status-cancelled)',
}

const OrderStatusCard = () => {
  const { data, isLoading, isError } = useOrderStatusBreakdown()
  const total = data?.total ?? 0
  const segments = data?.segments ?? []

  const donutData: DonutSegment[] = segments.map((s) => ({
    key: s.key,
    value: s.count,
    color: COLORS[s.key],
  }))

  return (
    <Card>
      <CardHeader title="Order status" meta={<span>{total} total</span>} />

      {isLoading ? (
        <div className="py-8 text-center text-sm text-fg-muted">Loading…</div>
      ) : isError ? (
        <div className="py-8 text-center text-sm text-status-cancelled">Failed to load</div>
      ) : total === 0 ? (
        <div className="py-8 text-center text-sm text-fg-muted">No orders yet</div>
      ) : (
        <div className="flex max-xsm:flex-col xsm:items-center gap-6 mt-4">
          <div className="flex justify-center">
            <DonutChart segments={donutData} size={160} thickness={18} />
          </div>
          <ul className="flex-1 space-y-2 text-sm">
            {segments.map((s) => (
              <li key={s.key} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: COLORS[s.key] }}
                />
                <span className="flex-1 text-fg">{LABELS[s.key]}</span>
                <span className="tnum text-fg font-medium">{Math.round(s.pct * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

export default OrderStatusCard
