"use client"
import React from 'react'

type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  className?: string
}

const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  className = '',
}: Props<T>) => {
  return (
    <div
      className={`inline-flex bg-card border border-border rounded-[8px] p-0.5 text-[11.5px] ${className}`}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1 rounded-[6px] cursor-pointer transition-colors ${
              selected ? 'bg-card-hover text-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
