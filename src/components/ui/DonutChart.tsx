import React from 'react'

export type DonutSegment = {
  key: string
  value: number
  color: string
}

type Props = {
  segments: DonutSegment[]
  centerLabel?: string
  centerSub?: string
  size?: number
  thickness?: number
  className?: string
}

const DonutChart = ({
  segments,
  centerLabel,
  centerSub,
  size = 160,
  thickness = 18,
  className = '',
}: Props) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--card-hover)"
          strokeWidth={thickness}
        />
        {segments.map((seg) => {
          const length = (seg.value / total) * circumference
          const dasharray = `${length} ${circumference - length}`
          const dashoffset = -offset
          offset += length
          return (
            <circle
              key={seg.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && <span className="text-lg font-bold tnum">{centerLabel}</span>}
          {centerSub && <span className="text-xs text-fg-muted">{centerSub}</span>}
        </div>
      )}
    </div>
  )
}

export default DonutChart
