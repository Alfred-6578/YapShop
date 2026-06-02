import type { ProductResponse } from "@/lib/api/types"

/**
 * Compute 2-letter initials from a product name. Used as the avatar/thumbnail
 * fallback when the product has no media uploaded yet.
 */
export function getProductInitials(product: Pick<ProductResponse, "name">): string {
  const cleaned = product.name.trim()
  if (!cleaned) return "??"
  const parts = cleaned.split(/\s+/)
  if (parts.length === 1) return cleaned.slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/**
 * Deterministically pick a fallback thumbnail color from a fixed palette, keyed
 * on the product id. Same product always gets the same color — important so an
 * operator scanning the list builds visual muscle memory ("the dark purple one
 * is the Lace Gown") even on rows where no image has been uploaded yet.
 */
const THUMBNAIL_PALETTE = [
  "#7C2D5E", "#1F4D7A", "#5C3B7E", "#7A4419",
  "#2A6E54", "#3A6E54", "#3A3D44",
] as const

export function getProductColor(product: Pick<ProductResponse, "id">): string {
  let hash = 0
  for (const ch of product.id) hash = (hash + ch.charCodeAt(0)) % 1000
  return THUMBNAIL_PALETTE[hash % THUMBNAIL_PALETTE.length]
}

/**
 * Resolve the primary image URL for a product. Returns null when no media
 * is uploaded — the thumbnail component then falls back to color + initials.
 *
 * Structurally typed so it accepts both `ProductResponse` (where `media` is
 * required, items have `url`) and the mock `Product` (no media field today —
 * always falls through to null).
 */
export function getProductImageUrl(product: {
  media?: Array<{ url?: string | null }> | null
}): string | null {
  return product.media?.[0]?.url ?? null
}

/**
 * Detect whether a media item is a video. Prefers the `type` field (MIME
 * shape — "image/jpeg" or "video/mp4"); falls back to the URL's extension
 * for legacy entries that don't have type populated.
 */
const VIDEO_EXT = /\.(mp4|mov|webm|avi|mkv|m4v)(\?|#|$)/i
export function isVideoMedia(m: { type?: string; url?: string | null }): boolean {
  if (m.type?.toLowerCase().startsWith("video/")) return true
  if (m.url && VIDEO_EXT.test(m.url)) return true
  return false
}
