"use client"
import React, { useState } from 'react'

type Props = {
  icon?: React.ReactNode
  placeholder?: string
  value: string
  onChange: (v: string) => void
  className?: string
  type?: "text" | "password" | "email"
  autoComplete?: string
  disabled?: boolean
}

const Input = ({
  icon,
  placeholder,
  value,
  onChange,
  className = '',
  type = "text",
  autoComplete,
  disabled = false,
}: Props) => {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 bg-card border rounded-[8px] transition-colors ${
        focused && !disabled ? 'border-fg-muted' : 'border-border'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && <span className="text-fg-subtle text-[14px] inline-flex">{icon}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="bg-transparent outline-none flex-1 text-[12px] text-fg placeholder:text-fg-subtle min-w-0 disabled:cursor-not-allowed"
      />
    </div>
  )
}

export default Input
