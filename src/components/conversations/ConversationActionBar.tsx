"use client"
import Link from "next/link"
import { HiEllipsisHorizontal } from "react-icons/hi2"

import { getDisplayName } from "@/lib/customers/utils"
import type { ConversationResponse, CustomerResponse } from "@/lib/api/types"

type Props = {
  conversation: ConversationResponse
  customer: CustomerResponse | null
}

const ConversationActionBar = ({ customer }: Props) => {
  const label = customer ? getDisplayName(customer) : "…"

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <nav
        aria-label="Breadcrumb"
        className="text-[12px] flex-1 min-w-0 truncate"
      >
        <Link
          href="/conversations"
          className="text-fg-muted hover:text-fg transition-colors"
        >
          Conversations
        </Link>
        <span className="text-fg-subtle mx-1.5">/</span>
        <span className="text-fg font-medium">{label}</span>
      </nav>

      <button
        type="button"
        aria-label="More actions"
        className="h-8 w-8 inline-flex items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
      >
        <HiEllipsisHorizontal size={16} />
      </button>
    </div>
  )
}

export default ConversationActionBar
