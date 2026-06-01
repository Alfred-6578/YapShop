import React from 'react'

export type ActivityKind = 'payment' | 'order' | 'conversation' | 'stock'

type Props = {
  kind: ActivityKind
  title: React.ReactNode
  meta: string
}

const dotColor: Record<ActivityKind, string> = {
  payment: 'bg-status-paid',
  order: 'bg-status-shipped',
  conversation: 'bg-accent',
  stock: 'bg-status-pending',
}

const ActivityItem = ({ kind, title, meta }: Props) => {
  return (
    <li className="flex gap-3 px-3 py-2">
      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${dotColor[kind]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-fg leading-snug">{title}</p>
        <p className="text-xs text-fg-muted mt-0.5">{meta}</p>
      </div>
    </li>
  )
}

export default ActivityItem
