import type { CustomerResponse } from "@/lib/api/types"

/** Palette mirrors products/visuals — keeps a customer's avatar consistent
 *  with their orders and mentions across the app. */
const COLORS = [
  "#7C2D5E",
  "#1F4D7A",
  "#5C3B7E",
  "#7A4419",
  "#2A6E54",
  "#3A3D44",
]

/** Two-letter initials from name → display_name → fallback "??". */
export function getCustomerInitials(
  customer: Pick<CustomerResponse, "name" | "display_name" | "whatsapp_number">,
): string {
  const source = customer.name || customer.display_name || ""
  const tokens = source.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    // Fall back to last two digits of phone — better than "??" for an
    // anonymous customer who only ever messaged us.
    const digits = customer.whatsapp_number.replace(/\D/g, "")
    return digits.slice(-2) || "??"
  }
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase()
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase()
}

/** Stable color derived from id — same customer renders the same color. */
export function getCustomerColor(
  customer: Pick<CustomerResponse, "id">,
): string {
  let hash = 0
  for (let i = 0; i < customer.id.length; i++) {
    hash = (hash * 31 + customer.id.charCodeAt(i)) | 0
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}
