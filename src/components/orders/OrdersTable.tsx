"use client"
import React from 'react'
import Link from 'next/link'
import { HiChevronRight } from 'react-icons/hi2'

import Card from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatRelative } from '@/lib/utils/format'
import type { Order } from '@/lib/orders/mockData'

type Props = {
  orders: Order[]
  emptyState?: React.ReactNode
}

const GRID =
  'grid-cols-[minmax(0,1fr)_72px_72px_20px] gap-2 px-3 ' +
  'xsm:grid-cols-[80px_minmax(0,1fr)_72px_72px_20px] ' +
  'vsm:grid-cols-[88px_minmax(0,1fr)_64px_80px_78px_20px] vsm:gap-3 vsm:px-3.5'

const OrdersTable = ({ orders, emptyState }: Props) => {
  return (
    <Card padded={false}>
      <div className={`grid ${GRID} pt-2 pb-2 text-[10px] text-fg-subtle uppercase tracking-wide`}>
        <span>Order</span>
        <span className="hidden xsm:inline">Customer</span>
        <span className="hidden vsm:inline">Date</span>
        <span className="text-right">Amount</span>
        <span>Status</span>
        <span />
      </div>

      {orders.length === 0
        ? emptyState ?? null
        : orders.map((o, i) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className={`grid ${GRID} items-center py-3 hover:bg-white/2 ${
                i === 0 ? '' : 'border-t border-white/4'
              }`}
            >
              <span className="font-mono text-[11px] text-fg-muted truncate">
                {o.order_number}
              </span>

              <div className="hidden xsm:block min-w-0 text-[12.5px] text-fg truncate">
                {o.customer_name}
              </div>

              <div className="hidden vsm:block text-[11.5px] text-fg-muted tnum">
                {formatRelative(o.created_at)}
              </div>

              <div
                className={`text-right tnum text-[12.5px] font-medium ${
                  o.status === 'cancelled' ? 'text-fg-subtle' : 'text-fg'
                }`}
              >
                ₦{o.total_amount.toLocaleString()}
              </div>

              <div>
                <StatusBadge status={o.status} />
              </div>

              <HiChevronRight size={14} className="text-fg-subtle justify-self-center" />
            </Link>
          ))}
    </Card>
  )
}

export default OrdersTable
