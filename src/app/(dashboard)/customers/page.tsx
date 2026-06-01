'use client'

import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/products/PageHeader'
import CustomersFilterBar, { type CustomerStatusFilter, type CustomerSortKey } from '@/components/customers/CustomersFilterBar'
import CustomersList from '@/components/customers/CustomersList'
import Pagination from '@/components/ui/Pagination'
import { MOCK_CUSTOMERS, getLastActivityISO, getLifetimeValue } from '@/lib/customers/mockData'

const PAGE_SIZE = 6
const DORMANT_DAYS = 60

const CustomersPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CustomerStatusFilter>('all')
  const [sort, setSort] = useState<CustomerSortKey>('ltv')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const dormantCutoff = Date.now() - DORMANT_DAYS * 86_400_000
    return MOCK_CUSTOMERS.filter((c) => {
      if (q) {
        const inName = c.name.toLowerCase().includes(q)
        const inDisplay = (c.display_name ?? '').toLowerCase().includes(q)
        const inWa = c.whatsapp_number.includes(q)
        if (!inName && !inDisplay && !inWa) return false
      }
      const lastActivity = getLastActivityISO(c)
      const isActive = lastActivity ? new Date(lastActivity).getTime() >= dormantCutoff : false
      if (status === 'active' && !isActive) return false
      if (status === 'dormant' && isActive) return false
      return true
    })
  }, [search, status])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    if (sort === 'ltv') copy.sort((a, b) => getLifetimeValue(b) - getLifetimeValue(a))
    else if (sort === 'activity') copy.sort((a, b) => (getLastActivityISO(b) ?? '').localeCompare(getLastActivityISO(a) ?? ''))
    else if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name))
    return copy
  }, [filtered, sort])

  const paged = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page])

  useEffect(() => { setPage(1) }, [search, status, sort])

  const activeThisMonth = useMemo(() => {
    const monthCutoff = Date.now() - 30 * 86_400_000
    return MOCK_CUSTOMERS.filter((c) => {
      const last = getLastActivityISO(c)
      return last && new Date(last).getTime() >= monthCutoff
    }).length
  }, [])

  return (
    <div className="p-4 flex flex-col gap-3">
      <PageHeader title="Customers" subtitle={`${MOCK_CUSTOMERS.length} customers · ${activeThisMonth} active this month`} />
      <CustomersFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />
      <CustomersList
        customers={paged}
        emptyState={
          <div className="py-10 text-center text-[12px] text-fg-subtle">
            No customers match your filters.
          </div>
        }
      />
      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={sorted.length} onPageChange={setPage} />
    </div>
  )
}

export default CustomersPage
