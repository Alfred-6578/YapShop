"use client"
import React from 'react'
import { HiOutlinePaperAirplane, HiOutlinePaperClip } from 'react-icons/hi2'

type Props = {
  disabled: boolean
  placeholder: string
  value: string
  onChange: (v: string) => void
  onSend: () => void
}

const ReplyInput = ({ disabled, placeholder, value, onChange, onSend }: Props) => {
  return (
    <div className="bg-card border border-border rounded-[10px] px-2.5 py-2 flex items-center gap-2">
      <HiOutlinePaperClip size={17} className="text-fg-subtle shrink-0" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled) {
            e.preventDefault()
            onSend()
          }
        }}
        className="flex-1 min-w-0 bg-transparent border-none outline-none text-fg text-[12.5px] placeholder:text-fg-subtle disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={() => {
          if (!disabled) onSend()
        }}
        disabled={disabled}
        aria-label="Send message"
        className={`h-7 w-7 inline-flex items-center justify-center bg-accent text-accent-fg rounded-[7px] ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-accent-hover'
        }`}
      >
        <HiOutlinePaperAirplane size={13} />
      </button>
    </div>
  )
}

export default ReplyInput
