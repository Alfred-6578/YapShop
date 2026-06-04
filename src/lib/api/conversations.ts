import { api, qs } from "./client";
import type {
  ConversationResponse,
  ConversationStatus,
  HandoffStatus,
} from "./types";

// ---------- list/filter ----------

export interface ConversationFilterParams {
  status?: ConversationStatus | string;
  handoff_status?: HandoffStatus | string;
  customer_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

/**
 * Narrow shape returned by /conversations/filter. Subset of the full
 * ConversationResponse with customer name and WhatsApp number denormalized so
 * list rows don't need a second fetch per row to render. Customer fields can
 * be null per the spec — handle the absence at use sites.
 */
export interface ConversationListItem {
  id: string;
  customer_id: string;
  customer_name: string | null;
  customer_whatsapp_number: string | null;
  status: ConversationStatus | string;
  handoff_status: HandoffStatus | string | null;
  ai_enabled: boolean;
  started_at: string;
  ended_at: string | null;
}

export interface ConversationListPage {
  items: ConversationListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export function listConversationsFiltered(
  params: ConversationFilterParams = {},
): Promise<ConversationListPage> {
  return api<ConversationListPage>(`/conversations/filter${qs(params)}`);
}

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

export interface StartHandoffPayload {
  reason: string;
}

export function startHandoff(
  conversationId: string,
  payload: StartHandoffPayload,
): Promise<ConversationResponse> {
  return api<ConversationResponse>(
    `/conversations/${conversationId}/handoff/start`,
    {
      method: "PUT",
      body: payload,
    },
  );
}

/** Rename of the old `assignHandoff` — disambiguates from the handoff-record
 *  assign endpoint in lib/api/handoffs.ts. Both still hit the conversation. */
export function assignHandoffToStaff(
  conversationId: string,
  staffId: string,
): Promise<ConversationResponse> {
  return api<ConversationResponse>(
    `/conversations/${conversationId}/handoff/assign`,
    {
      method: "PUT",
      body: { staff_id: staffId },
    },
  );
}

export function resumeAi(conversationId: string): Promise<ConversationResponse> {
  return api<ConversationResponse>(
    `/conversations/${conversationId}/handoff/resume`,
    { method: "PUT" },
  );
}

// ---------- messages (UNVERIFIED) ----------
// No /messages endpoints are visible in the conversations spec we've seen.
// listMessages and markMessageStatus are removed pending an audit of the
// real messages endpoint surface. When the spec lands, restore them in a
// dedicated `src/lib/api/messages.ts` (and the MessageResponse type with the
// real field shape — current MessageResponse in types.ts is also unverified).
