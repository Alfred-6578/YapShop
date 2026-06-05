import { api } from "./client"
import type {
  ProductVariantResponse,
  RawProductVariantResponse,
} from "./types"

function parseAmount(raw: string | number | null | undefined): number {
  if (raw == null) return 0
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : 0
}

function normalize(raw: RawProductVariantResponse): ProductVariantResponse {
  return {
    ...raw,
    product_variant_price: parseAmount(raw.product_variant_price),
  }
}

export interface VariantWritePayload {
  product_id: string
  attributes: Record<string, unknown>
  product_variant_price: number
  inventory_quantity: number
  low_stock_threshold: number
  is_active: boolean
}

export async function listVariants(): Promise<ProductVariantResponse[]> {
  const raw = await api<RawProductVariantResponse[]>(`/product-variants/`)
  return raw.map(normalize)
}

export async function listVariantsByProduct(
  productId: string,
): Promise<ProductVariantResponse[]> {
  const raw = await api<RawProductVariantResponse[]>(
    `/product-variants/product/${productId}`,
  )
  return raw.map(normalize)
}

export async function getVariant(id: string): Promise<ProductVariantResponse> {
  const raw = await api<RawProductVariantResponse>(`/product-variants/${id}`)
  return normalize(raw)
}

export async function getVariantBySku(
  sku: string,
): Promise<ProductVariantResponse> {
  const raw = await api<RawProductVariantResponse>(
    `/product-variants/sku/${encodeURIComponent(sku)}`,
  )
  return normalize(raw)
}

export async function createVariant(
  payload: VariantWritePayload,
): Promise<ProductVariantResponse> {
  const raw = await api<RawProductVariantResponse>(`/product-variants/`, {
    method: "POST",
    body: payload,
  })
  return normalize(raw)
}

export async function updateVariant(
  id: string,
  payload: VariantWritePayload,
): Promise<ProductVariantResponse> {
  const raw = await api<RawProductVariantResponse>(`/product-variants/${id}`, {
    method: "PUT",
    body: payload,
  })
  return normalize(raw)
}

export async function deleteVariant(id: string): Promise<void> {
  await api<void>(`/product-variants/${id}`, { method: "DELETE" })
}
