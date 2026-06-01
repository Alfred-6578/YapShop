'use client'

import { useParams } from 'next/navigation'
import {
  MOCK_CUSTOMERS,
  getOrdersForCustomer,
  getConversationsForCustomer,
} from '@/lib/customers/mockData'
import CustomerActionBar from '@/components/customers/CustomerActionBar'
import CustomerHero from '@/components/customers/CustomerHero'
import CustomerStats from '@/components/customers/CustomerStats'
import CustomerOrdersSection from '@/components/customers/CustomerOrdersSection'
import CustomerConversationsSection from '@/components/customers/CustomerConversationsSection'
import CustomerNotesSection from '@/components/customers/CustomerNotesSection'

const CustomerDetailPage = () => {
  const { customerId } = useParams<{ customerId: string }>()
  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId)

  if (!customer) {
    return <div className="p-4 text-fg-muted text-[12px]">Customer not found.</div>
  }

  const orders = getOrdersForCustomer(customer)
  const conversations = getConversationsForCustomer(customer)

  return (
    <>
      <CustomerActionBar customer={customer} />
      <div className="p-4 flex flex-col gap-3">
        <CustomerHero customer={customer} />
        <CustomerStats customer={customer} />
        <CustomerOrdersSection orders={orders} />
        <CustomerConversationsSection conversations={conversations} />
        <CustomerNotesSection customer={customer} />
      </div>
    </>
  )
}

export default CustomerDetailPage
