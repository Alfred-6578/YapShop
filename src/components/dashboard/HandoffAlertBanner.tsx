"use client"
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { FaChevronRight } from 'react-icons/fa6'
import { LiaHeadsetSolid } from 'react-icons/lia'

import { listHandoffs } from '@/lib/api/handoffs'

type Props = {
  className?: string
}

const formatWait = (iso: string | undefined | null): string => {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 60_000) return '<1m'
  const mins = Math.floor(ms / 60_000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`
}

const HandoffAlertBanner = ({ className = '' }: Props) => {
  // Shares cache key with RailHandoffQueue and useDashboardStats — one
  // fetch covers all three dashboard consumers on a mobile view.
  const { data, isLoading } = useQuery({
    queryKey: ['handoffs', 'list', { status: 'pending' }],
    queryFn: () => listHandoffs({ status: 'pending' }),
    staleTime: 30_000,
  })

  const pending = (data ?? []).filter((h) => h.status === 'pending')
  const count = pending.length

  // Hide the banner entirely when nothing's pending — operators don't need
  // to see a "0 chats waiting" notification on a calm morning.
  if (isLoading || count === 0) return null

  // Longest wait = the oldest requested_at among pending handoffs.
  const oldest = pending.reduce(
    (acc: string | null, h) => {
      const ts = h.requested_at ?? h.created_at
      if (!acc) return ts
      return ts < acc ? ts : acc
    },
    null,
  )

  return (
    <Link
      href="/handoffs"
      className={`w-full flex items-center gap-3 p-3 rounded-card border border-status-pending/30 bg-status-pending/10 hover:bg-status-pending/15 text-left cursor-pointer ${className}`}
    >
      <span className="h-10 w-10 rounded-control bg-status-pending/25 text-status-pending flex items-center justify-center shrink-0">
        <LiaHeadsetSolid size={20} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-fg font-semibold leading-tight">
          {count} chat{count === 1 ? '' : 's'} waiting for a human
        </span>
        <span className="block text-xs text-fg-muted leading-tight mt-0.5">
          longest wait {formatWait(oldest)}
        </span>
      </span>
      <FaChevronRight size={14} className="text-fg-muted shrink-0" />
    </Link>
  )
}

export default HandoffAlertBanner
