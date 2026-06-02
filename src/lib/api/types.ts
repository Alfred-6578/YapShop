/**
 * Types mirrored from the YapShop API documentation.
 * Keep this file in sync with the OpenAPI doc — it's the single source of truth
 * for what shape the rest of the frontend expects.
 */

// ---------- enums ----------
export type StaffRole = "admin" | "manager" | "support" | "agent";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "paypal"
  | "bank_transfer"
  | "cash_on_delivery";

/**
 * Conversation type. Only "ai_knowledge_based" confirmed from the spec — more
 * values likely exist. The `(string & {})` widens to any string while keeping
 * autocomplete for the known value; tighten the union as values surface.
 */
export type ConversationType = "ai_knowledge_based" | (string & {});

/**
 * Conversation lifecycle. Confirmed values: "active". "ended" is inferred from
 * the presence of `ended_at` on the response. Widen if more states appear.
 */
export type ConversationStatus = "active" | "ended" | (string & {});

export type HandoffStatus =
  | "none"
  | "pending"
  | "requested"
  | "active"
  | "cancelled"
  | "resolved";
export type HandoffTriggerType = "ai" | "customer" | "staff" | "rule";

export type MessageSenderType = "customer" | "ai" | "staff" | "tool";
export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";

// ---------- pagination ----------
// API list endpoints return bare arrays. Pagination is via skip/limit query
// params; total count is the array length on the page returned.
export interface PageParams {
  skip?: number;
  limit?: number;
}

// ---------- staff ----------
export interface StaffResponse {
  id: string;
  full_name: string;
  username: string;
  email?: string;
  phone_number?: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- auth ----------
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
export interface LoginResponse extends AuthTokens {
  user: StaffResponse;
}

// ---------- products / inventory ----------
export interface MediaResponse {
  url: string;
  type: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string | null;
  parent_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Raw products shape. `price` is a stringified decimal (same as orders).
 * Several fields are nullable — the wire may send `null` rather than omitting
 * the key, so we type them as `?: T | null` to cover both.
 *
 * Note what's absent: no `variants`, no inventory quantity, no low_stock
 * thresholds. Variants/inventory live on an endpoint we haven't seen — every
 * "low stock"–style feature is blocked until that endpoint is mapped.
 */
export interface RawProductResponse {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  sku?: string | null;
  category_id?: string | null;
  /** Wire occasionally sends null instead of an empty array. Normalized to
   *  string[] in ProductResponse. */
  tags: string[] | null;
  is_active: boolean;
  /** Whether customers can place orders for this product. The spec's response
   *  example elides this field but the request body sets it, so it almost
   *  certainly comes back on responses too. Typed optional to be safe. */
  is_live?: boolean;
  tracking_id?: string | null;
  /** Wire occasionally sends null instead of an empty array. Normalized to
   *  MediaResponse[] in ProductResponse. */
  media: MediaResponse[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse extends Omit<RawProductResponse, "price" | "tags" | "media"> {
  price: number;
  tags: string[];
  media: MediaResponse[];
}

// ---------- customers ----------
export interface AddressResponse {
  id: string;
  label?: string;
  state: string;
  city: string;
  line?: string;
  is_default: boolean;
}
export interface CustomerResponse {
  id: string;
  name: string;
  whatsapp_number: string;
  addresses: AddressResponse[];
  created_at: string;
  updated_at: string;
}

// ---------- orders ----------
// NB: amounts come back as strings ("43500.00") from the API. Convert with
// Number(...) at use sites or via toMoney() helper.
/**
 * Raw shape. Note: each item carries a SNAPSHOT of the product (name, sku,
 * description, category, media) — same denormalization pattern as the order's
 * embedded address. Historical orders show what was actually sold at the time,
 * regardless of how the product evolves later.
 */
export interface RawOrderItemResponse {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;

  product_name: string;
  product_sku?: string;
  product_description?: string;
  product_category?: string;
  product_media?: Array<Record<string, unknown>>;
  product_variant_attributes?: Record<string, unknown>;

  quantity: number;
  unit_price: string;
  subtotal: string;
  delivery_status?: string;
}

export interface OrderItemResponse
  extends Omit<RawOrderItemResponse, "unit_price" | "subtotal"> {
  unit_price: number;
  subtotal: number;
}

export interface RawOrderResponse {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_whatsapp_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: string;

  // Embedded shipping address (snapshotted at order time)
  address_label?: string;
  address_full_name?: string;
  address_phone_number?: string;
  address_line?: string;
  address_city?: string;
  address_state?: string;
  address_country?: string;
  address_postal_code?: string;
  address_landmark?: string;

  extra_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * APP shape — what hooks and widgets consume after the service has parsed
 * money strings into numbers. Identical to RawOrderResponse except for
 * total_amount.
 */
export interface OrderResponse extends Omit<RawOrderResponse, "total_amount"> {
  total_amount: number;
}

/** Body shape for PATCH /orders/{id}/address — note flat field names, no `address_` prefix. */
export interface OrderAddressUpdate {
  customer_id?: string;
  label?: string;
  full_name?: string;
  phone_number?: string;
  address_line?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  landmark?: string;
  is_default?: boolean;
}

export interface OrderItemCreate {
  product_id: string;
  variant_id?: string;
  product_name: string;
  product_sku?: string;
  product_description?: string;
  product_category?: string;
  product_media?: Array<Record<string, unknown>>;
  product_variant_attributes?: Record<string, unknown>;
  quantity: number;
  unit_price: number;
  subtotal: number;
  delivery_status?: string;
}

// ---------- payments ----------
export interface PaymentResponse {
  id: string;
  order_id: string;
  payment_reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_url?: string;
  paid_at?: string;
  created_at: string;
}

// ---------- conversations / messages ----------
/**
 * The full conversation shape. All datetimes are ISO strings — no parsing at
 * the boundary because no aggregation needs them as Date objects; widgets
 * parse on display.
 */
export interface ConversationResponse {
  id: string;
  customer_id: string;
  status: ConversationStatus;
  conversation_type: ConversationType;

  ai_enabled: boolean;
  handoff_to_human: boolean;
  handoff_status: HandoffStatus;
  handoff_reason?: string | null;
  handoff_started_at?: string | null;
  handoff_ended_at?: string | null;
  assigned_staff_id?: string | null;

  started_at: string;
  ended_at?: string | null;
}
export interface MessageResponse {
  id: string;
  conversation_id: string;
  sender_type: MessageSenderType;
  direction: MessageDirection;
  message_type: string;
  content: string;
  status: MessageStatus;
  created_at: string;
}

// ---------- handoffs ----------
export interface HumanHandOffResponse {
  id: string;
  conversation_id: string;
  status: HandoffStatus;
  triggered_by: HandoffTriggerType;
  reason?: string;
  requested_at: string;
  claimed_at?: string;
  resolved_at?: string;
  assigned_staff_id?: string;
  customer_name?: string;
  customer_whatsapp_number?: string;
}
