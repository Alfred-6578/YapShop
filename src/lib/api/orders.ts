import { api } from "./client";
import type {
  OrderItemResponse,
  OrderResponse,
  OrderStatus,
  RawOrderItemResponse,
  RawOrderResponse,
} from "./types";

/**
 * Parse the API's stringified decimal into a JS number.
 * Handles "+0000123.45", "-007.5", "0000123" — parseFloat strips the leading
 * zeros and the sign automatically. Falls back to 0 on null/undefined/garbage
 * so an aggregation never NaN's silently on one bad row.
 */
function parseAmount(raw: string | null | undefined): number {
  if (raw == null) return 0;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * The boundary: the ONE place RawOrderResponse becomes OrderResponse.
 * If you ever need a new derived field (e.g. parsed dates), add it here.
 */
function normalizeOrder(raw: RawOrderResponse): OrderResponse {
  return {
    ...raw,
    total_amount: parseAmount(raw.total_amount),
  };
}

export async function listOrders(): Promise<OrderResponse[]> {
  const raw = await api<RawOrderResponse[]>(`/orders/`);
  return raw.map(normalizeOrder);
}

/** Server-side filter to a single customer — preferred over listing all
 *  orders and filtering client-side once order volume grows. */
export async function listOrdersByCustomer(
  customerId: string,
): Promise<OrderResponse[]> {
  const raw = await api<RawOrderResponse[]>(`/orders/customer/${customerId}`);
  return raw.map(normalizeOrder);
}

export async function getOrder(id: string): Promise<OrderResponse> {
  const raw = await api<RawOrderResponse>(`/orders/${id}`);
  return normalizeOrder(raw);
}

/**
 * Move the order along its forward lifecycle. Use cancelOrder for cancellation
 * — the Exclude here prevents accidentally passing 'cancelled' through this
 * endpoint, which would 422 (the server reserves cancellation for the
 * dedicated endpoint that may trigger refunds / inventory restock).
 */
export async function updateOrderStatus(
  id: string,
  status: Exclude<OrderStatus, "cancelled">,
): Promise<OrderResponse> {
  const raw = await api<RawOrderResponse>(`/orders/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return normalizeOrder(raw);
}

/**
 * Cancel the order. Separate endpoint because cancellation may trigger
 * backend side effects (refunds, inventory restock, customer notification).
 */
export async function cancelOrder(id: string): Promise<OrderResponse> {
  const raw = await api<RawOrderResponse>(`/orders/${id}/cancel`, {
    method: "PATCH",
  });
  return normalizeOrder(raw);
}

/** Same boundary pattern as orders: parse money strings into numbers once. */
function normalizeOrderItem(raw: RawOrderItemResponse): OrderItemResponse {
  return {
    ...raw,
    unit_price: parseAmount(raw.unit_price),
    subtotal: parseAmount(raw.subtotal),
  };
}

export async function listOrderItems(orderId: string): Promise<OrderItemResponse[]> {
  const raw = await api<RawOrderItemResponse[]>(`/orders/${orderId}/items`);
  return raw.map(normalizeOrderItem);
}
