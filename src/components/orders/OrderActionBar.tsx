"use client"
import React from "react"
import Link from "next/link"

import type { OrderResponse } from "@/lib/api/types"

type Props = {
  order: OrderResponse
  /** Right-aligned action slot — typically OrderStatusActions. */
  children?: React.ReactNode
}

const OrderActionBar = ({ order, children }: Props) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <nav
        aria-label="Breadcrumb"
        className="text-[12px] flex-1 min-w-0 truncate"
      >
        <Link
          href="/orders"
          className="text-fg-muted hover:text-fg transition-colors"
        >
          Orders
        </Link>
        <span className="text-fg-subtle mx-1.5">/</span>
        <span className="text-fg font-medium font-mono text-[11.5px]">
          {order.order_number}
        </span>
      </nav>
      {children}
    </div>
  )
}

export default OrderActionBar
