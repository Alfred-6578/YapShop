"use client"
import React from 'react'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label'?: string
}

const Toggle = ({ checked, onChange, ...rest }: Props) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={rest['aria-label']}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 h-[17px] w-[30px] rounded-full cursor-pointer transition-colors duration-150 ${
        checked ? 'bg-accent' : 'bg-[#2A2C32]'
      }`}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 h-[13px] w-[13px] rounded-full transition-all duration-150"
        style={{
          left: checked ? 15 : 2,
          background: checked ? 'var(--accent-fg)' : '#ECEEF0',
        }}
      />
    </button>
  )
}

export default Toggle
