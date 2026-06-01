"use client"
import React, { useState } from 'react'

type Props = {
  icon?: React.ReactNode
  placeholder?: string
  value: string
  onChange: (v: string) => void
  className?: string
}

const Input = ({ icon, placeholder, value, onChange, className = '' }: Props) => {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 bg-card border rounded-[8px] transition-colors ${
        focused ? 'border-fg-muted' : 'border-border'
      } ${className}`}
    >
      {icon && <span className="text-fg-subtle text-[14px] inline-flex">{icon}</span>}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="bg-transparent outline-none flex-1 text-[12px] text-fg placeholder:text-fg-subtle min-w-0"
      />
    </div>
  )
}

export default Input
