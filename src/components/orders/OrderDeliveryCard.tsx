import React from 'react'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import type { DeliveryAddress } from '@/lib/orders/mockData'

type Props = {
  delivery: DeliveryAddress
}

const OrderDeliveryCard = ({ delivery }: Props) => {
  return (
    <Card>
      <CardHeader title="Delivery" />
      <div className="mt-2 text-[11.5px]">
        <div className="text-[12.5px] text-fg font-medium">{delivery.full_name}</div>
        <div className="font-mono text-[10.5px] text-fg-muted mt-0.5">
          {delivery.phone_number}
        </div>
        <div className="text-[#C5CAD0] leading-relaxed mt-1.5">
          <div>{delivery.line}</div>
          <div>
            {delivery.city}, {delivery.state}
          </div>
          <div>{delivery.country}</div>
        </div>
        {delivery.landmark && (
          <div className="text-[10.5px] text-fg-subtle mt-1">
            Landmark: {delivery.landmark}
          </div>
        )}
      </div>
    </Card>
  )
}

export default OrderDeliveryCard
