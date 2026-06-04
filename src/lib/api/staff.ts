import { api } from "./client"
import type { StaffResponse } from "./types"

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
