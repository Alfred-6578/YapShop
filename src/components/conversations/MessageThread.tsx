"use client"
import React, { useEffect, useRef } from 'react'

import MessageBubble from './MessageBubble'
import SystemEvent from './SystemEvent'
import type { Message } from '@/lib/conversations/mockData'

type Props = {
  messages: Message[]
}

const MessageThread = ({ messages }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div
      ref={ref}
      className="bg-[#13141A] border border-border rounded-card p-3.5 flex flex-col gap-2 max-h-[480px] overflow-y-auto"
    >
      <div className="text-center text-[10px] text-fg-subtle py-1 uppercase tracking-wider">
        Today
      </div>
      {messages.map((m) =>
        m.sender === 'system' ? (
          <SystemEvent key={m.id} message={m} />
        ) : (
          <MessageBubble key={m.id} message={m} />
        ),
      )}
    </div>
  )
}

export default MessageThread
