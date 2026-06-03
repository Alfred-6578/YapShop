import Link from "next/link"
import { HiStar, HiOutlineExclamationCircle, HiOutlineUser } from "react-icons/hi2"
import { LiaRobotSolid } from "react-icons/lia"

import Card from "@/components/ui/Card"
import { formatRelative } from "@/lib/utils/format"
import { getCustomerColor, getCustomerInitials } from "@/lib/customers/visuals"
import {
  type CustomerActivityTag,
  getConversationsForCustomer,
  getCustomerActivityTag,
  getDisplayName,
  getLastActivityISO,
  getLastOrder,
  getLifetimeValue,
  getOrderCount,
  getOrdersForCustomer,
} from "@/lib/customers/utils"
import type {
  ConversationResponse,
  CustomerResponse,
  OrderResponse,
} from "@/lib/api/types"

type Props = {
  customers: CustomerResponse[]
  allOrders: OrderResponse[]
  allConversations: ConversationResponse[]
  emptyState?: React.ReactNode
}

const DORMANT_MS = 60 * 86_400_000

const ActivityTagPill = ({ tag }: { tag: CustomerActivityTag }) => {
  if (!tag) return null
  const base =
    "text-[9.5px] px-1.5 py-0 rounded-[5px] inline-flex items-center gap-1 whitespace-nowrap"
  if (tag.kind === "attention")
    return (
      <span
        className={`${base} bg-[rgba(240,169,43,0.18)] text-[#F0C36B]`}
      >
        <HiOutlineExclamationCircle size={10} />
        {tag.label}
      </span>
    )
  if (tag.kind === "in-chat")
    return (
      <span
        className={`${base} bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]`}
      >
        <LiaRobotSolid size={10} />
        {tag.label}
      </span>
    )
  return (
    <span className={`${base} bg-[rgba(21,194,106,0.16)] text-[#6FD9A0]`}>
      <HiOutlineUser size={10} />
      {tag.label}
    </span>
  )
}

const CustomersList = ({
  customers,
  allOrders,
  allConversations,
  emptyState,
}: Props) => {
  if (customers.length === 0) {
    return <Card padded={false}>{emptyState ?? null}</Card>
  }

  // Precompute LTV per id once so the VIP star is decided in one pass.
  const ltvById = new Map<string, number>()
  for (const c of customers) {
    ltvById.set(c.id, getLifetimeValue(getOrdersForCustomer(c, allOrders)))
  }
  const maxLtv = Math.max(0, ...ltvById.values())
  const topLtvId =
    maxLtv > 0
      ? [...ltvById.entries()].find(([, v]) => v === maxLtv)?.[0] ?? null
      : null

  return (
    <Card padded={false}>
      {customers.map((c) => {
        const custOrders = getOrdersForCustomer(c, allOrders)
        const custConvs = getConversationsForCustomer(c, allConversations)
        const lastActivity = getLastActivityISO(custOrders, custConvs)
        const dormant = !lastActivity ||
          Date.now() - new Date(lastActivity).getTime() > DORMANT_MS

        const initialsColor = dormant
          ? "#989DA3"
          : "rgba(255,255,255,0.85)"
        const displayName = getDisplayName(c)
        const tag = getCustomerActivityTag(custConvs)
        const lastOrder = getLastOrder(custOrders)
        const lastConv =
          custConvs.length > 0
            ? [...custConvs].sort((a, b) =>
                b.started_at.localeCompare(a.started_at),
              )[0]
            : null
        const hasActiveConv = custConvs.some((conv) => conv.status === "active")

        let activitySummary: string
        if (!lastOrder && !lastConv) {
          activitySummary = "No activity yet"
        } else {
          const orderTime = lastOrder
            ? new Date(lastOrder.created_at).getTime()
            : 0
          const convTime = lastConv ? new Date(lastConv.started_at).getTime() : 0
          const last =
            orderTime > convTime
              ? { kind: "order" as const, iso: lastOrder!.created_at }
              : { kind: "chat" as const, iso: lastConv!.started_at }
          const overOneDay =
            Date.now() - new Date(last.iso).getTime() > 86_400_000
          activitySummary = overOneDay
            ? `Last activity ${formatRelative(last.iso)}`
            : last.kind === "order"
              ? `Ordered ${formatRelative(last.iso)}`
              : `Chatted ${formatRelative(last.iso)}`
        }

        const parts = [c.whatsapp_number, activitySummary]
        if (hasActiveConv) parts.push("Active conversation")
        const metaLine = parts.join(" · ")

        const nameColor = dormant ? "text-[#989DA3]" : "text-fg"
        const metaColor = dormant ? "text-[#676C72]" : "text-fg-muted"

        const ltv = ltvById.get(c.id) ?? 0
        const orderCount = getOrderCount(custOrders)
        const ltvColor =
          c.id === topLtvId
            ? "text-[#F0A92B]"
            : ltv === 0
              ? "text-[#62666C]"
              : "text-fg"
        const sub = ltv === 0 && orderCount === 0 ? "0 completed" : `${orderCount} orders`

        return (
          <Link
            key={c.id}
            href={`/customers/${c.id}`}
            className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3 items-center px-3.5 py-3 hover:bg-white/2 border-b border-white/4 last:border-b-0"
          >
            <div className="relative h-10 w-10 shrink-0">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-medium"
                style={{
                  backgroundColor: getCustomerColor(c),
                  color: initialsColor,
                }}
              >
                {getCustomerInitials(c)}
              </div>
              {c.id === topLtvId && (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#F0A92B",
                    color: "#3D2806",
                    boxShadow: "0 0 0 2px #16171B",
                  }}
                >
                  <HiStar size={9} />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[12.5px] font-medium ${nameColor}`}>
                  {displayName}
                </span>
                <ActivityTagPill tag={tag} />
              </div>
              <div
                className={`text-[11px] truncate max-w-[330px] ${metaColor}`}
              >
                {metaLine}
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span
                className={`text-[13px] font-medium tnum tracking-tight ${ltvColor}`}
              >
                ₦{ltv.toLocaleString()}
              </span>
              <span className="text-[10.5px] text-fg-subtle">{sub}</span>
            </div>
          </Link>
        )
      })}
    </Card>
  )
}

export default CustomersList
