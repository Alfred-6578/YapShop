"use client"
import React, { useState } from 'react'
import { useParams } from 'next/navigation'

import AttentionBanner from '@/components/conversations/AttentionBanner'
import ConversationActionBar from '@/components/conversations/ConversationActionBar'
import ConversationCustomerCard from '@/components/conversations/ConversationCustomerCard'
import ConversationHandoffCard from '@/components/conversations/ConversationHandoffCard'
import ConversationMetaCard from '@/components/conversations/ConversationMetaCard'
import MessageThread from '@/components/conversations/MessageThread'
import ReplyInput from '@/components/conversations/ReplyInput'
import { formatRelative } from '@/lib/utils/format'
import { MOCK_CONVERSATIONS } from '@/lib/conversations/mockData'

const ConversationDetailPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>()
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId)

  const [draft, setDraft] = useState('')
  const [bannerDismissed, setBannerDismissed] = useState(false)

  if (!conversation) {
    return <div className="p-4 text-fg-muted text-[12px]">Conversation not found.</div>
  }

  const isEnded = conversation.status === 'ended'
  const replyEnabled = !isEnded && conversation.handoff_status === 'active'
  const showBanner =
    !bannerDismissed && conversation.handoff_status === 'requested' && !isEnded

  const placeholder = isEnded
    ? 'Conversation ended'
    : replyEnabled
      ? 'Type a reply…'
      : 'Take over to reply…'

  const escalatedAgo = conversation.handoff_requested_at
    ? formatRelative(conversation.handoff_requested_at)
    : ''

  return (
    <>
      <ConversationActionBar
        conversation={conversation}
        onTakeOver={() => console.log('take over', conversation.id)}
        onResumeAi={() => console.log('resume AI', conversation.id)}
      />
      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 items-start">
          <div className="flex flex-col gap-2.5 min-w-0">
            {showBanner && (
              <AttentionBanner
                text={`AI escalated this conversation ${escalatedAgo} — customer is waiting`}
                onDismiss={() => setBannerDismissed(true)}
              />
            )}
            <MessageThread messages={conversation.messages} />
            <ReplyInput
              disabled={!replyEnabled}
              placeholder={placeholder}
              value={draft}
              onChange={setDraft}
              onSend={() => {
                console.log('send', draft)
                setDraft('')
              }}
            />
          </div>
          <div className="flex flex-col gap-2.5 min-w-0">
            <ConversationCustomerCard
              customer_id={conversation.customer_id}
              customer_name={conversation.customer_name}
              customer_whatsapp={conversation.customer_whatsapp}
              customer_initials={conversation.customer_initials}
              customer_color={conversation.customer_color}
            />
            <ConversationHandoffCard
              conversation={conversation}
              onClaim={() => console.log('claim', conversation.id)}
              onResume={() => console.log('resume', conversation.id)}
              onReassign={() => console.log('reassign', conversation.id)}
            />
            <ConversationMetaCard
              started_at={conversation.started_at}
              conversation_type="AI knowledge base"
              ai_enabled={conversation.ai_enabled}
              id={conversation.id}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ConversationDetailPage
