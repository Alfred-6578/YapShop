import type { StaffResponse } from "@/lib/api/types"

/**
 * Orders carry financial state — support can't move them. They escalate to
 * admin: "Customer says they paid, here's the proof." Admin verifies and
 * flips the status. This avoids conflating customer service with financial
 * confirmation.
 */

function isPriv(user: StaffResponse | null): boolean {
  if (!user) return false
  return user.role === "admin" || user.role === "owner"
}

/** Advance the order status (pending → paid → shipped → delivered). */
export function canChangeOrderStatus(user: StaffResponse | null): boolean {
  return isPriv(user)
}

/** Cancel an in-flight order. Financially significant — admin+ only. */
export function canCancelOrder(user: StaffResponse | null): boolean {
  return isPriv(user)
}

/** Edit order line items / address / notes after creation. */
export function canEditOrder(user: StaffResponse | null): boolean {
  return isPriv(user)
}
