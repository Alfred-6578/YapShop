"use client"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2"

import CustomerActionBar from "@/components/customers/CustomerActionBar"
import CustomerHero from "@/components/customers/CustomerHero"
import CustomerStats from "@/components/customers/CustomerStats"
import CustomerOrdersSection from "@/components/customers/CustomerOrdersSection"
import CustomerConversationsSection from "@/components/customers/CustomerConversationsSection"
import CustomerNotesSection from "@/components/customers/CustomerNotesSection"
import { getCustomer } from "@/lib/api/customers"
import { listOrdersByCustomer } from "@/lib/api/orders"
import { listConversations } from "@/lib/api/conversations"
import { getConversationsForCustomer } from "@/lib/customers/utils"

const CustomerDetailPage = () => {
  const router = useRouter()
  const { customerId } = useParams<{ customerId: string }>()

  const customerQuery = useQuery({
    queryKey: ["customers", "detail", customerId],
    queryFn: () => getCustomer(customerId),
    staleTime: 30_000,
    enabled: !!customerId,
  })

  const ordersQuery = useQuery({
    queryKey: ["orders", "by-customer", customerId],
    queryFn: () => listOrdersByCustomer(customerId),
    staleTime: 30_000,
    enabled: !!customerId,
  })

  // No per-customer conversations endpoint yet — pull full list and filter
  // client-side by customer_id.
  const conversationsQuery = useQuery({
    queryKey: ["conversations", "list"],
    queryFn: listConversations,
    staleTime: 30_000,
  })

  if (customerQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading customer…
        </div>
      </div>
    )
  }

  if (customerQuery.isError || !customerQuery.data) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineExclamationTriangle size={28} className="text-[#F09595]" />
        <div className="text-[13px] text-fg text-center">
          Couldn&apos;t load this customer.
        </div>
        <button
          type="button"
          onClick={() => router.push("/customers")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to customers
        </button>
      </div>
    )
  }

  const customer = customerQuery.data
  const orders = ordersQuery.data ?? []
  const conversations = getConversationsForCustomer(
    customer,
    conversationsQuery.data ?? [],
  )

  return (
    <>
      <CustomerActionBar customer={customer} />
      <div className="p-4 flex flex-col gap-3">
        <CustomerHero customer={customer} conversations={conversations} />
        <CustomerStats orders={orders} />
        <CustomerOrdersSection orders={orders} isLoading={ordersQuery.isLoading} />
        <CustomerConversationsSection
          conversations={conversations}
          isLoading={conversationsQuery.isLoading}
        />
        <CustomerNotesSection customer={customer} />
      </div>
    </>
  )
}

export default CustomerDetailPage
