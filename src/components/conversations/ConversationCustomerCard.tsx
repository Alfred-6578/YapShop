import React from 'react'
import { HiChevronRight } from 'react-icons/hi2'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import { MOCK_ORDERS } from '@/lib/orders/mockData'

type Props = {
  customer_id: string
  customer_name: string
  customer_whatsapp: string
  customer_initials: string
  customer_color: string
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const formatMonthYear = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const ConversationCustomerCard = ({
  customer_id,
  customer_name,
  customer_whatsapp,
  customer_initials,
  customer_color,
}: Props) => {
  const orders = MOCK_ORDERS.filter((o) => o.customer_name === customer_name)
  const totalOrders = orders.length
  const lifetimeValue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0)
  const earliest = orders.reduce<string | null>((earliest, o) => {
    if (!earliest) return o.created_at
    return new Date(o.created_at).getTime() < new Date(earliest).getTime() ? o.created_at : earliest
  }, null)
  const customerSince = earliest ? formatMonthYear(earliest) : '—'

  return (
    <Card>
      <CardHeader title="Customer" />
      <div className="mt-2 flex items-center gap-2.5">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-fg text-[12px] font-medium shrink-0"
          style={{ backgroundColor: customer_color }}
        >
          {customer_initials}
        </div>
        <div className="min-w-0">
          <div className="text-[12.5px] text-fg font-medium truncate">{customer_name}</div>
          <div className="font-mono text-[10.5px] text-fg-muted truncate">
            {customer_whatsapp}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">Customer since</span>
          <span className="text-[#C5CAD0]">{customerSince}</span>
        </div>
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">Total orders</span>
          <span className="text-[#C5CAD0] tnum">{totalOrders}</span>
        </div>
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">Lifetime value</span>
          <span className="text-[#C5CAD0] tnum">₦{lifetimeValue.toLocaleString()}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => console.log('view customer', customer_id)}
        className="text-[11px] text-[#6FD9A0] inline-flex items-center gap-1 cursor-pointer mt-1.5"
      >
        View customer
        <HiChevronRight size={13} />
      </button>
    </Card>
  )
}

export default ConversationCustomerCard
