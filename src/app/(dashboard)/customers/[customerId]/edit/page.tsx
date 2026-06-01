'use client'

import { useRouter, useParams } from 'next/navigation'
import { MOCK_CUSTOMERS } from '@/lib/customers/mockData'
import CustomerForm from '@/components/customers/CustomerForm'

const EditCustomerPage = () => {
  const router = useRouter()
  const { customerId } = useParams<{ customerId: string }>()
  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId)

  if (!customer) {
    return <div className="p-4 text-fg-muted text-[12px]">Customer not found.</div>
  }

  return (
    <CustomerForm
      customer={customer}
      onSubmit={(values) => {
        console.log('update customer', customer.id, values)
        router.push(`/customers/${customer.id}`)
      }}
      onCancel={() => router.push(`/customers/${customer.id}`)}
      onDelete={() => {
        console.log('delete customer', customer.id)
        router.push('/customers')
      }}
    />
  )
}

export default EditCustomerPage
