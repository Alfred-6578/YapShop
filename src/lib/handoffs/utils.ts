import type { HumanHandOffResponse } from "@/lib/api/types"

/** Count of pending (unclaimed) handoffs. */
export function countPending(handoffs: HumanHandOffResponse[]): number {
  return handoffs.filter((h) => h.status === "pending").length
}

/** Count of active (assigned, in-progress) handoffs. */
export function countActive(handoffs: HumanHandOffResponse[]): number {
  return handoffs.filter((h) => h.status === "active").length
}

/**
 * Count of handoffs resolved today (since midnight local time). Uses
 * `resolved_at` rather than `updated_at` — `updated_at` can be touched by
 * any field change (assignment, cancel, etc.), but `resolved_at` is set
 * exactly when the resolved transition happens.
 */
export function countResolvedToday(handoffs: HumanHandOffResponse[]): number {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const cutoff = startOfDay.getTime()

  return handoffs.filter((h) => {
    if (h.status !== "resolved") return false
    const stamp = h.resolved_at ?? h.updated_at
    return new Date(stamp).getTime() >= cutoff
  }).length
}

/**
 * Average resolution time across resolved handoffs.
 * Returns null when no resolved handoffs exist. Result in milliseconds.
 * Measures `resolved_at - requested_at` (or `created_at` if `requested_at`
 * is absent) — that's the operator-facing wait the customer experienced.
 */
export function avgResolutionMs(
  handoffs: HumanHandOffResponse[],
): number | null {
  const resolved = handoffs.filter((h) => h.status === "resolved")
  if (resolved.length === 0) return null

  const totalMs = resolved.reduce((sum, h) => {
    const end = h.resolved_at ?? h.updated_at
    const start = h.requested_at ?? h.created_at
    return sum + (new Date(end).getTime() - new Date(start).getTime())
  }, 0)
  return totalMs / resolved.length
}

/** Format ms as "2m", "1h 5m", or "—" when null. */
export function formatDuration(ms: number | null): string {
  if (ms === null) return "—"
  const totalMin = Math.round(ms / 60_000)
  if (totalMin < 1) return "<1m"
  if (totalMin < 60) return `${totalMin}m`
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Wait time bucket for color-coding pending rows.
 * - normal: < 5 min waiting
 * - warning: 5-15 min
 * - urgent: > 15 min
 *
 * Uses `requested_at` (when the customer asked for human help) over
 * `created_at` (DB row insert); they're usually equal, but `requested_at`
 * is the semantically correct anchor for "how long have they been waiting."
 */
export type WaitBucket = "normal" | "warning" | "urgent"

export function getWaitBucket(handoff: HumanHandOffResponse): WaitBucket {
  const stamp = handoff.requested_at ?? handoff.created_at
  const waitMs = Date.now() - new Date(stamp).getTime()
  const minutes = waitMs / 60_000
  if (minutes < 5) return "normal"
  if (minutes < 15) return "warning"
  return "urgent"
}
