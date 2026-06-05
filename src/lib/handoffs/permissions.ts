import type { HumanHandOffResponse, StaffResponse } from "@/lib/api/types"

/**
 * Permission helpers for handoff actions. All take `(currentUser, handoff?)`
 * and return boolean. Hide buttons when the answer is false rather than
 * showing a disabled button — there's no contextual repair the user can do
 * on a permission denial.
 *
 * Backend is the source of truth; these helpers exist to stop the UI from
 * presenting actions the backend will reject. Keep mutation `onError` toasts
 * in place in case the policy drifts.
 */

function isPriv(user: StaffResponse | null): boolean {
  if (!user) return false
  return user.role === "admin" || user.role === "owner"
}

/** Anyone authenticated can claim a pending handoff. */
export function canClaimHandoff(user: StaffResponse | null): boolean {
  return !!user
}

/**
 * Resolve a handoff. Support can resolve only handoffs assigned to them;
 * admin/owner can resolve any handoff. Passing `handoff` is what makes the
 * self-vs-other distinction work — call sites that don't have a specific
 * row (e.g. the conversation detail page resolving its own handoff) should
 * always be assigned-to-self, so support can still resolve.
 */
export function canResolveHandoff(
  user: StaffResponse | null,
  handoff: Pick<HumanHandOffResponse, "assigned_staff_id"> | null,
): boolean {
  if (!user) return false
  if (isPriv(user)) return true
  return !!handoff && handoff.assigned_staff_id === user.id
}

/** Same rule as resolve — own-only for support, free-for-all for admin+. */
export function canCancelHandoff(
  user: StaffResponse | null,
  handoff: Pick<HumanHandOffResponse, "assigned_staff_id"> | null,
): boolean {
  return canResolveHandoff(user, handoff)
}

/**
 * Assign a pending handoff to a specific staff member. Workforce-management
 * action — support staff can't reach for it. (They CAN claim, which is the
 * self-assign path.)
 */
export function canAssignHandoff(user: StaffResponse | null): boolean {
  return isPriv(user)
}

/** Same rule as assign — already-assigned handoffs reroute by admin+. */
export function canReassignHandoff(user: StaffResponse | null): boolean {
  return isPriv(user)
}
