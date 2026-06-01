'use client'

import { useMemo, useState } from 'react'
import { HiOutlineHandRaised } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import HandoffsStats from '@/components/handoffs/HandoffsStats'
import HandoffsTabs, { type HandoffTab } from '@/components/handoffs/HandoffsTabs'
import HandoffsList from '@/components/handoffs/HandoffsList'
import {
  MOCK_HANDOFFS,
  getPending,
  getActive,
  getResolved,
  getResolvedToday,
  averageWaitMinutes,
} from '@/lib/handoffs/mockData'
import { formatDuration } from '@/lib/utils/format'

const HandoffsPage = () => {
  const [tab, setTab] = useState<HandoffTab>('pending')
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set())

  const visibleHandoffs = useMemo(
    () => MOCK_HANDOFFS.filter((h) => !claimedIds.has(h.id)),
    [claimedIds],
  )

  const pending  = useMemo(() => getPending(visibleHandoffs),  [visibleHandoffs])
  const active   = useMemo(() => getActive(visibleHandoffs),   [visibleHandoffs])
  const resolved = useMemo(() => getResolved(visibleHandoffs), [visibleHandoffs])

  const resolvedTodayCount = useMemo(
    () => getResolvedToday(visibleHandoffs).length,
    [visibleHandoffs],
  )

  const avgWait = useMemo(() => averageWaitMinutes(visibleHandoffs), [visibleHandoffs])

  const avgHandling = useMemo(() => {
    const today = getResolvedToday(visibleHandoffs)
    if (today.length === 0) return 0
    const sum = today.reduce((acc, h) => {
      if (!h.claimed_at || !h.resolved_at) return acc
      return acc + (new Date(h.resolved_at).getTime() - new Date(h.claimed_at).getTime()) / 60000
    }, 0)
    return Math.round(sum / today.length)
  }, [visibleHandoffs])

  const handleClaim = (id: string) => {
    console.log('claim', id)
    setClaimedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const handleClaimNext = () => {
    if (pending.length === 0) return
    handleClaim(pending[0].id)
  }

  const subtitle =
    pending.length === 0
      ? 'All caught up'
      : `${pending.length} customer${pending.length === 1 ? '' : 's'} waiting · oldest ${formatDuration(pending[0].requested_at)}`

  const list = tab === 'pending' ? pending : tab === 'active' ? active : resolved

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-medium tracking-tight">Handoffs</h1>
          <p className="text-[11.5px] text-fg-muted mt-0.5">{subtitle}</p>
        </div>
        <Button
          variant="primary"
          icon={<HiOutlineHandRaised size={14} />}
          onClick={handleClaimNext}
          disabled={pending.length === 0}
        >
          Claim next
        </Button>
      </div>

      <HandoffsStats
        pendingCount={pending.length}
        activeCount={active.length}
        resolvedTodayCount={resolvedTodayCount}
        avgHandlingMinutes={avgHandling}
        avgWaitMinutes={avgWait}
      />

      <HandoffsTabs
        value={tab}
        onChange={setTab}
        pendingCount={pending.length}
        activeCount={active.length}
      />

      <HandoffsList handoffs={list} mode={tab} onClaim={handleClaim} />
    </div>
  )
}

export default HandoffsPage
