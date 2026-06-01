export type HandoffStatusValue = "pending" | "active" | "resolved" | "cancelled"
export type HandoffTrigger = "ai" | "customer" | "staff" | "rule"

export interface Handoff {
  id: string
  conversation_id: string
  triggered_by: HandoffTrigger
  reason: string
  status: HandoffStatusValue
  customer_name: string
  customer_whatsapp: string
  customer_initials: string
  customer_color: string
  assigned_staff_id?: string
  assigned_staff_name?: string
  requested_at: string
  claimed_at?: string
  resolved_at?: string
}

/** Helper to render an ISO date relative to "now" at module load. */
const ago = (amount: number, unit: "m" | "h" | "d"): string => {
  const ms =
    unit === "m" ? amount * 60_000 : unit === "h" ? amount * 3_600_000 : amount * 86_400_000
  return new Date(Date.now() - ms).toISOString()
}

export const MOCK_HANDOFFS: Handoff[] = [
  // -------- PENDING (4) --------
  {
    id: "ho-lola-12m",
    conversation_id: "conv-lola-001",
    triggered_by: "ai",
    reason: "Asking about wholesale prices — outside AI knowledge base",
    status: "pending",
    customer_name: "Lola B.",
    customer_whatsapp: "+234 802 887 4421",
    customer_initials: "LB",
    customer_color: "#1F4D7A",
    requested_at: ago(12, "m"),
  },
  {
    id: "ho-emperor-5m",
    conversation_id: "conv-emperor-001",
    triggered_by: "ai",
    reason: "Customer wants additional product photos that the AI cannot retrieve",
    status: "pending",
    customer_name: "Emperor",
    customer_whatsapp: "+234 803 124 8841",
    customer_initials: "EM",
    customer_color: "#7C2D5E",
    requested_at: ago(5, "m"),
  },
  {
    id: "ho-kingsley-2m",
    conversation_id: "conv-kingsley-001",
    triggered_by: "ai",
    reason: "Wants to check delivery timeline for Port Harcourt",
    status: "pending",
    customer_name: "Kingsley A.",
    customer_whatsapp: "+234 814 552 9087",
    customer_initials: "KA",
    customer_color: "#7A4419",
    requested_at: ago(2, "m"),
  },
  {
    id: "ho-funke-1m",
    conversation_id: "conv-funke-001",
    triggered_by: "customer",
    reason: "Color question on agbada — request from customer",
    status: "pending",
    customer_name: "Funke S.",
    customer_whatsapp: "+234 706 119 7732",
    customer_initials: "FS",
    customer_color: "#2A6E54",
    requested_at: ago(1, "m"),
  },

  // -------- ACTIVE (3) --------
  {
    id: "ho-tunde-active",
    conversation_id: "conv-tunde-001",
    triggered_by: "ai",
    reason: "Customer asked about pay-on-delivery for a large bundle",
    status: "active",
    customer_name: "Tunde B.",
    customer_whatsapp: "+234 814 220 4571",
    customer_initials: "TB",
    customer_color: "#5C3B7E",
    assigned_staff_id: "staff-adaeze",
    assigned_staff_name: "Adaeze",
    requested_at: ago(12, "m"),
    claimed_at: ago(8, "m"),
  },
  {
    id: "ho-bola-active",
    conversation_id: "conv-bola-001",
    triggered_by: "ai",
    reason: "Refund request after order arrived in wrong size",
    status: "active",
    customer_name: "Bola K.",
    customer_whatsapp: "+234 803 992 1145",
    customer_initials: "BK",
    customer_color: "#1F4D7A",
    assigned_staff_id: "staff-sarah",
    assigned_staff_name: "Sarah",
    requested_at: ago(25, "m"),
    claimed_at: ago(20, "m"),
  },
  {
    id: "ho-chuks-active",
    conversation_id: "conv-chuks-001",
    triggered_by: "customer",
    reason: "Bulk order for wedding — needs personal follow-up",
    status: "active",
    customer_name: "Chuks E.",
    customer_whatsapp: "+234 706 887 5521",
    customer_initials: "CE",
    customer_color: "#2A6E54",
    assigned_staff_id: "staff-femi",
    assigned_staff_name: "Femi",
    requested_at: ago(40, "m"),
    claimed_at: ago(33, "m"),
  },

  // -------- RESOLVED TODAY (15) --------
  {
    id: "ho-res-001",
    conversation_id: "conv-res-001",
    triggered_by: "ai",
    reason: "Stock availability check for Ankara Midi Dress in size XL",
    status: "resolved",
    customer_name: "Adaobi Eze",
    customer_whatsapp: "+234 803 211 4456",
    customer_initials: "AE",
    customer_color: "#1F4D7A",
    assigned_staff_id: "staff-adaeze",
    assigned_staff_name: "Adaeze",
    requested_at: ago(50, "m"),
    claimed_at: ago(47, "m"),
    resolved_at: ago(35, "m"),
  },
  {
    id: "ho-res-002",
    conversation_id: "conv-res-002",
    triggered_by: "ai",
    reason: "Customer wanted to change delivery address after payment",
    status: "resolved",
    customer_name: "Yetunde Lawal",
    customer_whatsapp: "+234 802 445 1190",
    customer_initials: "YL",
    customer_color: "#7C2D5E",
    assigned_staff_id: "staff-sarah",
    assigned_staff_name: "Sarah",
    requested_at: ago(90, "m"),
    claimed_at: ago(82, "m"),
    resolved_at: ago(65, "m"),
  },
  {
    id: "ho-res-003",
    conversation_id: "conv-res-003",
    triggered_by: "customer",
    reason: "Requested human escalation for custom tailoring measurements",
    status: "resolved",
    customer_name: "Kunle Ojo",
    customer_whatsapp: "+234 814 552 3387",
    customer_initials: "KO",
    customer_color: "#2A6E54",
    assigned_staff_id: "staff-femi",
    assigned_staff_name: "Femi",
    requested_at: ago(2, "h"),
    claimed_at: new Date(Date.now() - 2 * 3_600_000 + 6 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 2 * 3_600_000 + 22 * 60_000).toISOString(),
  },
  {
    id: "ho-res-004",
    conversation_id: "conv-res-004",
    triggered_by: "ai",
    reason: "Bridal lace question — requested swatches confirmation",
    status: "resolved",
    customer_name: "Halima Aliyu",
    customer_whatsapp: "+234 906 552 3344",
    customer_initials: "HA",
    customer_color: "#5C3B7E",
    assigned_staff_id: "staff-tunde",
    assigned_staff_name: "Tunde",
    requested_at: ago(3, "h"),
    claimed_at: new Date(Date.now() - 3 * 3_600_000 + 4 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 3 * 3_600_000 + 18 * 60_000).toISOString(),
  },
  {
    id: "ho-res-005",
    conversation_id: "conv-res-005",
    triggered_by: "ai",
    reason: "Asked for installment payment option not in catalog",
    status: "resolved",
    customer_name: "Bayo Falade",
    customer_whatsapp: "+234 814 998 1123",
    customer_initials: "BF",
    customer_color: "#7A4419",
    assigned_staff_id: "staff-adaeze",
    assigned_staff_name: "Adaeze",
    requested_at: ago(4, "h"),
    claimed_at: new Date(Date.now() - 4 * 3_600_000 + 9 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 4 * 3_600_000 + 25 * 60_000).toISOString(),
  },
  {
    id: "ho-res-006",
    conversation_id: "conv-res-006",
    triggered_by: "rule",
    reason: "Auto-escalated: high-value cart abandoned > 30m",
    status: "resolved",
    customer_name: "Ifeanyi Obi",
    customer_whatsapp: "+234 803 446 8890",
    customer_initials: "IO",
    customer_color: "#3A3D44",
    assigned_staff_id: "staff-sarah",
    assigned_staff_name: "Sarah",
    requested_at: ago(5, "h"),
    claimed_at: new Date(Date.now() - 5 * 3_600_000 + 7 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 5 * 3_600_000 + 19 * 60_000).toISOString(),
  },
  {
    id: "ho-res-007",
    conversation_id: "conv-res-007",
    triggered_by: "ai",
    reason: "Customer needed clarification on return policy timeline",
    status: "resolved",
    customer_name: "Stella Eke",
    customer_whatsapp: "+234 706 552 3387",
    customer_initials: "SE",
    customer_color: "#1F4D7A",
    assigned_staff_id: "staff-femi",
    assigned_staff_name: "Femi",
    requested_at: ago(6, "h"),
    claimed_at: new Date(Date.now() - 6 * 3_600_000 + 3 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 6 * 3_600_000 + 14 * 60_000).toISOString(),
  },
  {
    id: "ho-res-008",
    conversation_id: "conv-res-008",
    triggered_by: "ai",
    reason: "Asked about kente wrapper sourcing region",
    status: "resolved",
    customer_name: "Tope Akin",
    customer_whatsapp: "+234 815 663 7790",
    customer_initials: "TA",
    customer_color: "#7C2D5E",
    assigned_staff_id: "staff-tunde",
    assigned_staff_name: "Tunde",
    requested_at: ago(7, "h"),
    claimed_at: new Date(Date.now() - 7 * 3_600_000 + 11 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 7 * 3_600_000 + 23 * 60_000).toISOString(),
  },
  {
    id: "ho-res-009",
    conversation_id: "conv-res-009",
    triggered_by: "customer",
    reason: "Wanted to combine two pending orders into one shipment",
    status: "resolved",
    customer_name: "Olumide Smith",
    customer_whatsapp: "+234 803 991 4456",
    customer_initials: "OS",
    customer_color: "#2A6E54",
    assigned_staff_id: "staff-adaeze",
    assigned_staff_name: "Adaeze",
    requested_at: ago(8, "h"),
    claimed_at: new Date(Date.now() - 8 * 3_600_000 + 5 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 8 * 3_600_000 + 17 * 60_000).toISOString(),
  },
  {
    id: "ho-res-010",
    conversation_id: "conv-res-010",
    triggered_by: "ai",
    reason: "Embroidery color choice not in standard options",
    status: "resolved",
    customer_name: "Ngozi Akpan",
    customer_whatsapp: "+234 706 334 6612",
    customer_initials: "NA",
    customer_color: "#5C3B7E",
    assigned_staff_id: "staff-sarah",
    assigned_staff_name: "Sarah",
    requested_at: ago(9, "h"),
    claimed_at: new Date(Date.now() - 9 * 3_600_000 + 8 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 9 * 3_600_000 + 21 * 60_000).toISOString(),
  },
  {
    id: "ho-res-011",
    conversation_id: "conv-res-011",
    triggered_by: "ai",
    reason: "Requested rush shipment for traditional wedding next week",
    status: "resolved",
    customer_name: "Hauwa Ibrahim",
    customer_whatsapp: "+234 902 334 9981",
    customer_initials: "HI",
    customer_color: "#7A4419",
    assigned_staff_id: "staff-femi",
    assigned_staff_name: "Femi",
    requested_at: ago(10, "h"),
    claimed_at: new Date(Date.now() - 10 * 3_600_000 + 12 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 10 * 3_600_000 + 24 * 60_000).toISOString(),
  },
  {
    id: "ho-res-012",
    conversation_id: "conv-res-012",
    triggered_by: "ai",
    reason: "Discount code did not apply at checkout",
    status: "resolved",
    customer_name: "Peter Okeke",
    customer_whatsapp: "+234 706 998 5562",
    customer_initials: "PO",
    customer_color: "#3A3D44",
    assigned_staff_id: "staff-tunde",
    assigned_staff_name: "Tunde",
    requested_at: ago(10, "h"),
    claimed_at: new Date(Date.now() - 10 * 3_600_000 + 2 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 10 * 3_600_000 + 9 * 60_000).toISOString(),
  },
  {
    id: "ho-res-013",
    conversation_id: "conv-res-013",
    triggered_by: "rule",
    reason: "Auto-escalated: VIP customer flagged by CRM",
    status: "resolved",
    customer_name: "Grace Olatunji",
    customer_whatsapp: "+234 906 445 7790",
    customer_initials: "GO",
    customer_color: "#1F4D7A",
    assigned_staff_id: "staff-adaeze",
    assigned_staff_name: "Adaeze",
    requested_at: ago(11, "h"),
    claimed_at: new Date(Date.now() - 11 * 3_600_000 + 6 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 11 * 3_600_000 + 20 * 60_000).toISOString(),
  },
  {
    id: "ho-res-014",
    conversation_id: "conv-res-014",
    triggered_by: "staff",
    reason: "Manual takeover by staff to upsell premium fabric",
    status: "resolved",
    customer_name: "Ahmed Musa",
    customer_whatsapp: "+234 815 998 1145",
    customer_initials: "AM",
    customer_color: "#7C2D5E",
    assigned_staff_id: "staff-sarah",
    assigned_staff_name: "Sarah",
    requested_at: ago(11, "h"),
    claimed_at: new Date(Date.now() - 11 * 3_600_000 + 4 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 11 * 3_600_000 + 16 * 60_000).toISOString(),
  },
  {
    id: "ho-res-015",
    conversation_id: "conv-res-015",
    triggered_by: "customer",
    reason: "Requested to speak with a human about complaint on prior order",
    status: "resolved",
    customer_name: "Esther Adeola",
    customer_whatsapp: "+234 814 778 2210",
    customer_initials: "EA",
    customer_color: "#2A6E54",
    assigned_staff_id: "staff-femi",
    assigned_staff_name: "Femi",
    requested_at: ago(12, "h"),
    claimed_at: new Date(Date.now() - 12 * 3_600_000 + 10 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 12 * 3_600_000 + 22 * 60_000).toISOString(),
  },

  // -------- RESOLVED PRIOR DAYS (3) --------
  {
    id: "ho-res-016",
    conversation_id: "conv-res-016",
    triggered_by: "ai",
    reason: "Wanted to confirm gele wrapping style for bridal party",
    status: "resolved",
    customer_name: "Mary James",
    customer_whatsapp: "+234 815 117 4490",
    customer_initials: "MJ",
    customer_color: "#5C3B7E",
    assigned_staff_id: "staff-adaeze",
    assigned_staff_name: "Adaeze",
    requested_at: new Date(Date.now() - 86_400_000 - 25 * 60_000).toISOString(),
    claimed_at: new Date(Date.now() - 86_400_000 - 18 * 60_000).toISOString(),
    resolved_at: ago(1, "d"),
  },
  {
    id: "ho-res-017",
    conversation_id: "conv-res-017",
    triggered_by: "ai",
    reason: "Question about repeat-order discount on aso ebi bundle",
    status: "resolved",
    customer_name: "David Adebayo",
    customer_whatsapp: "+234 803 663 8870",
    customer_initials: "DA",
    customer_color: "#7A4419",
    assigned_staff_id: "staff-tunde",
    assigned_staff_name: "Tunde",
    requested_at: new Date(Date.now() - 2 * 86_400_000 - 30 * 60_000).toISOString(),
    claimed_at: new Date(Date.now() - 2 * 86_400_000 - 22 * 60_000).toISOString(),
    resolved_at: ago(2, "d"),
  },
  {
    id: "ho-res-018",
    conversation_id: "conv-res-018",
    triggered_by: "customer",
    reason: "Asked to escalate review of damaged delivery package",
    status: "resolved",
    customer_name: "John Bello",
    customer_whatsapp: "+234 803 223 7780",
    customer_initials: "JB",
    customer_color: "#3A3D44",
    assigned_staff_id: "staff-sarah",
    assigned_staff_name: "Sarah",
    requested_at: new Date(Date.now() - 5 * 86_400_000 - 40 * 60_000).toISOString(),
    claimed_at: new Date(Date.now() - 5 * 86_400_000 - 28 * 60_000).toISOString(),
    resolved_at: ago(5, "d"),
  },
]

export function getPending(handoffs: Handoff[]): Handoff[] {
  return handoffs
    .filter((h) => h.status === "pending")
    .sort((a, b) => a.requested_at.localeCompare(b.requested_at))
}

export function getActive(handoffs: Handoff[]): Handoff[] {
  return handoffs
    .filter((h) => h.status === "active")
    .sort((a, b) => (b.claimed_at ?? "").localeCompare(a.claimed_at ?? ""))
}

export function getResolved(handoffs: Handoff[]): Handoff[] {
  return handoffs
    .filter((h) => h.status === "resolved")
    .sort((a, b) => (b.resolved_at ?? "").localeCompare(a.resolved_at ?? ""))
}

export function getResolvedToday(handoffs: Handoff[]): Handoff[] {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return getResolved(handoffs).filter(
    (h) => h.resolved_at && new Date(h.resolved_at) >= startOfToday,
  )
}

/** Average wait (requested_at → claimed_at) in minutes across resolved-today. */
export function averageWaitMinutes(handoffs: Handoff[]): number {
  const today = getResolvedToday(handoffs)
  if (today.length === 0) return 0
  const sum = today.reduce((acc, h) => {
    if (!h.claimed_at) return acc
    return acc + (new Date(h.claimed_at).getTime() - new Date(h.requested_at).getTime()) / 60000
  }, 0)
  return Math.round(sum / today.length)
}
