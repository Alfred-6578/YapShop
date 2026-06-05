import { api, qs } from "./client"
import type {
  ConversionRateResponse,
  CustomersBySpendResponse,
  DashboardKpis,
  LowStockResponse,
  RawCustomersBySpendResponse,
  RawDashboardKpis,
  RawReconciliationResponse,
  RawRefundResponse,
  RawRevenueResponse,
  RawTopCustomer,
  RawTopProduct,
  ReconciliationResponse,
  RefundResponse,
  RevenuePeriod,
  RevenueResponse,
  StaffPerformanceResponse,
  TopCustomer,
  TopProduct,
} from "./types"

function parseAmount(raw: string | number | null | undefined): number {
  if (raw == null) return 0
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : 0
}

// ---------- KPIs ----------

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const raw = await api<RawDashboardKpis>(`/analytics/dashboard`)
  return {
    ...raw,
    revenue_today: parseAmount(raw.revenue_today),
    revenue_this_month: parseAmount(raw.revenue_this_month),
  }
}

// ---------- Revenue ----------

export interface RevenueParams {
  period?: RevenuePeriod
  start_date?: string
  end_date?: string
}

export async function getRevenue(
  params: RevenueParams = {},
): Promise<RevenueResponse> {
  const raw = await api<RawRevenueResponse>(`/analytics/revenue${qs(params)}`)
  return {
    items: raw.items.map((i) => ({
      period: i.period,
      revenue: parseAmount(i.revenue),
      order_count: i.order_count,
    })),
    total_revenue: parseAmount(raw.total_revenue),
    total_orders: raw.total_orders,
  }
}

// ---------- Top products ----------

export interface TopProductsParams {
  limit?: number
  start_date?: string
  end_date?: string
}

export async function getTopProducts(
  params: TopProductsParams = {},
): Promise<TopProduct[]> {
  const raw = await api<{ items: RawTopProduct[] }>(
    `/analytics/top-products${qs(params)}`,
  )
  return raw.items.map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name,
    total_quantity: p.total_quantity,
    total_revenue: parseAmount(p.total_revenue),
  }))
}

// ---------- Top customers ----------

export interface TopCustomersParams {
  limit?: number
  start_date?: string
  end_date?: string
}

export async function getTopCustomers(
  params: TopCustomersParams = {},
): Promise<TopCustomer[]> {
  const raw = await api<{ items: RawTopCustomer[] }>(
    `/analytics/top-customers${qs(params)}`,
  )
  return raw.items.map((c) => ({
    ...c,
    total_spent: parseAmount(c.total_spent),
  }))
}

// ---------- Conversion rate ----------

export interface ConversionRateParams {
  start_date?: string
  end_date?: string
}

export function getConversionRate(
  params: ConversionRateParams = {},
): Promise<ConversionRateResponse> {
  return api<ConversionRateResponse>(`/analytics/conversion-rate${qs(params)}`)
}

// ---------- Low stock ----------

export function getLowStock(): Promise<LowStockResponse> {
  return api<LowStockResponse>(`/analytics/inventory/low-stock`)
}

// ---------- Payment reconciliation ----------

export interface ReconciliationParams {
  start_date?: string
  end_date?: string
}

export async function getPaymentReconciliation(
  params: ReconciliationParams = {},
): Promise<ReconciliationResponse> {
  const raw = await api<RawReconciliationResponse>(
    `/analytics/payments/reconciliation${qs(params)}`,
  )
  return {
    unpaid_orders: raw.unpaid_orders.map((o) => ({
      ...o,
      total_amount: parseAmount(o.total_amount),
    })),
    total_unpaid: raw.total_unpaid,
    total_unpaid_amount: parseAmount(raw.total_unpaid_amount),
    total_paid: raw.total_paid,
    total_paid_amount: parseAmount(raw.total_paid_amount),
  }
}

// ---------- Staff performance ----------

export interface StaffPerformanceParams {
  start_date?: string
  end_date?: string
}

export function getStaffPerformance(
  params: StaffPerformanceParams = {},
): Promise<StaffPerformanceResponse> {
  return api<StaffPerformanceResponse>(
    `/analytics/staff/performance${qs(params)}`,
  )
}

// ---------- Customers by spend ----------

export interface CustomersBySpendParams {
  min_spent?: number
  min_orders?: number
  segment?: string
  sort_by?: "total_spent" | "total_orders"
  page?: number
  page_size?: number
}

export async function getCustomersBySpend(
  params: CustomersBySpendParams = {},
): Promise<CustomersBySpendResponse> {
  const raw = await api<RawCustomersBySpendResponse>(
    `/analytics/customers/by-spend${qs(params)}`,
  )
  return {
    ...raw,
    items: raw.items.map((c) => ({
      ...c,
      total_spent: parseAmount(c.total_spent),
    })),
  }
}

// ---------- Exports / Imports ----------

export interface ExportOrdersParams {
  start_date?: string
  end_date?: string
  /** Order status filter (e.g. "paid", "pending"). */
  status?: string
}

/**
 * Returns the export body as a string (likely CSV per the spec). UI callers
 * typically pipe this through a download helper rather than displaying it.
 */
export function exportOrders(params: ExportOrdersParams = {}): Promise<string> {
  return api<string>(`/analytics/orders/export${qs(params)}`)
}

export function exportProducts(): Promise<string> {
  return api<string>(`/analytics/products/export`)
}

/**
 * Import products from a CSV file. Returns the server's response body as a
 * string — usually a summary like "Imported N products". Hand the result
 * to a toast or modal for the operator.
 */
export function importProducts(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  return api<string>(`/analytics/products/import`, {
    method: "POST",
    body: form,
  })
}

// ---------- Refund ----------

export interface RefundPayload {
  order_id: string
  amount: number
  reason: string
}

export async function processRefund(
  payload: RefundPayload,
): Promise<RefundResponse> {
  const raw = await api<RawRefundResponse>(`/analytics/refund`, {
    method: "POST",
    body: payload,
  })
  return {
    ...raw,
    refund_amount: parseAmount(raw.refund_amount),
  }
}
