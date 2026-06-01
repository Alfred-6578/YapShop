"use client"
import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'

import Input from '@/components/ui/Input'
import SegmentedControl from '@/components/ui/SegmentedControl'

export type ProductStatusFilter = 'all' | 'active' | 'inactive'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: ProductStatusFilter
  onStatusChange: (v: ProductStatusFilter) => void
}

const STATUS_OPTIONS: { value: ProductStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const FilterBar = ({ search, onSearchChange, status, onStatusChange }: Props) => {
  return (
    <div className="flex flex-col vsm:flex-row vsm:items-center gap-2 vsm:gap-2.5">
      <Input
        className="vsm:flex-1"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name or SKU…"
        icon={<HiMagnifyingGlass size={14} />}
      />
      <SegmentedControl
        className="self-start vsm:self-auto"
        options={STATUS_OPTIONS}
        value={status}
        onChange={onStatusChange}
      />
    </div>
  )
}

export default FilterBar
