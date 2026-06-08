/**
 * Types mirrored from the YapShop API documentation.
 * Keep this file in sync with the OpenAPI doc — it's the single source of truth
 * for what shape the rest of the frontend expects.
 */

// ---------- enums ----------
/**
 * Staff role. Audit-confirmed values are owner/admin/support; widened with
 * `(string & {})` so a future role from the backend doesn't break the type.
 * The canonical definition (and its mutation-service consumers) lives in
 * `./staff` — this re-declaration exists so `StaffResponse.role` doesn't
 * have to take a circular type-import dependency on it.
 */
export type StaffRole = "owner" | "admin" | "support" | (string & {});

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

/**
 * String enums with an escape hatch — known values get autocomplete, unknown
 * ones still parse so a new sender/status from the backend doesn't break the
 * type. `(string & {})` is the idiomatic way to widen a literal union without
 * losing the autocomplete on the known values.
 */
export type SenderType = "customer" | "ai" | "staff" | (string & {});
export type MessageDirection = "inbound" | "outbound" | (string & {});
export type MessageType =
  | "text"
  | "image"
  | "voice"
  | "video"
  | "document"
  | "system"
  | (string & {});
export type MessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | (string & {});

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
  name: string;
  email: string;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- auth ----------
/** Matches the real `TokenResponse` schema from the live OpenAPI doc. */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
export interface LoginResponse extends AuthTokens {
  staff: StaffResponse;
}

// ---------- products / inventory ----------
export interface MediaResponse {
  url: string;
  type: string;
  /** Per-media visibility flag. "Live" media is real vendor-shot content
   *  the AI can share as proof — distinct from stock photos which are
   *  shown but never used as proof. Optional on read because older records
   *  may predate the field; the form treats missing as live. */
  is_live?: boolean;
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

// ---------- product variants ----------
/**
 * Variants are independent SKUs of a product distinguished by free-form
 * `attributes` (e.g. {size: "M", color: "Red"}). Price + inventory live on
 * the variant; the product is just the umbrella. `product_variant_price`
 * arrives as a stringified decimal (same wire pattern as product price).
 */
export interface RawProductVariantResponse {
  id: string;
  product_id: string;
  /** Free-form key-value bag — values are usually strings in practice but
   *  the backend's `Dict[str, Any]` lets numbers/booleans through too. */
  attributes: Record<string, unknown>;
  product_variant_price: string;
  inventory_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariantResponse
  extends Omit<RawProductVariantResponse, "product_variant_price"> {
  product_variant_price: number;
}

// ---------- analytics ----------
/**
 * Every money field on the wire comes as a stringified decimal (same
 * pattern as product price / order total). The analytics service in
 * lib/api/analytics.ts normalizes these to numbers via parseAmount, so
 * downstream callers see clean numeric fields.
 */
export interface RawDashboardKpis {
  orders_today: number;
  pending_orders: number;
  revenue_today: string;
  revenue_this_month: string;
  active_handoffs: number;
  new_customers_today: number;
  new_customers_this_month: number;
  total_customers: number;
  total_products: number;
}
export interface DashboardKpis
  extends Omit<RawDashboardKpis, "revenue_today" | "revenue_this_month"> {
  revenue_today: number;
  revenue_this_month: number;
}

export type RevenuePeriod = "day" | "week" | "month" | "year";

export interface RawRevenuePoint {
  period: string;
  revenue: string;
  order_count: number;
}
export interface RevenuePoint {
  period: string;
  revenue: number;
  order_count: number;
}

export interface RawRevenueResponse {
  items: RawRevenuePoint[];
  total_revenue: string;
  total_orders: number;
}
export interface RevenueResponse {
  items: RevenuePoint[];
  total_revenue: number;
  total_orders: number;
}

export interface RawTopProduct {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: string;
}
export interface TopProduct {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface RawTopCustomer {
  customer_id: string;
  customer_name: string;
  whatsapp_number: string;
  total_orders: number;
  total_spent: string;
}
export interface TopCustomer
  extends Omit<RawTopCustomer, "total_spent"> {
  total_spent: number;
}

export interface ConversionRateResponse {
  total_carts: number;
  total_orders: number;
  /** 0..1 float per spec; widget can multiply by 100 for percentage display. */
  conversion_rate: number;
  period_start: string;
  period_end: string;
}

export interface LowStockItem {
  inventory_id: string;
  product_id: string;
  product_name: string;
  quantity_available: number;
  low_stock_threshold: number;
}
export interface LowStockResponse {
  items: LowStockItem[];
  total_low_stock: number;
  total_out_of_stock: number;
}

export interface RawUnpaidOrder {
  order_id: string;
  order_number: string;
  customer_name: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
}
export interface UnpaidOrder
  extends Omit<RawUnpaidOrder, "total_amount"> {
  total_amount: number;
}
export interface RawReconciliationResponse {
  unpaid_orders: RawUnpaidOrder[];
  total_unpaid: number;
  total_unpaid_amount: string;
  total_paid: number;
  total_paid_amount: string;
}
export interface ReconciliationResponse {
  unpaid_orders: UnpaidOrder[];
  total_unpaid: number;
  total_unpaid_amount: number;
  total_paid: number;
  total_paid_amount: number;
}

export interface StaffPerformanceItem {
  staff_id: string;
  staff_name: string;
  total_handoffs: number;
  resolved_handoffs: number;
  avg_resolution_minutes: number;
}
export interface StaffPerformanceResponse {
  items: StaffPerformanceItem[];
}

export interface RawCustomerBySpend {
  customer_id: string;
  name: string;
  whatsapp_number: string;
  total_orders: number;
  total_spent: string;
  segment: string;
  created_at: string;
}
export interface CustomerBySpend
  extends Omit<RawCustomerBySpend, "total_spent"> {
  total_spent: number;
}
export interface RawCustomersBySpendResponse {
  items: RawCustomerBySpend[];
  total: number;
  page: number;
  page_size: number;
}
export interface CustomersBySpendResponse
  extends Omit<RawCustomersBySpendResponse, "items"> {
  items: CustomerBySpend[];
}

export interface RawRefundResponse {
  order_id: string;
  order_number: string;
  refund_amount: string;
  new_order_status: string;
  new_payment_status: string;
  reason: string;
}
export interface RefundResponse
  extends Omit<RawRefundResponse, "refund_amount"> {
  refund_amount: number;
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
/**
 * Note: only `whatsapp_number`, `id`, `created_at`, `updated_at` are required
 * by the spec. `name` can be null on freshly-created records (the customer is
 * auto-created from a WhatsApp message before any profile is filled in).
 * Addresses are a separate resource (CustomerAddressResponse) — fetch them
 * via the dedicated endpoint when needed.
 */
export interface CustomerResponse {
  id: string;
  name?: string | null;
  whatsapp_number: string;
  email?: string | null;
  display_name?: string | null;
  extra_metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/** Body shape for POST /customers/ and PUT /customers/{id}. */
export interface CustomerWritePayload {
  name?: string | null;
  whatsapp_number: string;
  display_name?: string | null;
  email?: string | null;
  extra_metadata?: Record<string, unknown> | null;
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
export interface RawMessageResponse {
  id: string;
  conversation_id: string;
  sender_type?: SenderType | null;
  staff_id?: string | null;
  direction: MessageDirection;
  message_type: MessageType;
  content?: string | null;
  media_urls?: string[] | null;
  status?: MessageStatus | null;
  whatsapp_message_id?: string | null;
  created_at: string;
  updated_at: string;
}

// No money/decimal fields to coerce — wire shape is app shape.
export type MessageResponse = RawMessageResponse;

// ---------- handoffs ----------
/**
 * Lightweight nested conversation on handoff list responses. The formal
 * OpenAPI schema only lists id/status/ai_enabled/handoff_status, but the live
 * server denormalizes customer name + whatsapp here so the handoff queue can
 * render a row without a second fetch. Kept optional in case the doc is
 * eventually right and the customer fields go away.
 */
export interface ConversationSummary {
  id: string;
  status: ConversationStatus;
  ai_enabled: boolean;
  handoff_status?: HandoffStatus | null;
  customer_name?: string | null;
  customer_display_name?: string | null;
  customer_whatsapp_number?: string | null;
}

export interface StaffSummary {
  id: string;
  name: string;
  email?: string | null;
  role?: StaffRole | null;
}

export interface HumanHandOffResponse {
  id: string;
  conversation_id: string;
  status: HandoffStatus;
  triggered_by: HandoffTriggerType;
  reason?: string | null;
  requested_at: string;
  claimed_at?: string | null;
  resolved_at?: string | null;
  assigned_staff_id?: string | null;
  created_at: string;
  updated_at: string;
  /** Nested for the handoff list — saves a round-trip to render the row. */
  conversation?: ConversationSummary | null;
  staff?: StaffSummary | null;
}
