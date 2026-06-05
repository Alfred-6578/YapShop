import { api } from "./client"
import type { MessageResponse } from "./types"

export interface SendStaffMessagePayload {
  text: string
  /**
   * Optional but recommended — lets the backend attribute the message to the
   * sending staff member. Without it, the message still goes out but won't be
   * tied to a specific operator in audit logs.
   */
  staff_id?: string
}

/**
 * Staff replying to a customer from the dashboard. The backend:
 *  1. Saves the message to the DB.
 *  2. Dispatches it to the customer over WhatsApp.
 *  3. Broadcasts a `new_message` WebSocket event to all dashboard clients.
 *
 * Callers must NOT manually append the message to the local cache — wait for
 * the WS event so every open tab stays in sync. The realtime handler in
 * lib/realtime/eventHandlers.ts invalidates `["messages","conversation",id]`
 * on `new_message`, which causes the thread to refetch and render the new
 * row.
 */
export function sendStaffMessage(
  conversationId: string,
  payload: SendStaffMessagePayload,
): Promise<MessageResponse> {
  return api<MessageResponse>(`/conversations/${conversationId}/send`, {
    method: "POST",
    body: payload,
  })
}

/**
 * Full message history for a conversation. No pagination on this endpoint —
 * server returns the entire thread. Fine for typical WhatsApp threads; if
 * long-running conversations start hitting list size limits, ask backend for
 * a paginated endpoint and swap here without touching callers.
 */
export function getMessagesForConversation(
  conversationId: string,
): Promise<MessageResponse[]> {
  return api<MessageResponse[]>(`/messages/conversation/${conversationId}`)
}
