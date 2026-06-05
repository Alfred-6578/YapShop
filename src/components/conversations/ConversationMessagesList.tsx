"use client"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import {
  HiCheck,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCloud,
  HiOutlineDocument,
  HiOutlineExclamationCircle,
  HiOutlineMicrophone,
  HiOutlinePaperClip,
} from "react-icons/hi2"

import { formatRelative } from "@/lib/utils/format"
import { getDisplayName } from "@/lib/customers/utils"
import type {
  CustomerResponse,
  MessageResponse,
  StaffResponse,
} from "@/lib/api/types"

type Props = {
  messages: MessageResponse[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  staff: StaffResponse[]
  customer: CustomerResponse | null
}

const ConversationMessagesList = ({
  messages,
  isLoading,
  isError,
  onRetry,
  staff,
  customer,
}: Props) => {
  const sorted = useMemo(
    () =>
      [...messages].sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [messages],
  )

  // Jump to the latest message whenever the count changes.
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" })
  }, [sorted.length])

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-card p-4 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <div className="h-10 w-56 bg-white/4 rounded-[12px] animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
        <HiOutlineCloud size={24} className="text-[#F09595]" />
        <div className="text-[12.5px] text-fg">Couldn&apos;t load messages.</div>
        <button
          type="button"
          onClick={onRetry}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Try again
        </button>
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="bg-card border border-border rounded-card px-4 py-12 flex flex-col items-center gap-2 text-fg-muted">
        <HiOutlineChatBubbleOvalLeft size={24} />
        <div className="text-[12px]">No messages yet.</div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-card p-4 max-h-[600px] overflow-y-auto">
      <div className="flex flex-col gap-3">
        {sorted.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            staff={staff}
            customer={customer}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

/**
 * Memoized so a list re-render (e.g. a new message landing via WebSocket)
 * doesn't tear down and rebuild every existing bubble. Mounted `<img>` /
 * `<audio>` / `<video>` elements stay alive — no browser-cache lookup, no
 * decode work. Reference equality on the props is enough since:
 *   - `message` comes straight from React Query's cache, stable across
 *     refetches when the row hasn't changed.
 *   - `staff` and `customer` are array/object references from their queries;
 *     stable until those queries refetch.
 * A WebSocket invalidation that replaces the messages array WILL re-render
 * the bubbles — but their underlying message objects are still pointer-
 * equal where the row didn't change, so memo bails early on those.
 */
const MessageBubble = memo(function MessageBubble({
  message,
  staff,
  customer,
}: {
  message: MessageResponse
  staff: StaffResponse[]
  customer: CustomerResponse | null
}) {
  // System events render as centered pills, not bubbles.
  if (message.message_type === "system") {
    return (
      <div className="flex justify-center my-1">
        <div className="text-[10.5px] text-fg-subtle bg-white/3 px-2.5 py-1 rounded-full">
          {message.content ?? ""}
        </div>
      </div>
    )
  }

  const isCustomer = message.sender_type === "customer"
  const isAi = message.sender_type === "ai"
  const isStaff = message.sender_type === "staff"

  const senderName = isCustomer
    ? customer
      ? getDisplayName(customer)
      : "Customer"
    : isAi
      ? "AI"
      : (staff.find((s) => s.id === message.staff_id)?.name ?? "Staff")

  // Customer on the left, AI/staff on the right.
  const align = isCustomer ? "justify-start" : "justify-end"

  const bubbleClass = isCustomer
    ? "bg-white/5 text-fg"
    : isAi
      ? "bg-[#1F2937] text-[#C5D2E0]"
      : "bg-[rgba(21,194,106,0.15)] text-[#6FD9A0] border border-[rgba(21,194,106,0.2)]"

  const hasMedia = !!message.media_urls && message.media_urls.length > 0
  const showStatus = (isStaff || isAi) && !!message.status

  return (
    <div className={`flex flex-col gap-1 ${align}`}>
      <div
        className={`text-[10px] text-fg-subtle px-1 ${
          isCustomer ? "" : "text-right"
        }`}
      >
        {senderName} · {formatRelative(message.created_at)}
      </div>
      <div
        className={`max-w-[75%] rounded-[12px] px-3 py-2 ${bubbleClass} ${
          isCustomer ? "self-start" : "self-end"
        }`}
      >
        {hasMedia && (
          <MediaPreview
            urls={message.media_urls!}
            messageType={message.message_type}
          />
        )}
        {message.content && (
          <MessageContent
            content={message.content}
            messageType={message.message_type}
          />
        )}
        {showStatus && (
          <div className="text-[9.5px] text-fg-subtle mt-1 text-right flex items-center gap-1 justify-end">
            <MessageStatusIcon status={message.status ?? ""} />
            <span className="capitalize">{message.status}</span>
          </div>
        )}
      </div>
    </div>
  )
})

/* ---------- Structured-template parser ----------
 *
 * The backend's AI sends product recommendations as marker-wrapped blocks
 * embedded in normal message content. Each uploaded media file gets its own
 * [PRODUCT_MEDIA] wrapper — NOT a single comma-separated list — because
 * URLs themselves can legitimately contain commas (e.g. Cloudinary
 * transformation params like `/q_50,w_480/`).
 *
 *   Here's something you might like:
 *   [PRODUCT_START]
 *   *Wireless Bluetooth Earbuds Pro (color: Black)*
 *   [PRODUCT_MEDIA]https://.../photo1.jpg[/PRODUCT_MEDIA]
 *   [PRODUCT_MEDIA]https://res.cloudinary.com/.../q_50,w_480/dance.mp4[/PRODUCT_MEDIA]
 *   [PRODUCT_END]
 *   Want to order?
 *
 * We split the message into segments — text runs interleaved with structured
 * cards — so each renders with appropriate UI. Unknown markers fall back to
 * plain text so a new template won't break the bubble.
 */

type Segment =
  | { type: "text"; content: string }
  | { type: "product"; title: string; mediaUrls: string[] }

const PRODUCT_BLOCK_RE = /\[PRODUCT_START\]([\s\S]*?)\[PRODUCT_END\]/g
const PRODUCT_MEDIA_RE = /\[PRODUCT_MEDIA\]([\s\S]+?)\[\/PRODUCT_MEDIA\]/g

function parseMessageContent(raw: string): Segment[] {
  const segments: Segment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  // Reset the global regexes' state — RegExp objects with `g` carry
  // lastIndex across calls, which would corrupt parsing on subsequent
  // messages.
  PRODUCT_BLOCK_RE.lastIndex = 0

  while ((match = PRODUCT_BLOCK_RE.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = raw.slice(lastIndex, match.index).trim()
      if (text) segments.push({ type: "text", content: text })
    }

    const block = match[1]
    const titleMatch = block.match(/\*([^*]+)\*/)
    const title = titleMatch?.[1]?.trim() ?? "Product"

    // Extract every [PRODUCT_MEDIA] wrapper — one URL per wrapper. We do
    // NOT split on comma because Cloudinary URLs contain commas in their
    // transformation segments (e.g. `q_50,w_480`).
    const mediaUrls: string[] = []
    PRODUCT_MEDIA_RE.lastIndex = 0
    let mediaMatch: RegExpExecArray | null
    while ((mediaMatch = PRODUCT_MEDIA_RE.exec(block)) !== null) {
      const url = mediaMatch[1].trim()
      if (url) mediaUrls.push(url)
    }

    segments.push({ type: "product", title, mediaUrls })

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < raw.length) {
    const text = raw.slice(lastIndex).trim()
    if (text) segments.push({ type: "text", content: text })
  }

  if (segments.length === 0 && raw) {
    segments.push({ type: "text", content: raw })
  }

  return segments
}

const MessageContent = ({
  content,
  messageType,
}: {
  content: string
  messageType: string
}) => {
  const segments = parseMessageContent(content)

  return (
    <div className="flex flex-col gap-2">
      {segments.map((seg, i) =>
        seg.type === "product" ? (
          <ProductCard
            key={i}
            title={seg.title}
            mediaUrls={seg.mediaUrls}
            messageType={messageType}
          />
        ) : (
          <div
            key={i}
            className="text-[12.5px] leading-relaxed whitespace-pre-wrap break-words"
          >
            {seg.content}
          </div>
        ),
      )}
    </div>
  )
}

const ProductCard = ({
  title,
  mediaUrls,
  messageType,
}: {
  title: string
  mediaUrls: string[]
  messageType: string
}) => {
  return (
    <div className="bg-black/20 border border-white/10 rounded-[10px] p-2.5 max-w-[320px]">
      <div className="text-[12.5px] font-semibold text-fg mb-2 leading-snug">
        {title}
      </div>
      {mediaUrls.length > 0 && (
        // Horizontal scroll keeps the card compact even when the AI sends
        // 5–8 product photos. Snap-x gives a nice "settle on one image"
        // feel when scrolling on touch.
        <div className="flex gap-1.5 overflow-x-auto snap-x -mx-0.5 px-0.5 pb-0.5">
          {mediaUrls.map((url, i) => {
            const kind = classifyUrl(url, messageType)
            return <ProductMediaThumb key={i} url={url} kind={kind} />
          })}
        </div>
      )}
    </div>
  )
}

const ProductMediaThumb = ({
  url,
  kind,
}: {
  url: string
  kind: MediaKind
}) => {
  if (kind === "image") {
    return (
      <div className="shrink-0 snap-start">
        <ImageWithFallback
          url={url}
          alt="Product"
          className="w-20 h-20 rounded-[6px] object-cover cursor-zoom-in"
        />
      </div>
    )
  }
  if (kind === "video") {
    return (
      <video
        controls
        preload="metadata"
        src={url}
        className="w-32 h-20 rounded-[6px] bg-black object-cover shrink-0 snap-start"
      />
    )
  }
  // Other types (audio, document, unknown) — rare in a product card, but
  // surface as a small link so they're at least openable.
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-[11px] text-[#6FD9A0] underline shrink-0 self-center"
    >
      Open
    </a>
  )
}

/**
 * Best-effort filename from a URL path. Strips query string + hash, picks
 * the last path segment, decodes percent-escapes. Falls back to a generic
 * "Attachment N" if the URL has no usable segment (root, opaque tokens).
 */
const fileNameFromUrl = (url: string, fallback: string): string => {
  try {
    const u = new URL(url, "https://placeholder.local")
    const last = u.pathname.split("/").filter(Boolean).pop()
    if (!last) return fallback
    const decoded = decodeURIComponent(last)
    return decoded.length > 40 ? `${decoded.slice(0, 37)}…` : decoded
  } catch {
    return fallback
  }
}

// Extension regexes — `(\?|$|#)` ensures we don't false-match a query/hash
// segment that happens to contain something like `.mp4` later in the URL.
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif|bmp|svg)(\?|$|#)/i
const AUDIO_EXT = /\.(mp3|ogg|oga|wav|m4a|aac|opus)(\?|$|#)/i
const VIDEO_EXT = /\.(mp4|mov|m4v|ogv|mkv|3gp|qt|webm)(\?|$|#)/i
const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|rtf|odt)(\?|$|#)/i

// Path-based detection for hosts that serve media without file extensions.
// Cloudinary embeds the resource type in its path (`/image/upload/` or
// `/video/upload/`), which we can trust even when the URL ends with the
// public_id rather than a `.jpg`/`.mp4`.
const CLOUDINARY_IMAGE_PATH = /\/image\/upload\//i
const CLOUDINARY_VIDEO_PATH = /\/video\/upload\//i
// Common image hosts that serve via opaque paths (no extension).
const KNOWN_IMAGE_HOST = /(?:^|\/\/)(?:[\w-]+\.)?(picsum\.photos|images\.unsplash\.com|imgur\.com|i\.imgur\.com|cdn\.shopify\.com|res\.cloudinary\.com)/i

type MediaKind = "image" | "voice" | "video" | "document" | "other"

/**
 * Classify a single URL into a media kind. WhatsApp/backend message_type is
 * unreliable — messages often arrive as `type: "text"` with the actual file
 * URL in `media_urls`. We resolve in priority order:
 *   1) URL extension (most reliable)
 *   2) Cloudinary path prefix (image/upload vs video/upload)
 *   3) Known image hosts that serve without extensions
 *   4) message_type hint
 *   5) Default to "image" — most WhatsApp media is, and the image branch
 *      uses an onError fallback that gracefully drops to a link if the
 *      browser can't actually decode the response as an image.
 */
const classifyUrl = (url: string, hint: string): MediaKind => {
  if (IMAGE_EXT.test(url)) return "image"
  if (VIDEO_EXT.test(url)) return "video"
  if (AUDIO_EXT.test(url)) return "voice"
  if (DOC_EXT.test(url)) return "document"

  if (CLOUDINARY_VIDEO_PATH.test(url)) return "video"
  if (CLOUDINARY_IMAGE_PATH.test(url)) return "image"
  if (KNOWN_IMAGE_HOST.test(url)) return "image"

  if (
    hint === "image" ||
    hint === "voice" ||
    hint === "video" ||
    hint === "document"
  ) {
    return hint
  }

  // Default: try as image. The ImageWithFallback wrapper used by the
  // "image" branch handles the case where the URL isn't actually an image
  // by switching to a plain link on the <img> onError event. This gives us
  // "render media, fall back to link" without needing to HEAD every URL.
  return "image"
}

/**
 * Renders an <img>; if the browser fires `onError` (URL is not an image, is
 * 404, CORS-blocked, etc.) it swaps to a plain link with a paperclip and the
 * best filename we can pull from the URL. Used by every code path that
 * speculatively renders an image without a strong type signal.
 */
const ImageWithFallback = ({
  url,
  alt,
  className,
}: {
  url: string
  alt: string
  className: string
}) => {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] text-[#6FD9A0] underline truncate inline-flex items-center gap-1"
      >
        <HiOutlinePaperClip size={11} />
        {fileNameFromUrl(url, "Attachment")}
      </a>
    )
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
      />
    </a>
  )
}

const MediaPreview = ({
  urls,
  messageType,
}: {
  urls: string[]
  messageType: string
}) => {
  return (
    <div className="flex flex-col gap-1.5 mb-2">
      {urls.map((url, i) => {
        const kind = classifyUrl(url, messageType)
        return <SingleMedia key={i} url={url} index={i} kind={kind} />
      })}
    </div>
  )
}

const SingleMedia = ({
  url,
  index,
  kind,
}: {
  url: string
  index: number
  kind: MediaKind
}) => {
  if (kind === "image") {
    // Click opens full-size in a new tab — the inline preview caps at
    // 280px so the bubble doesn't dominate the thread. Falls back to a
    // link if the URL turns out not to be an image (e.g. CORS-blocked or
    // wrong content-type).
    return (
      <ImageWithFallback
        url={url}
        alt="Image attachment"
        className="rounded-[8px] max-w-[280px] max-h-[280px] object-cover cursor-zoom-in"
      />
    )
  }

  if (kind === "voice") {
    return (
      <div className="flex items-center gap-2">
        <HiOutlineMicrophone size={14} className="text-fg-subtle shrink-0" />
        {/* `preload="metadata"` fetches just enough to show duration in
            the controls without downloading the full audio until play. */}
        <audio
          controls
          preload="metadata"
          src={url}
          className="h-8 max-w-[260px]"
        />
      </div>
    )
  }

  if (kind === "video") {
    return (
      <video
        controls
        preload="metadata"
        src={url}
        className="rounded-[8px] max-w-[320px] max-h-[280px] bg-black"
      >
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[#6FD9A0] underline"
        >
          Open video
        </a>
      </video>
    )
  }

  if (kind === "document") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="bg-white/4 hover:bg-white/8 transition-colors rounded-[8px] px-2.5 py-2 flex items-center gap-2 text-[11.5px] text-fg max-w-[280px]"
      >
        <HiOutlineDocument size={16} className="text-fg-subtle shrink-0" />
        <span className="truncate flex-1">
          {fileNameFromUrl(url, `Document ${index + 1}`)}
        </span>
      </a>
    )
  }

  // Unknown — generic paperclip link with the best filename we could pull.
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-[11px] text-[#6FD9A0] underline truncate inline-flex items-center gap-1"
    >
      <HiOutlinePaperClip size={11} />
      {fileNameFromUrl(url, `Attachment ${index + 1}`)}
    </a>
  )
}

const MessageStatusIcon = ({ status }: { status: string }) => {
  if (status === "failed")
    return <HiOutlineExclamationCircle size={11} className="text-[#F09595]" />
  if (status === "read")
    return (
      <span className="inline-flex items-center text-[#8FB6F5]">
        <HiCheck size={10} />
        <HiCheck size={10} className="-ml-1.5" />
      </span>
    )
  if (status === "delivered")
    return (
      <span className="inline-flex items-center">
        <HiCheck size={10} />
        <HiCheck size={10} className="-ml-1.5" />
      </span>
    )
  if (status === "sent") return <HiCheck size={10} />
  return null
}

export default ConversationMessagesList
