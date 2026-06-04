"use client"
import React from "react"
import { HiMagnifyingGlass, HiOutlineExclamationCircle } from "react-icons/hi2"

import Input from "@/components/ui/Input"
import SegmentedControl from "@/components/ui/SegmentedControl"

/** Maps directly to ConversationStatus on the API ("active"/"ended"), plus
 *  "all" to skip the status query param. */
export type ConversationStatusFilter = "all" | "active" | "ended"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: ConversationStatusFilter
  onStatusChange: (v: ConversationStatusFilter) => void
  needsAttention: boolean
  onNeedsAttentionChange: (v: boolean) => void
}

const ConversationsFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  needsAttention,
  onNeedsAttentionChange,
}: Props) => {
  const options: { value: ConversationStatusFilter; label: React.ReactNode }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "ended", label: "Ended" },
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
        <SegmentedControl
          options={options}
          value={status}
          onChange={onStatusChange}
        />
      </div>
      <button
        type="button"
        onClick={() => onNeedsAttentionChange(!needsAttention)}
        className={`shrink-0 text-[11.5px] px-2.5 py-1.5 rounded-[8px] border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
          needsAttention
            ? "bg-[rgba(240,169,43,0.12)] border-[rgba(240,169,43,0.35)] text-[#F0C36B]"
            : "bg-card border-border text-fg-muted hover:text-fg"
        }`}
        aria-pressed={needsAttention}
      >
        <HiOutlineExclamationCircle size={12} />
        Needs attention
      </button>
    </div>
  )
}

export default ConversationsFilterBar
