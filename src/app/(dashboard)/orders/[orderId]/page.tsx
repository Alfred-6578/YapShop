"use client"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2"

import OrderActionBar from "@/components/orders/OrderActionBar"
import OrderCustomerCard from "@/components/orders/OrderCustomerCard"
import OrderDeliveryCard from "@/components/orders/OrderDeliveryCard"
import OrderItemsCard from "@/components/orders/OrderItemsCard"
import OrderPaymentCard from "@/components/orders/OrderPaymentCard"
import OrderStatusActions from "@/components/orders/OrderStatusActions"
import OrderStatusHero from "@/components/orders/OrderStatusHero"
import { cancelOrder, getOrder, listOrderItems, updateOrderStatus } from "@/lib/api/orders"
import { getCurrentStaff } from "@/lib/api/staff"
import type { OrderStatus } from "@/lib/api/types"

type ForwardStatus = Exclude<OrderStatus, "cancelled">

const OrderDetailPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { orderId } = useParams<{ orderId: string }>()

  const orderQuery = useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: () => getOrder(orderId),
    staleTime: 30_000,
    enabled: !!orderId,
  })

  const itemsQuery = useQuery({
    queryKey: ["orders", "items", orderId],
    queryFn: () => listOrderItems(orderId),
    staleTime: 30_000,
    enabled: !!orderId,
  })

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

  const statusMutation = useMutation({
    mutationFn: (newStatus: ForwardStatus) => updateOrderStatus(orderId, newStatus),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(["orders", "detail", orderId], updatedOrder)
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(["orders", "detail", orderId], updatedOrder)
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] })
    },
  })

  if (orderQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading order…
        </div>
      </div>
    )
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineExclamationTriangle size={28} className="text-[#F09595]" />
        <div className="text-[13px] text-fg text-center">Couldn&apos;t load this order.</div>
        <div className="text-[11.5px] text-fg-subtle text-center">
          It may have been deleted, or the connection failed.
        </div>
        <button
          type="button"
          onClick={() => router.push("/orders")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to orders
        </button>
      </div>
    )
  }

  const order = orderQuery.data
  const items = itemsQuery.data ?? []

  return (
    <>
      <OrderActionBar order={order}>
        <OrderStatusActions
          order={order}
          currentUser={meQuery.data ?? null}
          onStatusChange={(newStatus) => statusMutation.mutate(newStatus)}
          onCancel={() => cancelMutation.mutate()}
          isUpdating={statusMutation.isPending || cancelMutation.isPending}
          updateError={statusMutation.error ?? cancelMutation.error}
        />
      </OrderActionBar>
      <div className="p-4 flex flex-col gap-3">
        <OrderStatusHero order={order} />
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 items-start">
          <div className="flex flex-col gap-2.5 min-w-0">
            <OrderItemsCard
              items={items}
              total_amount={order.total_amount}
              isLoading={itemsQuery.isLoading}
            />
          </div>
          <div className="flex flex-col gap-2.5 min-w-0">
            <OrderCustomerCard
              name={order.customer_name}
              whatsapp={order.customer_whatsapp_number}
            />
            <OrderDeliveryCard order={order} customerName={order.customer_name} />
            <OrderPaymentCard
              payment_status={order.payment_status}
              total_amount={order.total_amount}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailPage
