"use client"
import React from 'react'
import { useParams } from 'next/navigation'

import OrderActionBar from '@/components/orders/OrderActionBar'
import OrderCustomerCard from '@/components/orders/OrderCustomerCard'
import OrderDeliveryCard from '@/components/orders/OrderDeliveryCard'
import OrderItemsCard from '@/components/orders/OrderItemsCard'
import OrderPaymentCard from '@/components/orders/OrderPaymentCard'
import OrderStatusHero from '@/components/orders/OrderStatusHero'
import { MOCK_ORDERS } from '@/lib/orders/mockData'

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const order = MOCK_ORDERS.find((o) => o.id === orderId)

  if (!order) {
    return <div className="p-4 text-fg-muted text-[12px]">Order not found.</div>
  }

  const handleMarkNext = () => {
    console.log('advance status from', order.status)
  }
  const handleCancel = () => {
    console.log('cancel order', order.id)
  }

  return (
    <>
      <OrderActionBar order={order} onMarkNext={handleMarkNext} onCancel={handleCancel} />
      <div className="p-4 flex flex-col gap-3">
        <OrderStatusHero order={order} />
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 items-start">
          <div className="flex flex-col gap-2.5 min-w-0">
            <OrderItemsCard items={order.items} />
          </div>
          <div className="flex flex-col gap-2.5 min-w-0">
            <OrderCustomerCard name={order.customer_name} whatsapp={order.customer_whatsapp} />
            <OrderDeliveryCard delivery={order.delivery} />
            <OrderPaymentCard
              payment_status={order.payment_status}
              total_amount={order.total_amount}
              payment_method={order.payment_method}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailPage
