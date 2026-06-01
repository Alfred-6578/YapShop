import React from 'react'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'

type Props = {
  started_at: string
  conversation_type: string
  ai_enabled: boolean
  id: string
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const formatStarted = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  if (sameDay) return `Today, ${hh}:${mm}`
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${hh}:${mm}`
}

const shortId = (id: string): string => {
  if (id.length <= 9) return id
  return `${id.slice(0, 4)}…${id.slice(-4)}`
}

const ConversationMetaCard = ({ started_at, conversation_type, ai_enabled, id }: Props) => {
  return (
    <Card>
      <CardHeader title="Conversation" />
      <div className="mt-2">
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">Started</span>
          <span className="text-[#C5CAD0]">{formatStarted(started_at)}</span>
        </div>
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">Type</span>
          <span className="text-[#C5CAD0]">{conversation_type}</span>
        </div>
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">AI</span>
          <span className={ai_enabled ? 'text-[#8FB6F5]' : 'text-fg-subtle'}>
            {ai_enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="flex justify-between text-[11px] py-1">
          <span className="text-fg-muted">ID</span>
          <span className="font-mono text-[10px] text-[#C5CAD0]">{shortId(id)}</span>
        </div>
      </div>
    </Card>
  )
}

export default ConversationMetaCard
