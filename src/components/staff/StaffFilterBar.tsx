'use client'

import { HiMagnifyingGlass } from 'react-icons/hi2'
import Input from '@/components/ui/Input'
import SegmentedControl from '@/components/ui/SegmentedControl'

export type StaffStatusFilter = 'all' | 'active' | 'inactive'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: StaffStatusFilter
  onStatusChange: (v: StaffStatusFilter) => void
}

const StaffFilterBar = ({ search, onSearchChange, status, onStatusChange }: Props) => {
  return (
    <div className="flex flex-col vsm:flex-row vsm:items-center gap-2 vsm:gap-2.5">
      <Input
        className="vsm:flex-1"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name or email…"
        icon={<HiMagnifyingGlass size={14} />}
      />
      <div className="overflow-x-hidden vsm:overflow-x-auto -mx-4 px-4 vsm:mx-0 vsm:px-0 vsm:overflow-visible">
        <SegmentedControl<StaffStatusFilter>
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          value={status}
          onChange={onStatusChange}
        />
      </div>
    </div>
  )
}

export default StaffFilterBar
