"use client"
import { useMemo } from "react"
import Link from "next/link"
import { useQueries, useQuery } from "@tanstack/react-query"
import { HiOutlineCheckCircle } from "react-icons/hi2"

import { listHandoffs } from "@/lib/api/handoffs"
import { getConversation } from "@/lib/api/conversations"
import { getCustomer } from "@/lib/api/customers"
import { getDisplayName } from "@/lib/customers/utils"
import { parseServerTime } from "@/lib/utils/format"
import HandoffQueueItem from "./HandoffQueueItem"

// FastAPI sends naive ISO timestamps (no `Z` suffix). new Date() parses
// those as LOCAL time, so a row created moments ago looks hours old in
// UTC+1. parseServerTime treats naive strings as UTC, matching the server.
const formatWait = (iso: string): string => {
  const ms = parseServerTime(iso)
  if (Number.isNaN(ms)) return ""
  const mins = Math.max(0, Math.floor((Date.now() - ms) / 60_000))
  if (mins < 1) return "<1m"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`
}

const RailHandoffQueue = () => {
  // We pass `?status=pending` so the backend CAN filter server-side, but
  // also client-filter as a safety net — current backend ignores unknown
  // query params and returns all rows. Once backend honors the filter,
  // the client filter becomes a no-op. Cache key carries the param so this
  // query doesn't collide with the main page's unfiltered ["handoffs","list"].
  const { data, isLoading, isError } = useQuery({
    queryKey: ["handoffs", "list", { status: "pending" }],
    queryFn: () => listHandoffs({ status: "pending" }),
    staleTime: 30_000,
  })

  const pending = (data ?? []).filter((h) => h.status === "pending")
  const items = pending.slice(0, 5)

  // Fallback name resolution. The nested `conversation.customer_name` is
  // the fast path; when the server omits it, fetch the conversation (to
  // read customer_id) then the customer (for name/display_name). Both go
  // through useQueries so React Query dedupes and caches per id —
  // ["conversations","detail",id] and ["customers","detail",id] match the
  // keys used by the detail/edit pages so cache hits are free across the app.
  const itemsNeedingFetch = useMemo(
    () => items.filter((h) => !h.conversation?.customer_name),
    [items],
  )

  const conversationQueries = useQueries({
    queries: itemsNeedingFetch.map((h) => ({
      queryKey: ["conversations", "detail", h.conversation_id],
      queryFn: () => getConversation(h.conversation_id),
      staleTime: 60_000,
    })),
  })

  const customerIdsToFetch = useMemo(() => {
    const ids = new Set<string>()
    for (const q of conversationQueries) {
      if (q.data) ids.add(q.data.customer_id)
    }
    return Array.from(ids)
  }, [conversationQueries])

  const customerQueries = useQueries({
    queries: customerIdsToFetch.map((id) => ({
      queryKey: ["customers", "detail", id],
      queryFn: () => getCustomer(id),
      staleTime: 60_000,
    })),
  })

  const customerByConversationId = useMemo(() => {
    const customerById = new Map<string, ReturnType<typeof getDisplayName>>()
    const fetchedCustomers = customerQueries
      .map((q) => q.data)
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
    for (const c of fetchedCustomers) customerById.set(c.id, getDisplayName(c))

    const map = new Map<string, string>()
    for (let i = 0; i < itemsNeedingFetch.length; i++) {
      const conv = conversationQueries[i]?.data
      if (!conv) continue
      const name = customerById.get(conv.customer_id)
      if (name) map.set(itemsNeedingFetch[i].conversation_id, name)
    }
    return map
  }, [itemsNeedingFetch, conversationQueries, customerQueries])

  const resolveName = (h: (typeof items)[number]): string => {
    return (
      h.conversation?.customer_name ||
      customerByConversationId.get(h.conversation_id) ||
      "Customer"
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-[15px] font-semibold">Handoff queue</h2>
        <Link
          href="/handoffs"
          className="text-xs text-fg-muted tnum hover:text-fg transition-colors"
        >
          {pending.length}
        </Link>
      </div>

      {isLoading ? (
        <div className="px-3 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-white/4 animate-pulse" />
              <div className="flex-1 h-3 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="px-3 text-[11.5px] text-[#F09595]">
          Couldn&apos;t load handoffs.
        </div>
      ) : items.length === 0 ? (
        <div className="px-3 py-6 flex flex-col items-center gap-1.5 text-fg-subtle">
          <HiOutlineCheckCircle size={20} className="text-[#6FD9A0]" />
          <span className="text-[11px]">All caught up</span>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((h, i) => (
            <Link
              key={h.id}
              href={`/conversations/${h.conversation_id}`}
              className="block"
            >
              <HandoffQueueItem
                name={resolveName(h)}
                waited={formatWait(h.requested_at ?? h.created_at)}
                active={i === 0}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default RailHandoffQueue
