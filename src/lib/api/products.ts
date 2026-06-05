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
   * Wire encoding uses parallel multi-value FormData lists:
   * `files`+`is_live` for uploads, `keep_media`+`keep_media_is_live` for
   * kept items. See buildProductFormData.
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

  // Both new uploads and kept-existing items use the parallel multi-value
  // pattern, paired by INSERTION ORDER:
  //   - new uploads: `files` (file) + `is_live` ("true"/"false" string)
  //   - kept items: `keep_media` (URL) + `keep_media_is_live` ("true"/"false")
  // FastAPI reads each as `List[…]`; the Nth value in one list matches the
  // Nth value in its sibling list. Strings "true"/"false" — not raw booleans
  // — since FormData stringifies everything anyway and we want it explicit.
  for (const m of payload.media ?? []) {
    if ("file" in m) {
      form.append("files", m.file);
      form.append("is_live", m.is_live ? "true" : "false");
    } else {
      form.append("keep_media", m.url);
      form.append("keep_media_is_live", m.is_live ? "true" : "false");
    }
  }

  // Debug: dump every entry the FormData actually holds, with its JS type.
  // Booleans never reach the wire — FormData coerces everything to string —
  // but this log proves the keep_media_is_live values go out as "true"/"false"
  // strings, not booleans. Remove once the round-trip is verified.
  // eslint-disable-next-line no-console
  console.log(
    "[buildProductFormData] entries:",
    Array.from(form.entries()).map(([k, v]) => ({
      key: k,
      value: v instanceof File ? `<File ${v.name}>` : v,
      type: typeof v,
    })),
  );

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

/**
 * Delete a single media item from a product. The server identifies the
 * item by its full URL (passed in the JSON body, NOT the path or a query
 * param), and responds with the updated ProductResponse — the same shape
 * as getProduct, with the deleted item removed from `media`.
 *
 * Unlike form-based "kept_media" reconciliation, this is immediate: the
 * delete commits before the user saves any other form changes. Callers
 * should sync local UI state from the returned product, not from their
 * own optimistic copy.
 */
export async function deleteProductMedia(
  productId: string,
  mediaUrl: string,
): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/${productId}/media`, {
    method: "DELETE",
    body: { media_url: mediaUrl },
  });
  return normalizeProduct(raw);
}

/**
 * Patch a single media item on a product — currently only `is_live` is
 * supported by the backend. Server identifies the item by URL in the
 * JSON body and returns the updated ProductResponse.
 *
 * Use this for toggling live/stock on items that already exist server-side.
 * For new uploads (still in the form, not saved), keep the flag in local
 * state — it travels with the file on the eventual POST/PUT.
 */
export async function updateProductMedia(
  productId: string,
  mediaUrl: string,
  patch: { is_live: boolean },
): Promise<ProductResponse> {
  const raw = await api<RawProductResponse>(`/products/${productId}/media`, {
    method: "PATCH",
    body: { media_url: mediaUrl, ...patch },
  });
  return normalizeProduct(raw);
}
