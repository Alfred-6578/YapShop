import { MOCK_HANDOFFS } from "@/lib/handoffs/mockData"

export type StaffRole = "owner" | "admin" | "support"

export interface Staff {
  id: string
  name: string
  email: string
  phone_number?: string
  whatsapp_number?: string
  role: StaffRole
  is_active: boolean
  thumbnail_color: string
  initials: string
  created_at: string
  updated_at: string
}

/** Identifies who's logged in right now. Hardcoded for demo. */
export const CURRENT_USER_ID = "staff-adaeze"

export const MOCK_STAFF: Staff[] = [
  {
    id: "staff-adaeze",
    name: "Adaeze Nwosu",
    email: "adaeze@yapshop.ng",
    phone_number: "+234 803 555 1234",
    whatsapp_number: "+234 803 555 1234",
    role: "owner",
    is_active: true,
    thumbnail_color: "#15C26A",
    initials: "AN",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "staff-tunde",
    name: "Tunde Akinwale",
    email: "tunde@yapshop.ng",
    phone_number: "+234 802 441 9087",
    whatsapp_number: "+234 802 441 9087",
    role: "admin",
    is_active: true,
    thumbnail_color: "#1F4D7A",
    initials: "TA",
    created_at: "2024-02-08T10:00:00Z",
    updated_at: "2024-02-08T10:00:00Z",
  },
  {
    id: "staff-sarah",
    name: "Sarah Okafor",
    email: "sarah@yapshop.ng",
    phone_number: "+234 814 226 3380",
    whatsapp_number: "+234 814 226 3380",
    role: "support",
    is_active: true,
    thumbnail_color: "#7C2D5E",
    initials: "SO",
    created_at: "2024-05-22T10:00:00Z",
    updated_at: "2024-05-22T10:00:00Z",
  },
  {
    id: "staff-femi",
    name: "Femi Kalejaiye",
    email: "femi@yapshop.ng",
    phone_number: "+234 706 992 0541",
    whatsapp_number: "+234 706 992 0541",
    role: "support",
    is_active: true,
    thumbnail_color: "#5C3B7E",
    initials: "FK",
    created_at: "2024-08-10T10:00:00Z",
    updated_at: "2024-08-10T10:00:00Z",
  },
  {
    id: "staff-kelvin",
    name: "Kelvin Olawale",
    email: "kelvin@yapshop.ng",
    phone_number: "+234 815 778 2204",
    whatsapp_number: "+234 815 778 2204",
    role: "support",
    is_active: false,
    thumbnail_color: "#3A3D44",
    initials: "KO",
    created_at: "2024-03-12T10:00:00Z",
    updated_at: "2025-11-30T10:00:00Z",
  },
]

export function getCurrentUser(): Staff {
  const me = MOCK_STAFF.find((s) => s.id === CURRENT_USER_ID)
  if (!me) throw new Error("Current user not found in mock staff")
  return me
}

/**
 * Counts active handoffs assigned to a staff member.
 * Handoff mock uses first-name strings (e.g. "Adaeze") while staff uses full names ("Adaeze Nwosu").
 * Fuzzy match on either form.
 */
export function getActiveHandoffCount(staff: Staff): number {
  const firstName = staff.name.split(" ")[0]
  return MOCK_HANDOFFS.filter(
    (h) =>
      h.status === "active" &&
      h.assigned_staff_name &&
      (h.assigned_staff_name === staff.name || h.assigned_staff_name === firstName),
  ).length
}

export function canEditRole(viewer: Staff, target: Staff): boolean {
  if (viewer.id === target.id) return false
  if (target.role === "owner") return false
  return viewer.role === "owner" || viewer.role === "admin"
}

export function canToggleActive(viewer: Staff, target: Staff): boolean {
  if (viewer.id === target.id) return false
  if (target.role === "owner") return false
  return viewer.role === "owner" || viewer.role === "admin"
}

export function canDelete(viewer: Staff, target: Staff): boolean {
  if (viewer.id === target.id) return false
  if (target.role === "owner") return false
  return viewer.role === "owner"
}

export function canChangePassword(viewer: Staff, target: Staff): boolean {
  return viewer.id === target.id
}

export function availableRoles(viewer: Staff): StaffRole[] {
  if (viewer.role === "owner" || viewer.role === "admin") {
    return ["admin", "support"]
  }
  return ["support"]
}
