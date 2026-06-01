import React from 'react'

type Props = {
  label: string
  value: string | number
  pct: number
  className?: string
}

const BarListRow = ({ label, value, pct, className = '' }: Props) => {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-fg">{label}</span>
        <span className="tnum text-fg">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-card-hover overflow-hidden">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

export default BarListRow
