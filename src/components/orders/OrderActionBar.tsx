"use client"
import React from 'react'
import {
  HiCheck,
  HiEllipsisHorizontal,
  HiOutlineArchiveBox,
  HiOutlineTruck,
} from 'react-icons/hi2'

import Button from '@/components/ui/Button'
import type { Order, OrderStatus } from '@/lib/orders/mockData'

type Props = {
  order: Order
  onMarkNext: () => void
  onCancel: () => void
}

type NextAction = { label: string; icon: React.ReactNode } | null

const nextActionFor = (status: OrderStatus): NextAction => {
  switch (status) {
    case 'pending':
      return { label: 'Mark as paid', icon: <HiCheck size={14} /> }
    case 'paid':
      return { label: 'Mark as shipped', icon: <HiOutlineTruck size={14} /> }
    case 'shipped':
      return { label: 'Mark as delivered', icon: <HiOutlineArchiveBox size={14} /> }
    case 'delivered':
    case 'cancelled':
      return null
  }
}

const OrderActionBar = ({ order, onMarkNext, onCancel }: Props) => {
  const next = nextActionFor(order.status)
  const showCancel = order.status === 'pending' || order.status === 'paid'

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <span className="text-[12px] text-fg-muted flex-1 truncate">
        Orders /{' '}
        <b className="text-fg font-medium font-mono text-[11.5px]">{order.order_number}</b>
      </span>

      <button
        type="button"
        aria-label="More actions"
        className="h-8 w-8 inline-flex items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
      >
        <HiEllipsisHorizontal size={16} />
      </button>

      {showCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-[#F09595] border-[rgba(226,75,74,0.3)] border-[0.5px] bg-transparent rounded-[8px] px-3 py-1.5 text-[12.5px] font-medium hover:bg-[rgba(226,75,74,0.08)] cursor-pointer"
        >
          Cancel order
        </button>
      )}

      {next && (
        <Button variant="primary" icon={next.icon} onClick={onMarkNext}>
          {next.label}
        </Button>
      )}
    </div>
  )
}

export default OrderActionBar
