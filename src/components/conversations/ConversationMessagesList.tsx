"use client"
import { useEffect, useMemo, useRef } from "react"
import {
  HiCheck,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCloud,
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

const MessageBubble = ({
  message,
  staff,
  customer,
}: {
  message: MessageResponse
  staff: StaffResponse[]
  customer: CustomerResponse | null
}) => {
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
          <div className="text-[12.5px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
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
}

const MediaPreview = ({
  urls,
  messageType,
}: {
  urls: string[]
  messageType: string
}) => {
  if (messageType === "image") {
    return (
      <div className="flex flex-col gap-1.5 mb-2">
        {urls.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt="attachment"
            className="rounded-[8px] max-w-[280px] max-h-[280px] object-cover"
          />
        ))}
      </div>
    )
  }

  if (messageType === "voice") {
    return (
      <div className="flex items-center gap-2 mb-2 text-[11.5px] text-fg-muted">
        <HiOutlineMicrophone size={14} />
        <span>Voice note</span>
        {urls[0] && (
          <a
            href={urls[0]}
            target="_blank"
            rel="noreferrer"
            className="text-[#6FD9A0] underline"
          >
            Open
          </a>
        )}
      </div>
    )
  }

  // Generic document / unknown — render each url as a link.
  return (
    <div className="flex flex-col gap-1 mb-2">
      {urls.map((url, i) => (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-[#6FD9A0] underline truncate inline-flex items-center gap-1"
        >
          <HiOutlinePaperClip size={11} />
          Attachment {i + 1}
        </a>
      ))}
    </div>
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
