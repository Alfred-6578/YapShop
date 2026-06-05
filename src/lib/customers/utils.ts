import type {
  ConversationResponse,
  CustomerResponse,
  OrderResponse,
} from "@/lib/api/types"

/**
 * Filter orders down to those belonging to a specific customer.
 * Uses customer_id (UUID FK) — most reliable match.
 */
export function getOrdersForCustomer(
  customer: CustomerResponse,
  allOrders: OrderResponse[],
): OrderResponse[] {
  return allOrders.filter((o) => o.customer_id === customer.id)
}

/**
 * Filter conversations to those belonging to a customer.
 * Uses customer_id (UUID FK) — the conversation API exposes customer_id
 * directly, no need to fall back to whatsapp_number matching.
 */
export function getConversationsForCustomer(
  customer: CustomerResponse,
  allConversations: ConversationResponse[],
): ConversationResponse[] {
  return allConversations.filter((c) => c.customer_id === customer.id)
}

/** Lifetime value: sum of total_amount for non-cancelled orders. */
export function getLifetimeValue(orders: OrderResponse[]): number {
  return orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0)
}

/** Count of non-cancelled orders. */
export function getOrderCount(orders: OrderResponse[]): number {
  return orders.filter((o) => o.status !== "cancelled").length
}

/** Total order count (includes cancelled). */
export function getTotalOrderCount(orders: OrderResponse[]): number {
  return orders.length
}

/** Average non-cancelled order value. Zero when no completed orders. */
export function getAverageOrder(orders: OrderResponse[]): number {
  const count = getOrderCount(orders)
  if (count === 0) return 0
  return Math.round(getLifetimeValue(orders) / count)
}

/** Most recent order regardless of status. Null if none. */
export function getLastOrder(orders: OrderResponse[]): OrderResponse | null {
  if (orders.length === 0) return null
  return [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
}

/**
 * Most recent activity timestamp across orders + conversations.
 * Uses `started_at` for conversations — the API doesn't expose a
 * `last_message_at` field, so this is the cleanest proxy for "when did we
 * last hear from them" until messages get their own endpoint.
 */
export function getLastActivityISO(
  orders: OrderResponse[],
  conversations: ConversationResponse[],
): string | null {
  const candidates = [
    ...orders.map((o) => o.created_at),
    ...conversations.map((c) => c.started_at),
  ]
  if (candidates.length === 0) return null
  return [...candidates].sort().reverse()[0]
}

export type CustomerActivityTag =
  | { kind: "attention"; label: "Needs attention" }
  | { kind: "in-chat"; label: "In chat" }
  | { kind: "handled"; label: string }
  | null

/**
 * Determine the activity tag from the customer's active conversation.
 * Note: the API exposes assigned_staff_id but not the staff name — the
 * "handled" label uses a generic "Staff member" string. If we want the
 * real name, the page should fetch staff and pass a lookup map in.
 */
export function getCustomerActivityTag(
  conversations: ConversationResponse[],
): CustomerActivityTag {
  const active = conversations.find((c) => c.status === "active")
  if (!active) return null
  if (active.handoff_status === "requested") {
    return { kind: "attention", label: "Needs attention" }
  }
  if (active.handoff_status === "active" && active.assigned_staff_id) {
    return { kind: "handled", label: "Staff member" }
  }
  return { kind: "in-chat", label: "In chat" }
}

/**
 * Primary name: prefer the formal `name`, fall back to `display_name`,
 * fall back to the WhatsApp number. Use this when you need a single string —
 * dialog titles, breadcrumbs without styling, etc. For UI labels prefer
 * <CustomerNameLabel /> which renders the secondary name too.
 */
export function getDisplayName(customer: CustomerResponse): string {
  return (
    customer.name || customer.display_name || customer.whatsapp_number
  )
}

/**
 * The shorter / informal name to render in parentheses after the primary.
 * Returns null when there's nothing meaningful to show — either field is
 * missing, or both fields hold the same value (would render as "Ada (Ada)").
 */
export function getSecondaryName(customer: CustomerResponse): string | null {
  if (!customer.name || !customer.display_name) return null
  if (customer.name === customer.display_name) return null
  return customer.display_name
}
