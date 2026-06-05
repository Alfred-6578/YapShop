"use client"
import { useMemo } from 'react'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import AreaChart from '@/components/ui/AreaChart'
import { useRevenueTrend } from '@/lib/dashboard'

/**
 * Day-of-week labels for the last 7 buckets of the trend. The chart's
 * x-axis can render labels at fixed positions; we slice the last 7 days'
 * weekday names so a 30-day series still shows readable labels at the end.
 */
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const RevenueTrendCard = () => {
  const { data, isLoading, isError } = useRevenueTrend(30)

  // Derive a comparison delta: sum of the last 7 days vs the 7 days before.
  // Skip when we don't have both windows populated.
  const { points, xLabels, delta } = useMemo(() => {
    const pts = data ?? []
    const amounts = pts.map((p) => p.amount)
    const xs = pts.slice(-7).map((p) => {
      const d = new Date(p.date)
      return WEEKDAY[d.getDay()] ?? ''
    })

    if (pts.length < 14) {
      return { points: amounts, xLabels: xs, delta: null as null | { pct: number; up: boolean } }
    }
    const last7 = amounts.slice(-7).reduce((a, b) => a + b, 0)
    const prev7 = amounts.slice(-14, -7).reduce((a, b) => a + b, 0)
    if (prev7 === 0) {
      return { points: amounts, xLabels: xs, delta: null }
    }
    const pct = Math.round(((last7 - prev7) / prev7) * 100)
    return { points: amounts, xLabels: xs, delta: { pct: Math.abs(pct), up: pct >= 0 } }
  }, [data])

  return (
    <Card>
      <CardHeader
        title="Revenue trend"
        meta={
          delta ? (
            <span
              className={`flex items-center gap-1 ${
                delta.up ? 'text-accent' : 'text-[#F09595]'
              }`}
            >
              {delta.up ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
              {delta.pct}%
            </span>
          ) : (
            <span className="text-fg-subtle text-[10.5px]">30d</span>
          )
        }
      />
      <div className="mt-4">
        {isLoading ? (
          <div className="h-40 bg-white/[0.03] rounded-card animate-pulse" />
        ) : isError ? (
          <div className="h-40 flex items-center justify-center text-[11.5px] text-[#F09595]">
            Couldn&apos;t load revenue.
          </div>
        ) : points.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-[11.5px] text-fg-subtle">
            No revenue in this period.
          </div>
        ) : (
          <AreaChart points={points} xLabels={xLabels} height={160} />
        )}
      </div>
    </Card>
  )
}

export default RevenueTrendCard
