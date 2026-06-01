import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import { LiaHeadsetSolid } from 'react-icons/lia'

type Props = {
  count: number
  longestWait: string
  onClick?: () => void
  className?: string
}

const HandoffAlertBanner = ({ count, longestWait, onClick, className = '' }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-card border border-status-pending/30 bg-status-pending/10 hover:bg-status-pending/15 text-left cursor-pointer ${className}`}
    >
      <span className="h-10 w-10 rounded-control bg-status-pending/25 text-status-pending flex items-center justify-center shrink-0">
        <LiaHeadsetSolid size={20} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-fg font-semibold leading-tight">
          {count} chats waiting for a human
        </span>
        <span className="block text-xs text-fg-muted leading-tight mt-0.5">
          longest wait {longestWait}
        </span>
      </span>
      <FaChevronRight size={14} className="text-fg-muted shrink-0" />
    </button>
  )
}

export default HandoffAlertBanner
