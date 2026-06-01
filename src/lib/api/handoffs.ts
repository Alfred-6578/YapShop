import { api } from "./client";
import type { HumanHandOffResponse } from "./types";

export function listPendingHandoffs(): Promise<HumanHandOffResponse[]> {
  return api<HumanHandOffResponse[]>(`/handoffs/pending`);
}

export function listActiveHandoffs(): Promise<HumanHandOffResponse[]> {
  return api<HumanHandOffResponse[]>(`/handoffs/active`);
}

export function getHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/${id}`);
}

export function claimHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/${id}/claim`, { method: "PUT" });
}

export function resolveHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/${id}/resolve`, { method: "PUT" });
}

export function cancelHandoff(id: string): Promise<HumanHandOffResponse> {
  return api<HumanHandOffResponse>(`/handoffs/${id}/cancel`, { method: "PUT" });
}

/** Quick string status check for a conversation — cheap to poll. */
export function checkConversationHandoffStatus(conversationId: string): Promise<string> {
  return api<string>(`/handoffs/check/${conversationId}`);
}
