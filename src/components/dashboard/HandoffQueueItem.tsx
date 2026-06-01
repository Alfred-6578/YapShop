import React from 'react'
import Avatar from '@/components/ui/Avatar'

type Props = {
  name: string
  waited: string
  active?: boolean
  onClick?: () => void
}

const HandoffQueueItem = ({ name, waited, active, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-control text-left transition-colors ${
        active ? 'bg-card-hover' : 'hover:bg-card-hover'
      }`}
    >
      <Avatar name={name} size="sm" />
      <span className="flex-1 text-sm text-fg truncate">{name}</span>
      <span className="text-xs text-fg-muted tnum">{waited}</span>
    </button>
  )
}

export default HandoffQueueItem
