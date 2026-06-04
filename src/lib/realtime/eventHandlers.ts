import type { QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export interface RealtimeEvent {
  event: string
  data?: Record<string, unknown>
  timestamp?: string
}

/**
 * Dispatch a realtime event to the appropriate cache invalidations + UI.
 * Pure function — receives the queryClient and the parsed payload, makes the
 * right calls. Trivial to test in isolation: mock queryClient, fire events,
 * assert calls.
 */
export function handleRealtimeEvent(
  payload: RealtimeEvent,
  queryClient: QueryClient,
): void {
  switch (payload.event) {
    case "new_order": {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      const customerName =
        (payload.data?.customer_name as string | undefined) ?? "a customer"
      const orderNumber =
        (payload.data?.order_number as string | undefined) ?? "new order"
      toast.success(`New order from ${customerName}`, {
        description: `Order ${orderNumber}`,
      })
      break
    }

    case "order_status_changed": {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      const orderNumber =
        (payload.data?.order_number as string | undefined) ?? "Order"
      const status =
        (payload.data?.status as string | undefined) ?? "updated"
      toast(`${orderNumber} → ${status}`)
      break
    }

    case "new_handoff": {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      const customerName =
        (payload.data?.customer_name as string | undefined) ?? "A customer"
      const reason =
        (payload.data?.reason as string | undefined) ?? "Tap to view"
      toast.warning(`${customerName} needs help`, {
        description: reason,
        action: {
          label: "View queue",
          onClick: () => {
            window.location.href = "/handoffs"
          },
        },
      })
      break
    }

    case "handoff_claimed": {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      // Silent — operator either did it themselves or saw a teammate do it.
      break
    }

    case "handoff_resolved": {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      // Silent — same logic as handoff_claimed. Operator initiated it or
      // saw the resolution happen.
      break
    }

    case "new_conversation": {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      // Silent — every WhatsApp first-message creates a conversation, too
      // frequent for a toast.
      break
    }

    case "new_message": {
      const conversationId = payload.data?.conversation_id as
        | string
        | undefined
      if (conversationId) {
        // Targeted invalidation of just this conversation's message thread.
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversation", conversationId],
        })
      }
      // Conversations list bumps the affected row to the top via last
      // activity — invalidate so any mounted list view reflects the change.
      queryClient.invalidateQueries({ queryKey: ["conversations"] })

      // Toast only if the operator isn't currently looking at this
      // conversation — they'd see the bubble appear, so a toast is noise.
      const viewingThis =
        typeof window !== "undefined" &&
        !!conversationId &&
        window.location.pathname === `/conversations/${conversationId}`
      const senderType = payload.data?.sender_type as string | undefined
      // Don't toast on our own outbound sends — they painted optimistically
      // and were confirmed by the mutation already.
      const isOutbound = senderType === "staff" || senderType === "ai"
      if (!viewingThis && !isOutbound) {
        const customerName =
          (payload.data?.customer_name as string | undefined) ?? "A customer"
        const preview =
          (payload.data?.content_preview as string | undefined) ??
          (payload.data?.content as string | undefined) ??
          "New message"
        toast(`${customerName}`, {
          description: preview.length > 60 ? `${preview.slice(0, 60)}…` : preview,
          action: conversationId
            ? {
                label: "Open",
                onClick: () => {
                  window.location.href = `/conversations/${conversationId}`
                },
              }
            : undefined,
        })
      }
      break
    }

    case "new_customer": {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      // Silent — too frequent for a toast; the count just updates.
      break
    }

    case "low_stock_alert": {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      const productName =
        (payload.data?.product_name as string | undefined) ?? "A product"
      const quantity = payload.data?.quantity as number | undefined
      toast.warning(`Low stock: ${productName}`, {
        description: quantity !== undefined ? `${quantity} left` : undefined,
      })
      break
    }

    default: {
      console.warn("[realtime] unknown event", payload.event)
    }
  }
}
