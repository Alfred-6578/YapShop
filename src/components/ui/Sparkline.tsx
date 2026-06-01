import React from 'react'

type Variant = 'bars' | 'line'
type Tone = 'green' | 'dark'

type Props = {
  data: number[]
  variant?: Variant
  tone?: Tone
  highlightLast?: boolean
  className?: string
}

const tones: Record<Tone, { base: string; active: string; stroke: string }> = {
  green: {
    base: 'bg-accent-muted',
    active: 'bg-accent',
    stroke: 'var(--accent)',
  },
  dark: {
    base: 'bg-border-strong',
    active: 'bg-card-hover',
    stroke: 'var(--card-hover)',
  },
}

const Sparkline = ({
  data,
  variant = 'bars',
  tone = 'green',
  highlightLast = true,
  className = '',
}: Props) => {
  const { base, active, stroke } = tones[tone]

  if (variant === 'line') {
    const w = 120
    const h = 28
    const max = Math.max(...data, 1)
    const min = Math.min(...data, 0)
    const range = max - min || 1
    const step = data.length > 1 ? w / (data.length - 1) : 0
    const points = data
      .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
      .join(' ')
    return (
      <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    )
  }

  const max = Math.max(...data, 1)
  const maxH = 26
  const minH = 6
  return (
    <div className={`flex items-end gap-[3px] ${className}`}>
      {data.map((v, i) => {
        const isLast = i === data.length - 1
        const height = Math.round((v / max) * (maxH - minH)) + minH
        return (
          <div
            key={i}
            className={`w-5 rounded-[3px] ${highlightLast && isLast ? active : base}`}
            style={{ height: `${height}px` }}
          />
        )
      })}
    </div>
  )
}

export default Sparkline
