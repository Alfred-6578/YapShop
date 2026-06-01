"use client"
import React, { useEffect, useMemo, useState } from 'react'

import PageHeader from '@/components/products/PageHeader'
import Pagination from '@/components/ui/Pagination'
import OrdersFilterBar, { type OrderStatusFilter } from '@/components/orders/OrdersFilterBar'
import OrdersTable from '@/components/orders/OrdersTable'
import { MOCK_ORDERS } from '@/lib/orders/mockData'

const PAGE_SIZE = 10

const NoMatches = () => (
  <div className="py-12 text-center text-[12px] text-fg-subtle">
    No orders match your filters.
  </div>
)

const OrdersPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrderStatusFilter>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_ORDERS.filter((o) => {
      const matchesSearch =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q)
      const matchesStatus = status === 'all' || o.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  useEffect(() => {
    setPage(1)
  }, [search, status])

  return (
    <div className="flex flex-col gap-3.5 p-4">
      <PageHeader
        title="Orders"
        subtitle={`${MOCK_ORDERS.length} orders this week`}
      />
      <OrdersFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />
      <OrdersTable orders={paged} emptyState={<NoMatches />} />
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalItems={filtered.length}
        onPageChange={setPage}
      />
    </div>
  )
}

export default OrdersPage
