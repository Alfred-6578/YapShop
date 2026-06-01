import React from 'react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatRelative } from '@/lib/utils/format'
import type { Conversation } from '@/lib/conversations/mockData'

type Props = {
  conversation: Conversation
  onClaim: () => void
  onResume: () => void
  onReassign: () => void
}

const Dot = ({ color }: { color: string }) => (
  <span
    aria-hidden
    className="inline-block h-[7px] w-[7px] rounded-full"
    style={{ backgroundColor: color }}
  />
)

const ConversationHandoffCard = ({ conversation, onClaim, onResume, onReassign }: Props) => {
  const { handoff_status, handoff_reason, handoff_requested_at, assigned_staff_name } = conversation

  const meta =
    handoff_status === 'none' ? undefined : (
      <StatusBadge status={handoff_status} />
    )

  return (
    <Card>
      <CardHeader title="Handoff" meta={meta} />
      <div className="mt-2 flex flex-col gap-2">
        {handoff_status === 'none' && (
          <>
            <p className="text-[11.5px] text-fg-muted">AI is handling this conversation</p>
            <Button onClick={onClaim} className="w-full justify-center">
              Start handoff
            </Button>
          </>
        )}

        {handoff_status === 'requested' && (
          <>
            <div className="flex items-center gap-1.5 text-[11.5px] text-[#F0C36B]">
              <Dot color="#F0A92B" />
              <span>
                Requested {handoff_requested_at ? formatRelative(handoff_requested_at) : ''}
              </span>
            </div>
            {handoff_reason && (
              <p className="text-[10.5px] text-fg-muted leading-snug">
                <span className="text-[#C5CAD0] font-medium">Reason: </span>
                {handoff_reason}
              </p>
            )}
            <Button variant="primary" onClick={onClaim} className="w-full justify-center">
              Claim this handoff
            </Button>
          </>
        )}

        {handoff_status === 'active' && (
          <>
            <div className="flex items-center gap-1.5 text-[11.5px] text-[#6FD9A0]">
              <Dot color="#15C26A" />
              <span>{assigned_staff_name ?? 'Staff'} is handling</span>
            </div>
            {handoff_requested_at && (
              <p className="text-[10.5px] text-fg-muted">
                Since {formatRelative(handoff_requested_at)}
              </p>
            )}
            <Button onClick={onReassign} className="w-full justify-center">
              Reassign to me
            </Button>
            <Button onClick={onResume} className="w-full justify-center">
              Resume AI
            </Button>
          </>
        )}

        {handoff_status === 'resolved' && (
          <p className="text-[11.5px] text-fg-muted">Resolved — back to AI</p>
        )}

        {(handoff_status === 'cancelled' || handoff_status === 'pending') && (
          <p className="text-[11.5px] text-fg-muted">Handoff {handoff_status}</p>
        )}
      </div>
    </Card>
  )
}

export default ConversationHandoffCard
