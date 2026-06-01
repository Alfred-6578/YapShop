import React from 'react'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import type { PaymentStatus } from '@/lib/orders/mockData'

type Props = {
  payment_status: PaymentStatus
  total_amount: number
  payment_method?: string
}

const OrderPaymentCard = ({ payment_status, total_amount, payment_method }: Props) => {
  return (
    <Card>
      <CardHeader title="Payment" />
      <div className="mt-2 text-[11.5px]">
        <div className="flex justify-between items-center py-1">
          <span className="text-fg-muted">Status</span>
          <StatusBadge status={payment_status} />
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-fg-muted">Amount</span>
          <span className="font-medium tnum text-fg">
            ₦{total_amount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-fg-muted">Method</span>
          <span className={payment_method ? 'text-fg' : 'text-fg-subtle'}>
            {payment_method ?? 'Not yet recorded'}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default OrderPaymentCard
