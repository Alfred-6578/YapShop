import type { SettingType } from "./serialize"

export interface SettingDef {
  key: string
  type: SettingType
  label: string
  description?: string
  hint?: string
  default: unknown
  // For type='select' only
  options?: { value: string; label: string }[]
  // For type='number' only
  unit?: string
  min?: number
  max?: number
}

/**
 * `icon` is a slot name resolved to a React component inside SettingsCard.
 * Keeping the registry as plain data (no JSX) means it can stay a .ts file
 * and be imported from anywhere without dragging React in.
 */
export type IconSlot = "building-store" | "robot" | "truck" | "bell"
export type IconTone = "malachite" | "blue" | "amber" | "purple"

export interface SettingGroup {
  id: string
  title: string
  description: string
  icon: IconSlot
  iconTone: IconTone
  settings: SettingDef[]
}

export const SETTINGS_REGISTRY: SettingGroup[] = [
  {
    id: "store_identity",
    title: "Store identity",
    description: "How your store presents itself to customers on WhatsApp.",
    icon: "building-store",
    iconTone: "malachite",
    settings: [
      {
        key: "store_name",
        type: "text",
        label: "Store name",
        hint: "Used in the AI introduction and order confirmations.",
        default: "",
      },
      {
        key: "currency",
        type: "select",
        label: "Currency",
        default: "NGN",
        options: [
          { value: "NGN", label: "NGN — Nigerian Naira" },
          { value: "GHS", label: "GHS — Ghanaian Cedi" },
          { value: "USD", label: "USD — US Dollar" },
        ],
      },
      {
        key: "timezone",
        type: "select",
        label: "Time zone",
        default: "Africa/Lagos",
        options: [
          { value: "Africa/Lagos", label: "Africa/Lagos (WAT)" },
          { value: "Africa/Accra", label: "Africa/Accra (GMT)" },
          { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
        ],
      },
    ],
  },
  {
    id: "ai_assistant",
    title: "AI assistant",
    description:
      "How your AI talks to customers and when it asks for human help.",
    icon: "robot",
    iconTone: "blue",
    settings: [
      {
        key: "ai_welcome_message",
        type: "textarea",
        label: "Welcome message",
        hint: "First message customers receive when they DM your WhatsApp.",
        default:
          "Hi! 👋 Welcome. I can help you browse our products, check prices, and place an order. What are you looking for today?",
      },
      {
        key: "auto_handoff_threshold",
        type: "number",
        label: "Auto-handoff to staff after",
        hint: "Number of unanswered questions before the AI escalates to a human.",
        default: 2,
        unit: "questions",
        min: 1,
        max: 10,
      },
      {
        key: "resume_ai_after_handoff",
        type: "boolean",
        label: "Resume AI after handoff resolved",
        hint: "Customer messages after resolution route back through the AI.",
        default: true,
      },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    description: "Order defaults and inventory thresholds.",
    icon: "truck",
    iconTone: "amber",
    settings: [
      {
        key: "default_delivery_method",
        type: "select",
        label: "Default delivery method",
        default: "delivery",
        options: [
          { value: "delivery", label: "Delivery" },
          { value: "pickup", label: "Pickup" },
        ],
      },
      {
        key: "low_stock_threshold",
        type: "number",
        label: "Low stock threshold",
        hint: "Get alerted when product inventory falls below this number.",
        default: 5,
        unit: "units",
        min: 0,
        max: 1000,
      },
      {
        key: "auto_confirm_orders",
        type: "boolean",
        label: "Auto-confirm orders on payment",
        hint: "Orders move from pending to paid automatically when payment is verified.",
        default: false,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "When and how your team gets alerted.",
    icon: "bell",
    iconTone: "purple",
    settings: [
      {
        key: "notify_new_handoff",
        type: "boolean",
        label: "Notify on new handoff",
        hint: "All admins and support staff get a push notification.",
        default: true,
      },
      {
        key: "daily_summary_enabled",
        type: "boolean",
        label: "Daily summary",
        hint: "Email digest of orders, conversations, and revenue every 8pm.",
        default: true,
      },
      {
        key: "sound_alerts_enabled",
        type: "boolean",
        label: "Sound alerts",
        hint: "Play a notification chime for new handoffs.",
        default: false,
      },
    ],
  },
]

/** Flatten registry to a `Map<key, SettingDef>` for quick lookup. */
export const REGISTRY_BY_KEY = new Map<string, SettingDef>(
  SETTINGS_REGISTRY.flatMap((g) => g.settings.map((s) => [s.key, s])),
)
