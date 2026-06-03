import Link from "next/link"
import {
  HiOutlineExclamationCircle,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArrowPath,
} from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import { formatRelative } from "@/lib/utils/format"
import type { ConversationResponse } from "@/lib/api/types"

type Props = {
  conversations: ConversationResponse[]
  isLoading?: boolean
}

const CustomerConversationsSection = ({
  conversations,
  isLoading = false,
}: Props) => {
  const sorted = [...conversations]
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .slice(0, 3)
  const total = conversations.length
  const activeCount = conversations.filter((c) => c.status === "active").length

  const header = (meta: React.ReactNode) => (
    <CardHeader title="Conversations" meta={meta} />
  )

  if (isLoading) {
    return (
      <Card>
        {header(<span className="text-[11px] text-fg-muted">Loading…</span>)}
        <div className="py-6 flex items-center justify-center gap-2 text-[11.5px] text-fg-muted">
          <HiOutlineArrowPath size={13} className="animate-spin" />
          Loading conversations…
        </div>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card>
        {header(<span className="text-[11px] text-fg-muted">0</span>)}
        <div className="py-6 text-center text-[11.5px] text-fg-subtle">
          No conversations yet.
        </div>
      </Card>
    )
  }

  return (
    <Card>
      {header(
        <div className="flex items-center gap-3 text-[11px] text-fg-muted">
          <span>
            {total} total · {activeCount} active
          </span>
          <Link
            href="/conversations"
            className="text-[#6FD9A0] hover:underline"
          >
            View all
          </Link>
        </div>,
      )}
      <div>
        {sorted.map((c) => {
          let iconBg: string
          let icon: React.ReactNode
          if (c.handoff_status === "requested") {
            iconBg = "bg-[rgba(240,169,43,0.16)] text-[#F0C36B]"
            icon = <HiOutlineExclamationCircle size={16} />
          } else if (c.status === "ended") {
            iconBg = "bg-[rgba(107,112,121,0.16)] text-[#989DA3]"
            icon = <HiOutlineChatBubbleOvalLeft size={16} />
          } else {
            iconBg = "bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]"
            icon = <HiOutlineChatBubbleOvalLeft size={16} />
          }

          const title =
            c.status === "ended"
              ? "Conversation ended"
              : c.handoff_status === "requested"
                ? "Escalated to staff"
                : "Active conversation"

          let subtitle: string
          if (c.handoff_status === "requested") subtitle = "AI escalated"
          else if (c.handoff_status === "active" && c.assigned_staff_id)
            subtitle = "Staff member handling"
          else if (c.status === "ended") subtitle = "ended"
          else subtitle = "AI handling"

          return (
            <Link
              key={c.id}
              href={`/conversations/${c.id}`}
              className="grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3 items-center py-2.5 border-t border-white/4 first:border-t-0 hover:bg-white/2"
            >
              <div
                className={`h-9 w-9 rounded-full inline-flex items-center justify-center ${iconBg}`}
              >
                {icon}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] text-fg font-medium truncate">
                  {title}
                </div>
                <div className="text-[11px] text-fg-muted truncate max-w-[280px] mt-0.5">
                  — {subtitle}
                </div>
              </div>
              <span className="text-[10.5px] text-fg-subtle">
                {formatRelative(c.started_at)}
              </span>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}

export default CustomerConversationsSection
