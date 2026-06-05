import { api, qs } from "./client"
import type { HandoffStatus, HumanHandOffResponse } from "./types"

export interface ListHandoffsParams {
  /** Filter to a single status. Omit to fetch all. */
  status?: HandoffStatus
}

/**
 * List handoffs, optionally filtered by status. The rail uses
 * `{status: "pending"}` for the queue panel; the main handoffs page calls
 * with no params and gets everything.
 */
export function listHandoffs(
  params: ListHandoffsParams = {},
): Promise<HumanHandOffResponse[]> {
  return api<HumanHandOffResponse[]>(`/handoffs/${qs(params)}`)
}

export function getHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/${id}`)
}

/**
 * Claim the next pending handoff. No id needed — backend picks the oldest
 * pending one and assigns it to the calling staff member. Returns the claimed
 * handoff with its conversation and staff populated.
 */
export function claimNextHandoff(): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/claim`, { method: "POST" })
}

/**
 * Mark a handoff as resolved. Status passed as query param (not body —
 * matches the handoffs spec, different from orders which uses body).
 */
export function resolveHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(
    `/handoffs/${id}/status${qs({ new_status: "resolved" })}`,
    { method: "PATCH" },
  )
}

/** Cancel a handoff. No body. PATCH, not PUT. */
export function cancelHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/${id}/cancel`, { method: "PATCH" })
}

/**
 * Assign a handoff to a specific staff member. staff_id is a query param.
 * Note: server uses POST (not PATCH) for this action.
 */
export function assignHandoff(
  id: string,
  staffId: string,
): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(
    `/handoffs/${id}/assign${qs({ staff_id: staffId })}`,
    { method: "POST" },
  )
}

/** Quick string status check for a conversation — cheap to poll. */
export function checkConversationHandoffStatus(
  conversationId: string,
): Promise<string> {
  return api<string>(`/handoffs/check/${conversationId}`)
}
