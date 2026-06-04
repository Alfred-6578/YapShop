import { api } from "./client"
import type { StaffResponse } from "./types"

/**
 * Audit-confirmed roles. `(string & {})` keeps autocomplete on the known
 * values while letting any future server-side role parse without a type
 * error. Mirror any changes in `StaffResponse.role` (in ./types).
 */
export type StaffRole = "support" | "admin" | "owner" | (string & {})

export interface CreateStaffPayload {
  name: string
  email: string
  phone_number?: string | null
  whatsapp_number?: string | null
  role: StaffRole
  password: string
  is_active?: boolean
}

export interface UpdateStaffPayload {
  name: string
  email: string
  phone_number?: string | null
  whatsapp_number?: string | null
  role: StaffRole
  is_active: boolean
  // NOTE: no password field — password changes go through changeStaffPassword
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export function listStaff(): Promise<StaffResponse[]> {
  return api<StaffResponse[]>(`/staff/`)
}

export function getStaff(id: string): Promise<StaffResponse> {
  return api<StaffResponse>(`/staff/${id}`)
}

/**
 * Get the current authenticated staff member. Used wherever we need "is this
 * the current user?" — reply input lock rule, claim self, activity
 * attribution. Same endpoint also re-exported from auth.ts for backwards
 * compatibility; prefer this one for new callers.
 */
export function getCurrentStaff(): Promise<StaffResponse> {
  return api<StaffResponse>(`/staff/me`)
}

export async function createStaff(
  payload: CreateStaffPayload,
): Promise<StaffResponse> {
  return api<StaffResponse>("/staff/", {
    method: "POST",
    body: payload,
  })
}

export async function updateStaff(
  id: string,
  payload: UpdateStaffPayload,
): Promise<StaffResponse> {
  return api<StaffResponse>(`/staff/${id}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteStaff(id: string): Promise<void> {
  await api<void>(`/staff/${id}`, {
    method: "DELETE",
  })
}

export async function changeStaffPassword(
  id: string,
  payload: ChangePasswordPayload,
): Promise<void> {
  await api<void>(`/staff/${id}/password`, {
    method: "PATCH",
    body: payload,
  })
}
