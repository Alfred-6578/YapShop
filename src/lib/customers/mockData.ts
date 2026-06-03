import { MOCK_ORDERS, type Order } from "@/lib/orders/mockData"
import { MOCK_CONVERSATIONS, type Conversation } from "@/lib/conversations/mockData"

export interface Customer {
  id: string
  name: string
  display_name?: string
  whatsapp_number: string
  email?: string | null
  extra_metadata: Record<string, unknown>
  initials: string
  thumbnail_color: string
  created_at: string
  updated_at: string
}

const ago = (amount: number, unit: "m" | "h" | "d" | "w"): string => {
  const ms =
    unit === "m" ? amount * 60_000 :
    unit === "h" ? amount * 3_600_000 :
    unit === "d" ? amount * 86_400_000 :
                   amount * 7 * 86_400_000
  return new Date(Date.now() - ms).toISOString()
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-ifeoma",
    name: "Ifeoma Okonkwo",
    display_name: "Ifeoma O.",
    whatsapp_number: "+234 803 478 1290",
    email: "ifeoma@gmail.com",
    extra_metadata: {
      notes: "Regular wholesale buyer. Orders ankara prints in bulk for resale.",
      tags: ["wholesale", "vip", "ikoyi"],
    },
    initials: "IO",
    thumbnail_color: "#3A6E54",
    created_at: ago(36, "w"),
    updated_at: ago(4, "d"),
  },
  {
    id: "cust-emperor",
    name: "Emperor Eze",
    display_name: "Emperor",
    whatsapp_number: "+234 803 124 8841",
    email: null,
    extra_metadata: {
      notes: "Prefers cash on delivery. Lives close to Yaba — usually picks up if possible. Speaks English and Igbo.",
      tags: ["repeat_customer", "yaba_local"],
      preferred_payment: "cash",
      pickup_preferred: true,
    },
    initials: "EM",
    thumbnail_color: "#7C2D5E",
    created_at: ago(60, "d"),
    updated_at: ago(2, "h"),
  },
  {
    id: "cust-tunde",
    name: "Tunde Bello",
    display_name: "Tunde B.",
    whatsapp_number: "+234 814 220 4571",
    email: "tundeb@yahoo.com",
    extra_metadata: { tags: ["lekki"] },
    initials: "TB",
    thumbnail_color: "#5C3B7E",
    created_at: ago(20, "w"),
    updated_at: ago(1, "h"),
  },
  {
    id: "cust-ada",
    name: "Ada Obi",
    display_name: undefined,
    whatsapp_number: "+234 802 551 0922",
    email: null,
    extra_metadata: {},
    initials: "AO",
    thumbnail_color: "#1F4D7A",
    created_at: ago(12, "w"),
    updated_at: ago(4, "h"),
  },
  {
    id: "cust-chioma",
    name: "Chioma Nwankwo",
    display_name: "Chioma N.",
    whatsapp_number: "+234 706 992 1140",
    email: null,
    extra_metadata: {},
    initials: "CN",
    thumbnail_color: "#7A4419",
    created_at: ago(8, "w"),
    updated_at: ago(3, "h"),
  },
  {
    id: "cust-musa",
    name: "Musa Kano",
    display_name: "Musa K.",
    whatsapp_number: "+234 815 008 3306",
    email: null,
    extra_metadata: { tags: ["first_time"] },
    initials: "MK",
    thumbnail_color: "#3A3D44",
    created_at: ago(4, "w"),
    updated_at: ago(1, "d"),
  },
  {
    id: "cust-lola",
    name: "Lola Bankole",
    display_name: "Lola B.",
    whatsapp_number: "+234 802 887 4421",
    email: "lola.bankole@gmail.com",
    extra_metadata: { tags: ["wholesale"] },
    initials: "LB",
    thumbnail_color: "#1F4D7A",
    created_at: ago(28, "w"),
    updated_at: ago(12, "m"),
  },
  {
    id: "cust-kingsley",
    name: "Kingsley Adamu",
    display_name: "Kingsley A.",
    whatsapp_number: "+234 814 552 9087",
    email: null,
    extra_metadata: { tags: ["ph"] },
    initials: "KA",
    thumbnail_color: "#7A4419",
    created_at: ago(24, "w"),
    updated_at: ago(2, "m"),
  },
  {
    id: "cust-funke",
    name: "Funke Sodiq",
    display_name: "Funke S.",
    whatsapp_number: "+234 706 119 7732",
    email: null,
    extra_metadata: {},
    initials: "FS",
    thumbnail_color: "#2A6E54",
    created_at: ago(3, "w"),
    updated_at: ago(1, "m"),
  },
  {
    id: "cust-amaka",
    name: "Amaka Eze",
    display_name: "Amaka E.",
    whatsapp_number: "+234 803 220 5519",
    email: null,
    extra_metadata: {},
    initials: "AE",
    thumbnail_color: "#7C2D5E",
    created_at: ago(48, "w"),
    updated_at: ago(2, "d"),
  },
  {
    id: "cust-bayo",
    name: "Bayo Adeyemi",
    display_name: undefined,
    whatsapp_number: "+234 806 441 7720",
    email: "bayo.adeyemi@gmail.com",
    extra_metadata: {
      notes: "Buys gift wrapping with every order — confirm before shipping.",
      tags: ["gift_orders"],
    },
    initials: "BA",
    thumbnail_color: "#5C3B7E",
    created_at: ago(40, "w"),
    updated_at: ago(5, "d"),
  },
  {
    id: "cust-ngozi",
    name: "Ngozi Uche",
    display_name: "Ngozi U.",
    whatsapp_number: "+234 815 778 3041",
    email: null,
    extra_metadata: {},
    initials: "NU",
    thumbnail_color: "#1F4D7A",
    created_at: ago(2, "w"),
    updated_at: ago(6, "h"),
  },
  {
    id: "cust-yemi",
    name: "Yemi Ogunleye",
    display_name: undefined,
    whatsapp_number: "+234 802 110 4488",
    email: null,
    extra_metadata: { tags: ["surulere"] },
    initials: "YO",
    thumbnail_color: "#3A6E54",
    created_at: ago(16, "w"),
    updated_at: ago(2, "d"),
  },
  {
    id: "cust-segun",
    name: "Segun Adeleke",
    display_name: "Segun A.",
    whatsapp_number: "+234 803 992 1170",
    email: "segun.adeleke@outlook.com",
    extra_metadata: {},
    initials: "SA",
    thumbnail_color: "#7A4419",
    created_at: ago(32, "w"),
    updated_at: ago(3, "d"),
  },
  {
    id: "cust-zainab",
    name: "Zainab Yusuf",
    display_name: "Zainab Y.",
    whatsapp_number: "+234 814 003 7791",
    email: null,
    extra_metadata: {
      notes: "Prefers WhatsApp voice notes for confirmations.",
      tags: ["abuja"],
    },
    initials: "ZY",
    thumbnail_color: "#7C2D5E",
    created_at: ago(10, "w"),
    updated_at: ago(8, "h"),
  },
  {
    id: "cust-chinedu",
    name: "Chinedu Obiora",
    display_name: undefined,
    whatsapp_number: "+234 706 552 8810",
    email: null,
    extra_metadata: {},
    initials: "CO",
    thumbnail_color: "#3A3D44",
    created_at: ago(6, "w"),
    updated_at: ago(2, "d"),
  },
  {
    id: "cust-blessing",
    name: "Blessing Okafor",
    display_name: "Blessing O.",
    whatsapp_number: "+234 815 661 4402",
    email: null,
    extra_metadata: { tags: ["first_time"] },
    initials: "BO",
    thumbnail_color: "#2A6E54",
    created_at: ago(1, "w"),
    updated_at: ago(20, "h"),
  },
  {
    id: "cust-tobi",
    name: "Tobi Akinwumi",
    display_name: "Tobi A.",
    whatsapp_number: "+234 803 774 2208",
    email: "tobi.akin@gmail.com",
    extra_metadata: {},
    initials: "TA",
    thumbnail_color: "#5C3B7E",
    created_at: ago(22, "w"),
    updated_at: ago(4, "d"),
  },
  {
    id: "cust-halima",
    name: "Halima Sani",
    display_name: undefined,
    whatsapp_number: "+234 806 119 5573",
    email: null,
    extra_metadata: {},
    initials: "HS",
    thumbnail_color: "#1F4D7A",
    created_at: ago(14, "w"),
    updated_at: ago(1, "d"),
  },
  {
    id: "cust-emeka",
    name: "Emeka Iwu",
    display_name: "Emeka I.",
    whatsapp_number: "+234 814 220 9981",
    email: null,
    extra_metadata: {
      notes: "Often asks about restocks — keep him posted on new ankara drops.",
      tags: ["repeat_customer"],
    },
    initials: "EI",
    thumbnail_color: "#7A4419",
    created_at: ago(30, "w"),
    updated_at: ago(6, "d"),
  },
  {
    id: "cust-bisi",
    name: "Bisi Adebayo",
    display_name: "Bisi A.",
    whatsapp_number: "+234 802 447 6628",
    email: null,
    extra_metadata: {},
    initials: "BA",
    thumbnail_color: "#3A6E54",
    created_at: ago(18, "w"),
    updated_at: ago(3, "d"),
  },
  {
    id: "cust-uche",
    name: "Uche Nnamdi",
    display_name: undefined,
    whatsapp_number: "+234 706 884 2210",
    email: "uche.nnamdi@yahoo.com",
    extra_metadata: { tags: ["enugu"] },
    initials: "UN",
    thumbnail_color: "#7C2D5E",
    created_at: ago(26, "w"),
    updated_at: ago(5, "d"),
  },
  {
    id: "cust-temi",
    name: "Temi Olawale",
    display_name: "Temi O.",
    whatsapp_number: "+234 815 339 7702",
    email: null,
    extra_metadata: {},
    initials: "TO",
    thumbnail_color: "#3A3D44",
    created_at: ago(5, "w"),
    updated_at: ago(12, "h"),
  },
  {
    id: "cust-grace",
    name: "Grace Effiong",
    display_name: "Grace E.",
    whatsapp_number: "+234 803 117 5580",
    email: "grace.effiong@gmail.com",
    extra_metadata: {
      notes: "Returns items occasionally — be flexible on exchanges.",
      tags: ["calabar"],
    },
    initials: "GE",
    thumbnail_color: "#2A6E54",
    created_at: ago(44, "w"),
    updated_at: ago(7, "d"),
  },
]

/** Match orders to a customer by whatsapp_number. */
export function getOrdersForCustomer(customer: Customer): Order[] {
  return MOCK_ORDERS.filter((o) => o.customer_whatsapp_number === customer.whatsapp_number)
}

export function getLifetimeValue(customer: Customer): number {
  return getOrdersForCustomer(customer)
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0)
}

export function getOrderCount(customer: Customer): number {
  return getOrdersForCustomer(customer).filter((o) => o.status !== "cancelled").length
}

export function getTotalOrderCount(customer: Customer): number {
  return getOrdersForCustomer(customer).length
}

export function getAverageOrder(customer: Customer): number {
  const count = getOrderCount(customer)
  if (count === 0) return 0
  return Math.round(getLifetimeValue(customer) / count)
}

export function getLastOrder(customer: Customer): Order | null {
  const orders = getOrdersForCustomer(customer)
  if (orders.length === 0) return null
  return [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
}

export function getConversationsForCustomer(customer: Customer): Conversation[] {
  return MOCK_CONVERSATIONS.filter((c) => c.customer_whatsapp === customer.whatsapp_number)
}

export function getLastActivityISO(customer: Customer): string | null {
  const orders = getOrdersForCustomer(customer)
  const convs = getConversationsForCustomer(customer)
  const candidates = [
    ...orders.map((o) => o.created_at),
    ...convs.map((c) => c.last_message_at),
  ]
  if (candidates.length === 0) return null
  return candidates.sort().reverse()[0]
}

export type CustomerActivityTag =
  | { kind: "attention"; label: "Needs attention" }
  | { kind: "in-chat"; label: "In chat" }
  | { kind: "handled"; label: string }
  | null

export function getCustomerActivityTag(customer: Customer): CustomerActivityTag {
  const convs = getConversationsForCustomer(customer)
  const activeConv = convs.find((c) => c.status === "active")
  if (!activeConv) return null
  if (activeConv.handoff_status === "requested") return { kind: "attention", label: "Needs attention" }
  if (activeConv.handoff_status === "active" && activeConv.assigned_staff_name) {
    return { kind: "handled", label: activeConv.assigned_staff_name }
  }
  return { kind: "in-chat", label: "In chat" }
}

export function getDisplayName(customer: Customer): string {
  return customer.display_name || customer.name
}
