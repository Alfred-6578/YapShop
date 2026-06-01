"use client"
import React, { useState, KeyboardEvent } from 'react'

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

const TagsInput = ({ value, onChange, placeholder }: Props) => {
  const [draft, setDraft] = useState('')

  const commit = (raw: string) => {
    const t = raw.trim().toLowerCase()
    if (!t) return
    if (value.includes(t)) return
    onChange([...value, t])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (draft) {
        commit(draft)
        setDraft('')
      }
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="bg-bg border border-border rounded-[8px] px-2 py-1.5 flex flex-wrap items-center gap-1">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-[5px] bg-accent-muted text-[#6FD9A0]"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            aria-label={`Remove ${tag}`}
            className="text-[#6FD9A0]/80 hover:text-[#6FD9A0] cursor-pointer leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[60px] bg-transparent outline-none text-fg text-[12px] placeholder:text-fg-subtle py-0.5"
      />
    </div>
  )
}

export default TagsInput
