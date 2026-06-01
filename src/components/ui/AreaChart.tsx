import React, { useId } from 'react'

type Props = {
  points: number[]
  color?: string
  xLabels?: string[]
  height?: number
  className?: string
}

const AreaChart = ({
  points,
  color = 'var(--accent)',
  xLabels,
  height = 160,
  className = '',
}: Props) => {
  const gradId = useId()
  const w = 600
  const h = height
  const padY = 12
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = max - min || 1
  const step = points.length > 1 ? w / (points.length - 1) : 0

  const coords = points.map((v, i) => {
    const x = i * step
    const y = h - padY - ((v - min) / range) * (h - padY * 2)
    return [x, y] as const
  })

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

  const areaPath = `${linePath} L${w},${h} L0,${h} Z`

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {xLabels && xLabels.length > 0 && (
        <div className="flex justify-between mt-2 text-xs text-fg-muted">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default AreaChart
