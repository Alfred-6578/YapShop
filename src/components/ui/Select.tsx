"use client"
import React from 'react'
import { HiChevronDown } from 'react-icons/hi2'

type Option = { value: string; label: string }

type Props = {
  options: Option[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

const Select = ({ options, value, onChange, placeholder, className = '' }: Props) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-bg border border-border rounded-[8px] px-2.5 py-1.5 pr-7 text-[12px] text-fg cursor-pointer outline-none focus:border-accent"
      >
        {placeholder && (
          <option value="" disabled hidden={value !== ''}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <HiChevronDown
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none"
      />
    </div>
  )
}

export default Select
