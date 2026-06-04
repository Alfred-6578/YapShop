import type { StaffResponse } from "@/lib/api/types"
import type { StaffRole } from "@/lib/api/staff"

function isSelf(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  return !!currentUser && currentUser.id === target.id
}

/**
 * Shared management rule:
 * - No one can manage themselves through this UI (use the password card instead)
 * - Owner can manage anyone (including other owners)
 * - Admin can manage support staff
 * - Support can manage no one
 */
function canManage(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  if (!currentUser) return false
  if (isSelf(currentUser, target)) return false
  if (currentUser.role === "owner") return true
  if (currentUser.role === "admin" && target.role === "support") return true
  return false
}

/**
 * Profile fields (name, email, phone, whatsapp) are editable when:
 * - You're editing yourself (anyone can keep their own profile current), OR
 * - You'd otherwise be able to manage this target via canManage
 *
 * This is intentionally looser than canEditRole — a support user can update
 * their own name without being able to promote themselves.
 */
export function canEditProfile(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  if (!currentUser) return false
  if (isSelf(currentUser, target)) return true
  return canManage(currentUser, target)
}

export function canEditRole(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  return canManage(currentUser, target)
}

export function canToggleActive(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  return canManage(currentUser, target)
}

export function canDelete(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  return canManage(currentUser, target)
}

/**
 * Only the user themselves can change their own password.
 * No admin password reset flow in v1 — would need backend support for
 * one-time reset tokens.
 */
export function canChangePassword(
  currentUser: StaffResponse | null,
  target: StaffResponse,
): boolean {
  return isSelf(currentUser, target)
}

/**
 * Roles the current user is allowed to assign on create/edit.
 * Owners can assign any role (including making someone else an owner).
 * Admins can only create/manage support staff.
 * Support staff can't invite anyone.
 */
export function availableRoles(currentUser: StaffResponse | null): StaffRole[] {
  if (!currentUser) return []
  if (currentUser.role === "owner") return ["support", "admin", "owner"]
  if (currentUser.role === "admin") return ["support"]
  return []
}

/** Two-letter initials for the avatar fallback. */
export function getStaffInitials(staff: { name: string }): string {
  const parts = staff.name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]).join("").toUpperCase() || "?"
}

/** Convenience: is this user an owner? */
export function isOwner(staff: StaffResponse | null): boolean {
  return staff?.role === "owner"
}

/** Convenience: can this user invite new staff at all? */
export function canInviteStaff(currentUser: StaffResponse | null): boolean {
  return availableRoles(currentUser).length > 0
}
