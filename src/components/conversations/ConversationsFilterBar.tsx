"use client"
import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'

import Input from '@/components/ui/Input'
import SegmentedControl from '@/components/ui/SegmentedControl'

export type ConversationStatusFilter =
  | 'all'
  | 'attention'
  | 'with-staff'
  | 'ai-only'
  | 'ended'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: ConversationStatusFilter
  onStatusChange: (v: ConversationStatusFilter) => void
  attentionCount: number
}

const ConversationsFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  attentionCount,
}: Props) => {
  const options: { value: ConversationStatusFilter; label: React.ReactNode }[] = [
    { value: 'all', label: 'All' },
    {
      value: 'attention',
      label: (
        <>
          Needs attention
          <span className="text-[9.5px] bg-[rgba(240,169,43,0.22)] text-[#F0C36B] px-1.5 py-0 rounded-[4px] ml-1.5">
            {attentionCount}
          </span>
        </>
      ),
    },
    { value: 'with-staff', label: 'With staff' },
    { value: 'ai-only', label: 'AI only' },
    { value: 'ended', label: 'Ended' },
  ]

  return (
    <div className="flex flex-col vsm:flex-row vsm:items-center gap-2 vsm:gap-2.5">
      <Input
        className="vsm:flex-1"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by customer or phone…"
        icon={<HiMagnifyingGlass size={14} />}
      />
      <div className="overflow-x-hidden vsm:overflow-x-auto -mx-4 px-4 vsm:mx-0 vsm:px-0 vsm:overflow-visible">
        <SegmentedControl options={options} value={status} onChange={onStatusChange} />
      </div>
    </div>
  )
}

export default ConversationsFilterBar
