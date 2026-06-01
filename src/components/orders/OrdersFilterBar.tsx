"use client"
import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'

import Input from '@/components/ui/Input'
import SegmentedControl from '@/components/ui/SegmentedControl'
import type { OrderStatus } from '@/lib/orders/mockData'

export type OrderStatusFilter = OrderStatus | 'all'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: OrderStatusFilter
  onStatusChange: (v: OrderStatusFilter) => void
}

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const OrdersFilterBar = ({ search, onSearchChange, status, onStatusChange }: Props) => {
  return (
    <div className="flex flex-col vsm:flex-row vsm:items-center gap-2 vsm:gap-2.5">
      <Input
        className="vsm:flex-1"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by order # or customer…"
        icon={<HiMagnifyingGlass size={14} />}
      />
      <div className=" overflow-x-hidden vsm:overflow-x-auto -mx-4 px-4 vsm:mx-0 vsm:px-0 vsm:overflow-visible">
        <SegmentedControl
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
        />
      </div>
    </div>
  )
}

export default OrdersFilterBar
