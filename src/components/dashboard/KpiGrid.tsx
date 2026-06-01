import React from 'react'
import KpiCard from './KpiCard'

type Stat = {
  label: string
  shortLabel?: string
  value: string
  delta?: string
  shortDelta?: string
  trend?: number[]
  icon?: React.ReactNode
  featured?: boolean
}

type Props = {
  stats: Stat[]
}

const KpiGrid = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <KpiCard key={s.label} {...s} />
      ))}
    </div>
  )
}

export default KpiGrid
