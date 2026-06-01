'use client'

import { useMemo, useState } from 'react'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/products/PageHeader'
import StaffFilterBar, { type StaffStatusFilter } from '@/components/staff/StaffFilterBar'
import StaffList from '@/components/staff/StaffList'
import { MOCK_STAFF, CURRENT_USER_ID } from '@/lib/staff/mockData'

const StaffPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StaffStatusFilter>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return MOCK_STAFF.filter((s) => {
      if (status === 'active' && !s.is_active) return false
      if (status === 'inactive' && s.is_active) return false
      if (q) {
        return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      }
      return true
    })
  }, [search, status])

  const activeCount = MOCK_STAFF.filter((s) => s.is_active).length

  return (
    <div className="p-4 flex flex-col gap-3.5">
      <PageHeader
        title="Staff"
        subtitle={`${MOCK_STAFF.length} team members · ${activeCount} active`}
        action={
          <Button variant="primary" href="/staff/new" icon={<HiOutlineUserPlus size={14} />}>
            Invite staff
          </Button>
        }
      />
      <StaffFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />
      <StaffList
        staff={filtered}
        currentUserId={CURRENT_USER_ID}
        emptyState={
          <div className="py-10 text-center text-[12px] text-fg-subtle">
            No team members match your filters.
          </div>
        }
      />
    </div>
  )
}

export default StaffPage
