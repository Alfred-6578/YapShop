import type { StaffResponse } from "@/lib/api/types"

/**
 * Customers can be edited by everyone — customer-service updates ("my
 * address changed") happen mid-conversation, and locking support out of
 * profile edits forces awkward escalations. Delete is destructive and
 * audit-relevant; admin+ only.
 */

function isPriv(user: StaffResponse | null): boolean {
  if (!user) return false
  return user.role === "admin" || user.role === "owner"
}

export function canEditCustomer(user: StaffResponse | null): boolean {
  // All authenticated staff can edit customer profiles.
  return !!user
}

export function canDeleteCustomer(user: StaffResponse | null): boolean {
  return isPriv(user)
}
