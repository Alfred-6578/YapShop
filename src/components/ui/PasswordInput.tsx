'use client'

import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowPath } from 'react-icons/hi2'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  onRegenerate?: () => void
}

const PasswordInput = ({ value, onChange, placeholder, onRegenerate }: Props) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="bg-bg border border-border rounded-[8px] overflow-hidden flex items-stretch">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none text-fg text-[12.5px] px-2.5 py-1.5 font-mono tracking-wider"
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
        className="px-2.5 border-l border-border text-fg-subtle hover:text-fg cursor-pointer inline-flex items-center"
      >
        {visible ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}
      </button>
      {onRegenerate && (
        <button
          type="button"
          aria-label="Regenerate password"
          onClick={onRegenerate}
          className="px-2.5 border-l border-border text-[#6FD9A0] hover:text-[#8AE5B6] cursor-pointer inline-flex items-center"
        >
          <HiOutlineArrowPath size={14} />
        </button>
      )}
    </div>
  )
}

export default PasswordInput
