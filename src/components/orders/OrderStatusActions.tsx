"use client"
import { useState } from "react"
import {
  HiEllipsisHorizontal,
  HiOutlineArchiveBox,
  HiOutlineArrowPath,
  HiOutlineCreditCard,
  HiOutlineExclamationTriangle,
  HiOutlineTruck,
  HiXMark,
} from "react-icons/hi2"

import type { OrderResponse, OrderStatus } from "@/lib/api/types"

type ForwardStatus = Exclude<OrderStatus, "cancelled">

type NextAction = {
  label: string
  value: ForwardStatus
  icon: React.ReactNode
}

const ICON_SIZE = 14

const getNextAction = (current: OrderStatus): NextAction | null => {
  switch (current) {
    case "pending":
      return { label: "Mark as paid", value: "paid", icon: <HiOutlineCreditCard size={ICON_SIZE} /> }
    case "paid":
      return { label: "Mark as shipped", value: "shipped", icon: <HiOutlineTruck size={ICON_SIZE} /> }
    case "shipped":
      return { label: "Mark as delivered", value: "delivered", icon: <HiOutlineArchiveBox size={ICON_SIZE} /> }
    case "delivered":
    case "cancelled":
      return null
  }
}

const canCancel = (current: OrderStatus): boolean =>
  current !== "delivered" && current !== "cancelled"

type Props = {
  order: OrderResponse
  onStatusChange: (newStatus: ForwardStatus) => void
  onCancel: () => void
  isUpdating: boolean
  updateError: Error | null
}

const OrderStatusActions = ({
  order,
  onStatusChange,
  onCancel,
  isUpdating,
  updateError,
}: Props) => {
  const [kebabOpen, setKebabOpen] = useState(false)
  const nextAction = getNextAction(order.status)
  const canCancelOrder = canCancel(order.status)

  const handleCancelClick = () => {
    setKebabOpen(false)
    const confirmed = window.confirm(
      `Cancel order ${order.order_number}? This action can't be undone.`,
    )
    if (confirmed) onCancel()
  }

  return (
    <div className="flex items-center gap-2 relative">
      {updateError && (
        <span className="text-[11px] text-[#F09595] mr-1 flex items-center gap-1.5 max-w-[160px] truncate">
          <HiOutlineExclamationTriangle size={12} className="shrink-0" />
          <span className="truncate">{updateError.message || "Couldn't update"}</span>
        </span>
      )}

      {nextAction && (
        <button
          type="button"
          onClick={() => onStatusChange(nextAction.value)}
          disabled={isUpdating}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-2 vsm:px-3 py-2 rounded-[8px] text-[12.5px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isUpdating ? (
            <>
              <HiOutlineArrowPath size={ICON_SIZE} className="animate-spin" />
              <span className="hidden vsm:inline">Updating…</span>
            </>
          ) : (
            <>
              {nextAction.icon}
              <span className="hidden vsm:inline">{nextAction.label}</span>
            </>
          )}
        </button>
      )}

      {canCancelOrder && (
        <>
          <button
            type="button"
            onClick={() => setKebabOpen((o) => !o)}
            disabled={isUpdating}
            aria-label="More actions"
            className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <HiEllipsisHorizontal size={16} />
          </button>
          {kebabOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setKebabOpen(false)}
              />
              <div className="absolute right-0 top-[34px] z-20 bg-card border border-border rounded-[8px] shadow-lg min-w-[160px] py-1">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="w-full text-left text-[12px] text-[#F09595] px-3 py-2 hover:bg-white/2 flex items-center gap-2 cursor-pointer"
                >
                  <HiXMark size={14} />
                  Cancel order
                </button>
              </div>
            </>
          )}
        </>
      )}

      {!nextAction && !canCancelOrder && (
        <span className="text-[11px] text-fg-subtle italic">
          {order.status === "delivered" ? "Order completed" : "Order cancelled"}
        </span>
      )}
    </div>
  )
}

export default OrderStatusActions
