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

/**
 * One media entry in a product write. Either a new `file` to upload OR a
 * `url` of an existing item the server should keep. `is_live` always
 * applies (per-media flag — "real vendor-shot" vs stock).
 */
export type ProductMediaInput =
  | { file: File; is_live: boolean }
  | { url: string; is_live: boolean };

export interface ProductWritePayload {
  name: string;
  price: number;
  description?: string | null;
  sku?: string | null;
  category_id?: string | null;
  is_active?: boolean;
  tags?: string[];
  /**
   * Ordered list of every media slot the saved product should end up with.
   * New uploads (file) and kept-existing (url) interleave in display order.
   * The wire encoding splits them: uploads get indexed fields, kept items
   * collect into a single JSON `keep_media` field. See buildProductFormData.
   */
  media?: ProductMediaInput[];
}

function buildProductFormData(payload: ProductWritePayload): FormData {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("price", String(payload.price));
  if (payload.description) form.append("description", payload.description);
  if (payload.sku) form.append("sku", payload.sku);
  if (payload.category_id) form.append("category_id", payload.category_id);
  if (payload.is_active !== undefined) form.append("is_active", String(payload.is_active));
  if (payload.tags && payload.tags.length > 0) {
    form.append("tags", JSON.stringify(payload.tags));
  }

  // Each uploaded file is paired with its is_live flag by INSERTION ORDER:
  // both arrive at the server as parallel lists (FastAPI's `files: List[…]`
  // + `is_live: List[bool]`), so the Nth `files` entry matches the Nth
  // `is_live` entry. Appending them as a pair after each loop iteration
  // keeps the alignment intact even if a non-file slot slips in later.
  //
  // Kept-existing items still encode as a single JSON `keep_media` field
  // (URL + is_live per item). If backend also wants those interleaved with
  // parallel `keep_media` / `keep_media_is_live` appends, we'll swap then.
  const keeps: Array<{ url: string; is_live: boolean }> = [];
  for (const m of payload.media ?? []) {
    if ("file" in m) {
      form.append("files", m.file);
      form.append("is_live", String(m.is_live));
    } else {
      keeps.push({ url: m.url, is_live: m.is_live });
    }
  }
  if (keeps.length > 0) {
    form.append("keep_media", JSON.stringify(keeps));
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
