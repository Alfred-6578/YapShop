import type { StaffResponse } from "@/lib/api/types"

/**
 * Products are inventory + pricing — admin/owner territory. Support reads
 * the catalog (they answer "is this in stock?" questions) but can't mutate.
 */

function isPriv(user: StaffResponse | null): boolean {
  if (!user) return false
  return user.role === "admin" || user.role === "owner"
}

export function canCreateProduct(user: StaffResponse | null): boolean {
  return isPriv(user)
}

export function canEditProduct(user: StaffResponse | null): boolean {
  return isPriv(user)
}

export function canDeleteProduct(user: StaffResponse | null): boolean {
  return isPriv(user)
}

/** Adjust stock count or low-stock threshold. */
export function canChangeStock(user: StaffResponse | null): boolean {
  return isPriv(user)
}
