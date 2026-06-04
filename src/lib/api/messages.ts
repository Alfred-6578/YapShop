import { api } from "./client"
import type {
  MessageDirection,
  MessageResponse,
  MessageStatus,
  MessageType,
  SenderType,
} from "./types"

export interface SendMessagePayload {
  conversation_id: string
  sender_type: SenderType
  staff_id?: string | null
  direction: MessageDirection
  message_type: MessageType
  content: string
  media_urls?: string[]
  status?: MessageStatus
}

export function sendMessage(
  payload: SendMessagePayload,
): Promise<MessageResponse> {
  return api<MessageResponse>(`/messages/`, {
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
