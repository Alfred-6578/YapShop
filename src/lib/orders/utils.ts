import type { OrderResponse } from "@/lib/api/types"

/**
 * Combine the structured address fields into a single line for compact
 * displays (list rows, tooltips). Returns null when no shipping address
 * exists — that's a pickup order, not an error.
 */
export function formatAddressOneLine(order: OrderResponse): string | null {
  const parts = [
    order.address_line,
    order.address_city,
    order.address_state,
    order.address_country,
  ].filter((p): p is string => typeof p === "string" && p.trim() !== "")

  return parts.length === 0 ? null : parts.join(", ")
}

/**
 * Format as a stack of lines for the delivery card: street (+landmark),
 * city/state/postal, country. Empty array if no shipping address.
 */
export function formatAddressLines(order: OrderResponse): string[] {
  const lines: string[] = []

  if (order.address_line && order.address_line.trim() !== "") {
    lines.push(order.address_line)
  }

  const cityLine = [order.address_city, order.address_state, order.address_postal_code]
    .filter((p): p is string => typeof p === "string" && p.trim() !== "")
    .join(", ")
  if (cityLine) lines.push(cityLine)

  if (order.address_country) lines.push(order.address_country)

  if (order.address_landmark && order.address_landmark.trim() !== "") {
    lines.push(`Landmark: ${order.address_landmark}`)
  }

  return lines
}

/** Whether the order has any shipping address at all. */
export function hasShippingAddress(order: OrderResponse): boolean {
  return Boolean(
    order.address_line ||
      order.address_city ||
      order.address_state ||
      order.address_country,
  )
}
