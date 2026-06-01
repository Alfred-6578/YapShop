"use client"
import React, { useState } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

const Textarea = ({ value, onChange, placeholder, rows = 3, className = '' }: Props) => {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`bg-bg border rounded-[8px] px-2.5 py-2 text-[12px] text-fg placeholder:text-fg-subtle min-h-[64px] resize-none w-full leading-snug outline-none transition-colors ${
        focused ? 'border-accent' : 'border-border'
      } ${className}`}
    />
  )
}

export default Textarea
