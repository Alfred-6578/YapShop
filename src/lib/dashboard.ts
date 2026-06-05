"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import { listConversations } from "./api/conversations";
import { listHandoffs } from "./api/handoffs";
import { listOrderItems, listOrders } from "./api/orders";
import type {
  HumanHandOffResponse,
  OrderStatus,
} from "./api/types";

/* ---- date helpers ---- */
function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function startOfMonth(): number {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}
function daysAgo(n: number): number {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/** Shared key for every orders-derived hook. One fetch, many selects. */
const ORDERS_KEY = ["orders", "list"] as const;

/* ---- KPIs ---- */
export interface DashboardStats {
  ordersToday: number;
  revenueMonth: number;
  activeChats: number;
  pendingHandoffs: number;
}

export function useDashboardStats() {
  const queries = useQueries({
    queries: [
      { queryKey: ORDERS_KEY, queryFn: listOrders },
      // /conversations takes no filter params — fetch all, filter client-side.
      { queryKey: ["conversations", "all"], queryFn: listConversations },
      // Handoffs query temporarily disabled: /handoffs/pending requires auth,
      // and without a login flow yet any 401 here forces a redirect to /login.
      // Re-enable once login is wired and we have a real token.
    ],
  });
  const [orders, conversations] = queries;

  const today = startOfToday();
  const month = startOfMonth();

  const stats: DashboardStats = {
    ordersToday:
      orders.data?.filter((o) => new Date(o.created_at).getTime() >= today).length ?? 0,
    revenueMonth:
      orders.data
        ?.filter(
          (o) =>
            new Date(o.created_at).getTime() >= month &&
            o.payment_status === "completed",
        )
        .reduce((sum, o) => sum + o.total_amount, 0) ?? 0,
    activeChats:
      conversations.data?.filter((c) => c.status === "active").length ?? 0,
    pendingHandoffs: 0, // see comment above — restore when auth is in place
  };

  return {
    stats,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
}

/* ---- Recent orders ---- */
export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: listOrders,
    select: (orders) =>
      [...orders]
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, limit),
  });
}

/* ---- Order status breakdown (donut) ---- */
export interface StatusSegment {
  key: OrderStatus;
  count: number;
  pct: number;
}
const STATUS_ORDER: OrderStatus[] = ["paid", "pending", "shipped", "delivered", "cancelled"];

export function useOrderStatusBreakdown() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: listOrders,
    select: (orders) => {
      const counts: Record<OrderStatus, number> = {
        pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0,
      };
      for (const o of orders) counts[o.status]++;
      const total = orders.length;
      return {
        total,
        segments: STATUS_ORDER.map((key) => ({
          key,
          count: counts[key],
          pct: total > 0 ? counts[key] / total : 0,
        })) as StatusSegment[],
      };
    },
  });
}

/* ---- Revenue trend (last N days, bucketed by day) ---- */
export interface TrendPoint { date: string; amount: number; }

export function useRevenueTrend(days = 30) {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: listOrders,
    select: (orders): TrendPoint[] => {
      const since = daysAgo(days);
      const buckets = new Map<string, number>();
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        buckets.set(dayKey(d.toISOString()), 0);
      }
      for (const o of orders) {
        if (o.payment_status !== "completed") continue;
        if (new Date(o.created_at).getTime() < since) continue;
        const k = dayKey(o.created_at);
        if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + o.total_amount);
      }
      return Array.from(buckets, ([date, amount]) => ({ date, amount }));
    },
  });
}

/* ---- Top products ---- */
export interface TopProduct {
  product_id: string;
  name: string;
  units: number;
  revenue: number;
  pct: number; // 0..1 relative to the top seller
}

/**
 * Top-selling products by units over all available orders.
 *
 * EXPENSIVE: this is an N+1 fetch (one orders list + one items call per
 * order). Fine for demo volume; for production, ask the backend for a
 * /stats/top-products endpoint and replace this hook body. The signature
 * (and the widget that consumes it) does not change.
 */
export function useTopProducts({ limit = 5 }: { limit?: number } = {}) {
  return useQuery({
    queryKey: ["top-products", limit],
    queryFn: async (): Promise<TopProduct[]> => {
      const orders = await listOrders();

      // Fan out item fetches in parallel. Catch per-order so a single
      // failed items call doesn't nuke the whole aggregation — that one
      // order's items just don't get counted.
      const itemsLists = await Promise.all(
        orders.map((o) => listOrderItems(o.id).catch(() => [])),
      );

      const agg = new Map<string, { name: string; units: number; revenue: number }>();
      for (const items of itemsLists) {
        for (const it of items) {
          const cur = agg.get(it.product_id) ?? {
            name: it.product_name,
            units: 0,
            revenue: 0,
          };
          cur.units += it.quantity;
          cur.revenue += it.subtotal;
          agg.set(it.product_id, cur);
        }
      }

      const rows = Array.from(agg, ([product_id, v]) => ({ product_id, ...v }))
        .sort((a, b) => b.units - a.units)
        .slice(0, limit);

      const top = rows[0]?.units ?? 1;
      return rows.map((r) => ({ ...r, pct: r.units / top }));
    },
    staleTime: 5 * 60_000, // expensive — let it sit 5min before refetching
  });
}

/* ---- Low stock ---- */
/**
 * Consumer-facing shape for a low-stock row. Endpoint-independent on purpose:
 * when we discover where variants/inventory live, the new service normalizes
 * into this shape and neither this hook nor the widget changes.
 */
export interface LowStockItem {
  /** Stable id — variant id if variants exist, else product id. */
  id: string;
  product_name: string;
  /** e.g. "size M", "one size". Omit for products without variants. */
  variant_label?: string;
  quantity: number;
  threshold: number;
}

/**
 * Low-stock inventory.
 *
 * BLOCKED: no inventory endpoint visible in the spec. The products response
 * doesn't carry variant/quantity data, so there's nothing to derive on the
 * frontend. Stubbed to [] so LowStockCard renders its empty state cleanly.
 *
 * TODO(backend): where do variants and inventory live? Either of these works:
 *   1) /api/v1/inventory/low-stock → returns the rows directly
 *   2) /api/v1/variants/ with inventory_quantity + low_stock_threshold on each
 *      → frontend filters client-side
 * Frontend needs: { id, product_name, variant_label?, quantity, threshold }[]
 */
export function useLowStock() {
  return useQuery({
    queryKey: ["inventory", "low-stock", "placeholder"],
    queryFn: async (): Promise<LowStockItem[]> => [],
  });
}

/* ---- Handoff queue ---- */
export interface HandoffQueueItem extends HumanHandOffResponse {
  wait_seconds: number;
}
export function useHandoffQueue() {
  return useQuery({
    queryKey: ["handoffs", "list", { status: "pending" }],
    queryFn: () => listHandoffs({ status: "pending" }),
    refetchInterval: 15_000,
    select: (data): HandoffQueueItem[] => {
      // Defensive: backend may return array OR wrapper. Verify and tighten later.
      const items: HumanHandOffResponse[] = Array.isArray(data)
        ? data
        : ((data as { items?: HumanHandOffResponse[] } | undefined)?.items ?? []);
      const now = Date.now();
      return items
        .map((h) => ({
          ...h,
          wait_seconds: Math.max(0, Math.floor((now - new Date(h.requested_at).getTime()) / 1000)),
        }))
        .sort((a, b) => b.wait_seconds - a.wait_seconds);
    },
  });
}

/* ---- Activity feed (synthesized from orders) ---- */
export interface ActivityEvent {
  id: string;
  kind: "order" | "payment";
  text: string;
  at: string;
}
export function useActivityFeed(limit = 6) {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: listOrders,
    select: (orders): ActivityEvent[] =>
      [...orders]
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .slice(0, limit)
        .map((o) => ({
          id: o.id,
          kind: o.payment_status === "completed" ? "payment" : "order",
          text:
            o.payment_status === "completed"
              ? `Payment received — ${fmtNaira(o.total_amount)}`
              : `New order ${o.order_number}`,
          at: o.created_at,
        })),
  });
}

function fmtNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}
