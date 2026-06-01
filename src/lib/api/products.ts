import { api, qs } from "./client";
import type { ProductResponse, RawProductResponse } from "./types";

// Same shape as the one in orders.ts. Two usages now — borderline. When a
// third resource needs amount parsing, promote this to lib/api/parse.ts.
function parseAmount(raw: string | null | undefined): number {
  if (raw == null) return 0;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function normalizeProduct(raw: RawProductResponse): ProductResponse {
  return {
    ...raw,
    price: parseAmount(raw.price),
  };
}

export interface ListProductsParams {
  /** 0-based row offset. Default 0. */
  skip?: number;
  /** Max products to return. Default 50, max 100 per the spec. */
  limit?: number;
}

export async function listProducts(
  params: ListProductsParams = {},
): Promise<ProductResponse[]> {
  const raw = await api<RawProductResponse[]>(`/products/${qs(params)}`);
  return raw.map(normalizeProduct);
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/${id}`);
  return normalizeProduct(raw);
}

export async function getProductBySku(sku: string): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/sku/${encodeURIComponent(sku)}`);
  return normalizeProduct(raw);
}
