"use client"
import React from 'react'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { LiaHeadsetSolid, LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { PiChatCenteredText } from 'react-icons/pi'

import KpiGrid from './KpiGrid'
import { useDashboardStats } from '@/lib/dashboard'

/** Local currency formatter — mirrors the one in dashboard.ts. Promote to
 *  lib/format.ts when a third consumer needs it. */
function fmtNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`
  return `₦${n.toLocaleString()}`
}

const DashboardKpis = () => {
  const { stats, isLoading, isError } = useDashboardStats()

  // While loading, show em-dashes so the layout doesn't jump. Delta + trend
  // are omitted entirely — we don't have historical data per KPI yet (would
  // need a second time-bucketed orders query + per-card sparkline series).
  const placeholder = isLoading ? '—' : isError ? '!' : null

  // MOCK trend arrays — placeholders until per-KPI time series is wired.
  // Sparklines render so cards feel visually complete; numbers are real.
  const cards = [
    {
      label: 'Orders today',
      value: placeholder ?? String(stats.ordersToday),
      trend: [3, 5, 4, 6, 5, 8],
      icon: <HiOutlineShoppingCart />,
    },
    {
      label: 'Revenue (mo.)',
      value: placeholder ?? fmtNaira(stats.revenueMonth),
      trend: [4, 6, 5, 7, 6, 9],
      icon: <LiaMoneyBillWaveSolid />,
      featured: true,
    },
    {
      label: 'Active chats',
      value: placeholder ?? String(stats.activeChats),
      trend: [2, 3, 5, 4, 6, 7],
      icon: <PiChatCenteredText />,
    },
    {
      label: 'Pending handoffs',
      shortLabel: 'Handoffs',
      value: placeholder ?? String(stats.pendingHandoffs),
      trend: [1, 2, 3, 2, 4, 5],
      icon: <LiaHeadsetSolid />,
    },
  ]

  return <KpiGrid stats={cards} />
}

export default DashboardKpis
