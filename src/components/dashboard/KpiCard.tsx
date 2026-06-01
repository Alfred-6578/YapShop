import React from 'react'
import { FaArrowUp } from 'react-icons/fa6'
import Sparkline from '@/components/ui/Sparkline'

type Props = {
  label: string
  shortLabel?: string
  value: string
  delta?: string
  shortDelta?: string
  trend?: number[]
  icon?: React.ReactNode
  featured?: boolean
}

const KpiCard = ({
  label,
  shortLabel,
  value,
  delta,
  shortDelta,
  trend,
  icon,
  featured = false,
}: Props) => {
  const surface = featured
    ? 'bg-accent text-accent-fg border-transparent'
    : 'bg-card border border-border-strong/80'
  const labelTone = featured ? 'text-accent-fg/80' : 'text-fg-muted'
  const deltaTone = featured ? 'text-accent-fg/90' : 'text-accent'

  const hasDelta = !!(delta || shortDelta)
  const hasTrend = !!trend && trend.length > 0

  return (
    <div className={`${surface} rounded-card p-4 cursor-pointer`}>
      <div className={`flex items-center gap-2 text-[15px] ${labelTone}`}>
        {icon}
        <h3 className="truncate">
          {shortLabel && <span className="md:hidden">{shortLabel}</span>}
          <span className={shortLabel ? 'hidden md:inline' : ''}>{label}</span>
        </h3>
      </div>
      <p className="text-2xl font-bold mt-2 tnum">{value}</p>
      {hasDelta && (
        <p className={`flex items-center gap-1 mt-1 text-sm ${deltaTone}`}>
          <FaArrowUp />
          {shortDelta && <span className="md:hidden">{shortDelta}</span>}
          <span className={shortDelta ? 'hidden md:inline' : ''}>{delta}</span>
        </p>
      )}
      {hasTrend && (
        <div className="mt-3 hidden md:block">
          <Sparkline data={trend} tone={featured ? 'dark' : 'green'} />
        </div>
      )}
    </div>
  )
}

export default KpiCard
