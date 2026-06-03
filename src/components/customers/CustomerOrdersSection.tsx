import Link from "next/link"
import { HiChevronRight, HiOutlineArrowPath } from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import StatusBadge from "@/components/ui/StatusBadge"
import type { OrderResponse } from "@/lib/api/types"

type Props = {
  orders: OrderResponse[]
  isLoading?: boolean
}

const CustomerOrdersSection = ({ orders, isLoading = false }: Props) => {
  const sorted = [...orders]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)
  const total = orders.length

  const header = (meta: React.ReactNode) => (
    <CardHeader title="Orders" meta={meta} />
  )

  if (isLoading) {
    return (
      <Card>
        {header(<span className="text-[11px] text-fg-muted">Loading…</span>)}
        <div className="py-6 flex items-center justify-center gap-2 text-[11.5px] text-fg-muted">
          <HiOutlineArrowPath size={13} className="animate-spin" />
          Loading orders…
        </div>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        {header(<span className="text-[11px] text-fg-muted">0</span>)}
        <div className="py-6 text-center text-[11.5px] text-fg-subtle">
          No orders yet.
        </div>
      </Card>
    )
  }

  return (
    <Card>
      {header(
        <div className="flex items-center gap-3 text-[11px] text-fg-muted">
          <span>{total} total</span>
          <Link href="/orders" className="text-[#6FD9A0] hover:underline">
            View all
          </Link>
        </div>,
      )}
      <div className="mt-2">
        {sorted.map((o) => (
          <Link
            key={o.id}
            href={`/orders/${o.id}`}
            className="grid grid-cols-[88px_minmax(0,1fr)_80px_78px_14px] gap-3 items-center py-2.5 border-t border-white/4 first:border-t-0 hover:bg-white/2"
          >
            <span className="font-mono text-[11px] text-fg-muted">
              {o.order_number}
            </span>
            <span className="text-[11.5px] text-fg-muted truncate">
              {o.status === "cancelled" ? "Cancelled" : "Order placed"}
            </span>
            <span
              className={`text-right text-[12px] font-medium tnum ${
                o.status === "cancelled" ? "text-fg-subtle" : "text-fg"
              }`}
            >
              ₦{o.total_amount.toLocaleString()}
            </span>
            <StatusBadge status={o.status} />
            <HiChevronRight size={12} className="text-fg-subtle justify-self-center" />
          </Link>
        ))}
      </div>
    </Card>
  )
}

export default CustomerOrdersSection
