import React from 'react'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Thumbnail from '@/components/ui/Thumbnail'
import type { OrderItem } from '@/lib/orders/mockData'

type Props = {
  items: OrderItem[]
}

const OrderItemsCard = ({ items }: Props) => {
  const total = items.reduce((s, i) => s + i.subtotal, 0)
  const meta = `${items.length} item${items.length !== 1 ? 's' : ''}`

  return (
    <Card>
      <CardHeader title="Items" meta={<span>{meta}</span>} />

      <div className="mt-2">
        {items.map((it, i) => (
          <div
            key={it.id}
            className={`grid grid-cols-[40px_minmax(0,1fr)_auto] gap-2.5 items-center py-2 ${
              i === 0 ? '' : 'border-t border-white/5'
            }`}
          >
            <Thumbnail size={40} color={it.thumbnail_color} initials={it.initials} />
            <div className="min-w-0">
              <div className="text-[12px] text-fg truncate">{it.product_name}</div>
              <div className="font-mono text-[10.5px] text-fg-subtle mt-0.5 truncate">
                {it.product_sku}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium tnum">
                ₦{it.subtotal.toLocaleString()}
              </div>
              <div className="text-[10.5px] text-fg-muted mt-0.5 tnum">
                {it.quantity} × ₦{it.unit_price.toLocaleString()}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center border-t border-white/8 mt-1.5 pt-2.5 text-[13px] font-medium">
          <span className="text-fg-muted font-normal">Total</span>
          <span className="tnum">₦{total.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  )
}

export default OrderItemsCard
