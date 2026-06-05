"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardKpis,
  getLowStock,
  getRevenue,
  getTopProducts,
} from "./api/analytics";
import { listConversations } from "./api/conversations";
import { listHandoffs } from "./api/handoffs";
import { listOrders } from "./api/orders";
import type {
  HumanHandOffResponse,
  OrderStatus,
} from "./api/types";

/* ---- Shared keys ---- */
const ORDERS_KEY = ["orders", "list"] as const;
const KPIS_KEY = ["analytics", "dashboard"] as const;

/* ---- KPIs ---- */
export interface DashboardStats {
  ordersToday: number;
  revenueMonth: number;
  activeChats: number;
  pendingHandoffs: number;
}

/**
 * KPI source migrated from client-side orders aggregation to the dedicated
 * `/analytics/dashboard` endpoint. Three changes:
 *   1) `ordersToday` + `revenueMonth` come from the server now — no more
 *      iterating the full orders list to count today's rows.
 *   2) `pendingHandoffs` is finally a real number, sourced from a shared
 *      pending-handoffs query (same cache key as RailHandoffQueue, so the
 *      two consumers share one fetch).
 *   3) `activeChats` still uses the conversations list — analytics doesn't
 *      surface a live-chats count.
 */
export function useDashboardStats() {
  const kpis = useQuery({
    queryKey: KPIS_KEY,
    queryFn: getDashboardKpis,
    staleTime: 60_000,
  });

  const conversations = useQuery({
    queryKey: ["conversations", "all"],
    queryFn: listConversations,
    staleTime: 30_000,
  });

  // Shared cache key with RailHandoffQueue — single fetch even when both
  // are mounted at the same time on the dashboard.
  const pendingHandoffs = useQuery({
    queryKey: ["handoffs", "list", { status: "pending" }],
    queryFn: () => listHandoffs({ status: "pending" }),
    staleTime: 30_000,
  });

  const stats: DashboardStats = {
    ordersToday: kpis.data?.orders_today ?? 0,
    revenueMonth: kpis.data?.revenue_this_month ?? 0,
    activeChats:
      conversations.data?.filter((c) => c.status === "active").length ?? 0,
    // Backend may not honor `?status=pending` yet; client-filter as a safety
    // net (matches the rail's defense-in-depth approach).
    pendingHandoffs: (pendingHandoffs.data ?? []).filter(
      (h) => h.status === "pending",
    ).length,
  };

  return {
    stats,
    /** Full KPI payload — surface new fields (new_customers_*, totals,
     *  revenue_today, etc.) when widgets want them. */
    kpis: kpis.data ?? null,
    isLoading:
      kpis.isLoading || conversations.isLoading || pendingHandoffs.isLoading,
    isError: kpis.isError || conversations.isError || pendingHandoffs.isError,
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

/* ---- Revenue trend (last N days) ---- */
export interface TrendPoint { date: string; amount: number; }

/**
 * Day-bucketed revenue trend. Server now buckets — request `period=day`
 * over a [start_date, end_date] window. Previously we fetched every order
 * and bucketed client-side; the new flow scales to large catalogs.
 *
 * One gotcha: the server returns ONLY days that had revenue. The previous
 * client-side version produced a full N-day series with zero buckets, which
 * the AreaChart needs to render a continuous x-axis. We rebuild that here
 * by walking N days and pulling each day's amount from the response (zero
 * when absent).
 */
export function useRevenueTrend(days = 30) {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["analytics", "revenue", { period: "day", startStr, endStr }],
    queryFn: () =>
      getRevenue({ period: "day", start_date: startStr, end_date: endStr }),
    staleTime: 60_000,
    select: (resp): TrendPoint[] => {
      // Map server points by their period field — keys vary by backend
      // ("2026-06-05", "2026-06-05T00:00:00Z", etc.). Use the leading
      // YYYY-MM-DD slice as a normalized key.
      const byDate = new Map<string, number>();
      for (const p of resp.items) {
        const key = p.period.slice(0, 10);
        byDate.set(key, (byDate.get(key) ?? 0) + p.revenue);
      }

      const out: TrendPoint[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        out.push({ date: key, amount: byDate.get(key) ?? 0 });
      }
      return out;
    },
  });
}

/* ---- Top products ---- */
export interface DashboardTopProduct {
  product_id: string;
  name: string;
  units: number;
  revenue: number;
  pct: number; // 0..1 relative to the top seller
}

/**
 * Server-aggregated now. Was an N+1 fetch (orders list + items per order);
 * single call replaces it. Same consumer shape so the widget doesn't change.
 */
export function useTopProducts({ limit = 5 }: { limit?: number } = {}) {
  return useQuery({
    queryKey: ["analytics", "top-products", { limit }],
    queryFn: () => getTopProducts({ limit }),
    staleTime: 5 * 60_000,
    select: (items): DashboardTopProduct[] => {
      const top = items[0]?.total_quantity ?? 1;
      return items.map((p) => ({
        product_id: p.product_id,
        name: p.product_name,
        units: p.total_quantity,
        revenue: p.total_revenue,
        pct: top > 0 ? p.total_quantity / top : 0,
      }));
    },
  });
}

/* ---- Low stock ---- */
/**
 * Consumer-facing shape for a low-stock row. Now backed by the real
 * `/analytics/inventory/low-stock` endpoint; the prior stub returned [].
 */
export interface LowStockItem {
  /** Stable id — variant id if variants exist, else product id. */
  id: string;
  product_name: string;
  /** e.g. "size M", "one size". Server-side endpoint doesn't return
   *  variant labels yet — left undefined until it does. */
  variant_label?: string;
  quantity: number;
  threshold: number;
}

export function useLowStock() {
  return useQuery({
    queryKey: ["analytics", "low-stock"],
    queryFn: getLowStock,
    staleTime: 2 * 60_000,
    select: (resp): LowStockItem[] =>
      resp.items.map((i) => ({
        id: i.inventory_id,
        product_name: i.product_name,
        quantity: i.quantity_available,
        threshold: i.low_stock_threshold,
      })),
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
