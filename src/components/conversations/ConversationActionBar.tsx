"use client"
import React from 'react'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import { LiaHeadsetSolid } from 'react-icons/lia'

import Button from '@/components/ui/Button'
import type { Conversation } from '@/lib/conversations/mockData'

type Props = {
  conversation: Conversation
  onTakeOver: () => void
  onResumeAi: () => void
}

const ConversationActionBar = ({ conversation, onTakeOver, onResumeAi }: Props) => {
  const isEnded = conversation.status === 'ended'
  const isStaffActive = conversation.handoff_status === 'active'
  const isRequested = conversation.handoff_status === 'requested'

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <span className="text-[12px] text-fg-muted flex-1 truncate">
        Conversations /{' '}
        <b className="text-fg font-medium">{conversation.customer_name}</b>
      </span>

      <button
        type="button"
        aria-label="More actions"
        className="h-8 w-8 inline-flex items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
      >
        <HiEllipsisHorizontal size={16} />
      </button>

      {!isEnded && isStaffActive && (
        <Button onClick={onResumeAi}>Resume AI</Button>
      )}

      {!isEnded && isRequested && (
        <Button variant="primary" icon={<LiaHeadsetSolid size={14} />} onClick={onTakeOver}>
          Take over
        </Button>
      )}

      {!isEnded && !isRequested && (
        <Button
          variant={isStaffActive ? 'primary' : 'ghost'}
          onClick={onTakeOver}
        >
          Take over
        </Button>
      )}
    </div>
  )
}

export default ConversationActionBar
