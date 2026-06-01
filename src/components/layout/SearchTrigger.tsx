"use client"
import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'

type Props = {
  onClick?: () => void
  placeholder?: string
}

const SearchTrigger = ({ onClick, placeholder = 'Search…' }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full max-w-xs h-9 px-3 rounded-control bg-card border border-border-strong/80 text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer text-sm"
    >
      <HiMagnifyingGlass size={16} />
      <span>{placeholder}</span>
    </button>
  )
}

export default SearchTrigger
