"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineExclamationCircle,
  HiOutlineUser,
} from "react-icons/hi2"
import { LiaRobotSolid } from "react-icons/lia"

import { listConversationsFiltered } from "@/lib/api/conversations"
import { formatRelative } from "@/lib/utils/format"
import { getCustomerColor, getCustomerInitials } from "@/lib/customers/visuals"

const PAGE_SIZE = 5

const tagFor = (handoffStatus: string | null, status: string) => {
  if (status === "ended") return null
  if (handoffStatus === "requested")
    return {
      cls: "bg-[rgba(240,169,43,0.18)] text-[#F0C36B]",
      icon: <HiOutlineExclamationCircle size={9} />,
      label: "Needs attention",
    }
  if (handoffStatus === "active")
    return {
      cls: "bg-[rgba(21,194,106,0.16)] text-[#6FD9A0]",
      icon: <HiOutlineUser size={9} />,
      label: "With staff",
    }
  return {
    cls: "bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]",
    icon: <LiaRobotSolid size={9} />,
    label: "AI",
  }
}

const RailConversations = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conversations", "filter", { status: "active", page_size: PAGE_SIZE }],
    queryFn: () =>
      listConversationsFiltered({
        status: "active",
        page: 1,
        page_size: PAGE_SIZE,
      }),
    staleTime: 30_000,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <section>
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-[15px] font-semibold">Conversations</h2>
        <Link
          href="/conversations"
          className="text-xs text-fg-muted tnum hover:text-fg transition-colors"
        >
          {total}
        </Link>
      </div>

      {isLoading ? (
        <div className="px-3 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <div className="w-7 h-7 rounded-full bg-white/4 animate-pulse" />
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-white/3 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="px-3 text-[11.5px] text-[#F09595]">
          Couldn&apos;t load conversations.
        </div>
      ) : items.length === 0 ? (
        <div className="px-3 py-6 flex flex-col items-center gap-1.5 text-fg-subtle">
          <HiOutlineChatBubbleOvalLeft size={20} />
          <span className="text-[11px]">No active conversations</span>
        </div>
      ) : (
        <div className="space-y-0.5">
          {items.map((c) => {
            const tag = tagFor(c.handoff_status, c.status)
            const name = c.customer_name ?? "Unknown customer"
            const lastActivity = c.ended_at ?? c.started_at
            return (
              <Link
                key={c.id}
                href={`/conversations/${c.id}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-control hover:bg-card-hover transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-medium shrink-0"
                  style={{
                    backgroundColor: getCustomerColor({ id: c.customer_id }),
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {getCustomerInitials({
                    name: c.customer_name ?? undefined,
                    whatsapp_number: c.customer_whatsapp_number ?? "",
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-fg font-medium truncate">
                      {name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {tag && (
                      <span
                        className={`text-[9px] px-1 py-0 rounded-[4px] inline-flex items-center gap-0.5 whitespace-nowrap ${tag.cls}`}
                      >
                        {tag.icon}
                        {tag.label}
                      </span>
                    )}
                    <span className="text-[10px] text-fg-subtle truncate">
                      {formatRelative(lastActivity)}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default RailConversations
