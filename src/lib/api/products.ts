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
    tags: raw.tags ?? [],
    media: raw.media ?? [],
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

export interface SearchProductsParams {
  name?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  tag?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}

export async function searchProducts(
  params: SearchProductsParams = {},
): Promise<ProductResponse[]> {
  const raw = await api<RawProductResponse[]>(`/products/search${qs(params)}`);
  return raw.map(normalizeProduct);
}

export interface ProductWritePayload {
  name: string;
  price: number;
  description?: string | null;
  sku?: string | null;
  category_id?: string | null;
  is_active?: boolean;
  is_live?: boolean;
  tags?: string[];
  /** New files to upload, appended as multipart `files` parts. */
  files?: File[];
  /**
   * Existing media URLs the server should preserve. Only meaningful on PUT —
   * the edit form sends every existing slot's URL the user didn't remove.
   * Without this, the server treats `files` as the complete new media list
   * and drops every previously-uploaded item. Encoded as a JSON string for
   * the same reason `tags` is — single multipart part, simpler server parse.
   */
  keep_media?: string[];
}

function buildProductFormData(payload: ProductWritePayload): FormData {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("price", String(payload.price));
  if (payload.description) form.append("description", payload.description);
  if (payload.sku) form.append("sku", payload.sku);
  if (payload.category_id) form.append("category_id", payload.category_id);
  if (payload.is_active !== undefined) form.append("is_active", String(payload.is_active));
  if (payload.is_live !== undefined) form.append("is_live", String(payload.is_live));
  if (payload.tags && payload.tags.length > 0) {
    form.append("tags", JSON.stringify(payload.tags));
  }
  if (payload.keep_media && payload.keep_media.length > 0) {
    form.append("keep_media", JSON.stringify(payload.keep_media));
  }
  if (payload.files) {
    for (const file of payload.files) form.append("files", file);
  }
  return form;
}

export async function createProduct(payload: ProductWritePayload): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>("/products/", {
    method: "POST",
    body: buildProductFormData(payload),
  });
  return normalizeProduct(raw);
}

export async function updateProduct(
  id: string,
  payload: ProductWritePayload,
): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/${id}`, {
    method: "PUT",
    body: buildProductFormData(payload),
  });
  return normalizeProduct(raw);
}

export async function deleteProduct(id: string): Promise<void> {
  await api<void>(`/products/${id}`, {
    method: "DELETE",
  });
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/${id}`);
  return normalizeProduct(raw);
}

export async function getProductBySku(sku: string): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/sku/${encodeURIComponent(sku)}`);
  return normalizeProduct(raw);
}
