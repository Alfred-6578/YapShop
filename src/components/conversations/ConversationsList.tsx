"use client"
import React from "react"
import Link from "next/link"
import { HiOutlineExclamationCircle, HiOutlineUser } from "react-icons/hi2"
import { LiaRobotSolid } from "react-icons/lia"

import Card from "@/components/ui/Card"
import { formatRelative } from "@/lib/utils/format"
import { getCustomerColor, getCustomerInitials } from "@/lib/customers/visuals"
import type { ConversationListItem } from "@/lib/api/conversations"

type Props = {
  conversations: ConversationListItem[]
  emptyState?: React.ReactNode
}

type Tag = { kind: "attention" | "ai" | "staff" | "ended"; label: string }

const tagFor = (c: ConversationListItem): Tag => {
  if (c.status === "ended") return { kind: "ended", label: "Ended" }
  if (c.handoff_status === "requested")
    return { kind: "attention", label: "Needs attention" }
  if (c.handoff_status === "active") return { kind: "staff", label: "With staff" }
  return { kind: "ai", label: "AI" }
}

const TagPill = ({ tag }: { tag: Tag }) => {
  const base =
    "text-[9.5px] px-1.5 py-0.5 rounded-[5px] inline-flex items-center gap-0.5 whitespace-nowrap"
  switch (tag.kind) {
    case "attention":
      return (
        <span className={`${base} bg-[rgba(240,169,43,0.18)] text-[#F0C36B]`}>
          <HiOutlineExclamationCircle size={10} />
          {tag.label}
        </span>
      )
    case "ai":
      return (
        <span className={`${base} bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]`}>
          <LiaRobotSolid size={10} />
          {tag.label}
        </span>
      )
    case "staff":
      return (
        <span className={`${base} bg-[rgba(21,194,106,0.16)] text-[#6FD9A0]`}>
          <HiOutlineUser size={10} />
          {tag.label}
        </span>
      )
    case "ended":
      return (
        <span className={`${base} bg-[rgba(107,112,121,0.16)] text-[#989DA3]`}>
          {tag.label}
        </span>
      )
  }
}

const ConversationsList = ({ conversations, emptyState }: Props) => {
  if (conversations.length === 0) {
    return <Card padded={false}>{emptyState ?? null}</Card>
  }

  return (
    <Card padded={false}>
      {conversations.map((c, i) => {
        const tag = tagFor(c)
        const isAttention = tag.kind === "attention"
        const isEnded = c.status === "ended"
        const customerName = c.customer_name ?? "Unknown customer"
        const customerWa = c.customer_whatsapp_number ?? ""
        const lastActivity = c.ended_at ?? c.started_at

        const rowBase =
          "grid grid-cols-[40px_minmax(0,1fr)_auto] gap-2.5 items-center px-3.5 py-3"
        const rowBg = isAttention
          ? "bg-[rgba(240,169,43,0.05)] hover:bg-[rgba(240,169,43,0.08)]"
          : "hover:bg-white/2"
        const rowBorder =
          i === conversations.length - 1 ? "" : "border-b border-white/4"

        const previewColor = isAttention
          ? "text-[#F0C36B]"
          : isEnded
            ? "text-fg-subtle"
            : "text-fg-muted"

        const initialsColor = isEnded ? "#989DA3" : "rgba(255,255,255,0.85)"
        const dotColor = isEnded ? "#3A3D44" : "var(--accent)"

        const subtitle = isEnded
          ? "Conversation ended"
          : tag.kind === "attention"
            ? "AI escalated — needs a human"
            : tag.kind === "staff"
              ? "Staff member handling"
              : "AI handling"

        return (
          <Link
            key={c.id}
            href={`/conversations/${c.id}`}
            className={`${rowBase} ${rowBg} ${rowBorder}`}
          >
            <div className="relative h-10 w-10 shrink-0">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-medium"
                style={{
                  backgroundColor: getCustomerColor({ id: c.customer_id }),
                  color: initialsColor,
                }}
              >
                {getCustomerInitials({
                  name: c.customer_name ?? undefined,
                  whatsapp_number: c.customer_whatsapp_number ?? "",
                })}
              </div>
              <span
                aria-hidden
                className="absolute bottom-0 right-0 h-[11px] w-[11px] rounded-full border-2"
                style={{ backgroundColor: dotColor, borderColor: "#16171B" }}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] text-fg font-medium truncate">
                  {customerName}
                </span>
                {customerWa && (
                  <span className="font-mono text-[10.5px] text-fg-subtle truncate">
                    {customerWa}
                  </span>
                )}
              </div>
              <div
                className={`text-[11.5px] truncate max-w-[340px] ${previewColor}`}
              >
                {subtitle}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10.5px] text-fg-subtle">
                {formatRelative(lastActivity)}
              </span>
              <TagPill tag={tag} />
            </div>
          </Link>
        )
      })}
    </Card>
  )
}

export default ConversationsList
