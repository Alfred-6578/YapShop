"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineCheckCircle } from "react-icons/hi2"

import { listHandoffs } from "@/lib/api/handoffs"
import HandoffQueueItem from "./HandoffQueueItem"

const formatWait = (iso: string): string => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (mins < 1) return "<1m"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`
}

const RailHandoffQueue = () => {
  // Share cache with the main handoffs page — `/handoffs/pending` requires
  // auth, but `/handoffs/` is public. Client-filtering for pending status
  // also means one less HTTP round-trip when navigating between the rail
  // and the main page.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["handoffs", "list"],
    queryFn: listHandoffs,
    staleTime: 30_000,
  })

  const pending = (data ?? []).filter((h) => h.status === "pending")
  const items = pending.slice(0, 5)

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
                name={h.conversation?.customer_name ?? "Customer"}
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
