import React from 'react'

import Card from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import OrderStatusStepper from './OrderStatusStepper'
import { formatRelative } from '@/lib/utils/format'
import type { Order } from '@/lib/orders/mockData'

type Props = {
  order: Order
}

const OrderStatusHero = ({ order }: Props) => {
  return (
    <Card>
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[18px] font-medium tracking-tight">
            {order.order_number}
          </div>
          <div className="text-[11px] text-fg-muted mt-0.5">
            Created {formatRelative(order.created_at)} · Last updated{' '}
            {formatRelative(order.created_at)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={order.status} />
          <span className="text-[18px] font-medium tnum">
            ₦{order.total_amount.toLocaleString()}
          </span>
        </div>
      </div>
      <OrderStatusStepper status={order.status} />
    </Card>
  )
}

export default OrderStatusHero
