import type { StaffResponse } from "@/lib/api/types"

/**
 * Settings affect every customer interaction (welcome message, handoff
 * threshold, etc.) — admin+ can edit operational settings, but a small set
 * is owner-only because they have business-wide implications:
 *
 *  - `currency`: changes the unit on every order/report.
 *  - `timezone`: shifts every timestamp on every audit log.
 *  - `auto_handoff_threshold`: defines when AI hands off — escalation policy.
 *
 * Add to OWNER_ONLY_KEYS as new high-stakes settings land in the registry.
 */

const OWNER_ONLY_KEYS = new Set<string>([
  "currency",
  "timezone",
  "auto_handoff_threshold",
])

function isPriv(user: StaffResponse | null): boolean {
  if (!user) return false
  return user.role === "admin" || user.role === "owner"
}

/** Quick "can this user see the Save button at all?" — admin+ true. */
export function canEditSettings(user: StaffResponse | null): boolean {
  return isPriv(user)
}

/** Per-key gate — also covers the owner-only sub-policy. */
export function canEditSettingKey(
  user: StaffResponse | null,
  key: string,
): boolean {
  if (!user) return false
  if (OWNER_ONLY_KEYS.has(key)) return user.role === "owner"
  return isPriv(user)
}
