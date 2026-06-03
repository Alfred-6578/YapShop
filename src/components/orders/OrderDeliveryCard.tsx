import React from "react"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import { formatAddressLines, hasShippingAddress } from "@/lib/orders/utils"
import type { OrderResponse } from "@/lib/api/types"

type Props = {
  order: OrderResponse
  /** Customer name from the order, used to decide whether to surface the
   *  recipient line. If recipient matches customer, no need to repeat it. */
  customerName?: string
}

const OrderDeliveryCard = ({ order, customerName }: Props) => {
  const hasAddress = hasShippingAddress(order)
  const lines = formatAddressLines(order)
  const recipient = order.address_full_name
  const showRecipient =
    !!recipient && (!customerName || recipient.trim() !== customerName.trim())

  return (
    <Card>
      <CardHeader title="Delivery" />
      <div className="mt-2 text-[11.5px]">
        {hasAddress ? (
          <>
            {showRecipient && (
              <div className="text-[12.5px] text-fg font-medium mb-0.5">
                {recipient}
              </div>
            )}
            {order.address_phone_number && (
              <div className="font-mono text-[10.5px] text-fg-muted mt-0.5">
                {order.address_phone_number}
              </div>
            )}
            <div className="text-[#C5CAD0] leading-relaxed mt-1.5">
              {lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-fg-muted text-[11.5px] italic">
            Pickup — no delivery address
          </div>
        )}
      </div>
    </Card>
  )
}

export default OrderDeliveryCard
