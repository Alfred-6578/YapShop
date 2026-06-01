'use client'

import { HiMagnifyingGlass, HiChevronDown } from 'react-icons/hi2'
import Input from '@/components/ui/Input'
import SegmentedControl from '@/components/ui/SegmentedControl'

export type CustomerStatusFilter = 'all' | 'active' | 'dormant'
export type CustomerSortKey = 'ltv' | 'activity' | 'name'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: CustomerStatusFilter
  onStatusChange: (v: CustomerStatusFilter) => void
  sort: CustomerSortKey
  onSortChange: (v: CustomerSortKey) => void
}

const CustomersFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
}: Props) => {
  const sortLabel = sort === 'ltv' ? 'LTV' : sort === 'activity' ? 'Activity' : 'Name'

  return (
    <div className="flex flex-col vsm:flex-row vsm:items-center gap-2 vsm:gap-2.5">
      <Input
        className="vsm:flex-1"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name or WhatsApp number…"
        icon={<HiMagnifyingGlass size={14} />}
      />
      <div className="overflow-x-hidden vsm:overflow-x-auto -mx-4 px-4 vsm:mx-0 vsm:px-0 vsm:overflow-visible">
        <SegmentedControl<CustomerStatusFilter>
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'dormant', label: 'Dormant' },
          ]}
          value={status}
          onChange={onStatusChange}
        />
      </div>
      <button
        type="button"
        className="text-[11px] text-fg-muted bg-card border border-border rounded-[8px] px-2.5 py-1.5 flex items-center gap-1.5 cursor-default"
        title="Sort options (v1: static)"
      >
        Sort by <b className="text-fg font-medium">{sortLabel}</b>
        <HiChevronDown size={12} />
      </button>
    </div>
  )
}

export default CustomersFilterBar
