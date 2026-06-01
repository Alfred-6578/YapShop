import React from 'react'
import type { Message } from '@/lib/conversations/mockData'

type Props = {
  message: Message
}

const MessageBubble = ({ message }: Props) => {
  const isOutbound = message.sender === 'ai' || message.sender === 'staff'

  const wrapperAlign = isOutbound ? 'self-end items-end' : 'self-start items-start'

  const bubbleStyle =
    message.sender === 'customer'
      ? 'bg-[#222428] rounded-bl-[4px] text-fg'
      : message.sender === 'ai'
        ? 'bg-[#1F2A3A] text-[#D8E2F0] rounded-br-[4px]'
        : 'bg-[rgba(21,194,106,0.13)] border border-[rgba(21,194,106,0.2)] rounded-br-[4px] text-fg'

  return (
    <div className={`flex flex-col gap-0.5 max-w-[78%] ${wrapperAlign}`}>
      <div className={`px-2.5 py-1.5 rounded-[12px] text-[12px] leading-snug ${bubbleStyle}`}>
        {message.body}
      </div>
      <div className="flex items-center gap-1 px-1 text-[9.5px] text-fg-subtle">
        {message.sender === 'ai' && (
          <span className="text-[9px] px-1 rounded-[3px] bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]">
            AI
          </span>
        )}
        {message.sender === 'staff' && (
          <span className="text-[9px] px-1 rounded-[3px] bg-[rgba(21,194,106,0.18)] text-[#6FD9A0]">
            {message.staff_name ?? 'Staff'}
          </span>
        )}
        <span>{message.timestamp}</span>
      </div>
    </div>
  )
}

export default MessageBubble
