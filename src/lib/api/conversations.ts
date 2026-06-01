import { api } from "./client";
import type { ConversationResponse } from "./types";

/**
 * GET /conversations/ accepts NO query params per the spec — no pagination,
 * no status filter, no customer filter. Callers that need filtering do it
 * client-side over the full list.
 */
export function listConversations(): Promise<ConversationResponse[]> {
  return api<ConversationResponse[]>(`/conversations/`);
}

export function getConversation(id: string): Promise<ConversationResponse> {
  return api<ConversationResponse>(`/conversations/${id}`);
}

// ---------- per-conversation handoff actions ----------
// Confirmed in the conversations spec (separate from /handoffs/* endpoints,
// which act on the handoff record itself).

export function startHandoff(conversationId: string, reason?: string) {
  return api<ConversationResponse>(`/conversations/${conversationId}/handoff/start`, {
    method: "PUT",
    body: reason ? { reason } : {},
  });
}

export function assignHandoff(conversationId: string, staffId: string) {
  return api<ConversationResponse>(`/conversations/${conversationId}/handoff/assign`, {
    method: "PUT",
    body: { staff_id: staffId },
  });
}

export function resumeAi(conversationId: string) {
  return api<ConversationResponse>(`/conversations/${conversationId}/handoff/resume`, {
    method: "PUT",
  });
}

// ---------- messages (UNVERIFIED) ----------
// No /messages endpoints are visible in the conversations spec we've seen.
// listMessages and markMessageStatus are removed pending an audit of the
// real messages endpoint surface. When the spec lands, restore them in a
// dedicated `src/lib/api/messages.ts` (and the MessageResponse type with the
// real field shape — current MessageResponse in types.ts is also unverified).
