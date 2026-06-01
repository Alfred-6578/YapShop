"use client"
import React, { useEffect, useMemo, useState } from 'react'

import PageHeader from '@/components/products/PageHeader'
import Pagination from '@/components/ui/Pagination'
import ConversationsFilterBar, {
  type ConversationStatusFilter,
} from '@/components/conversations/ConversationsFilterBar'
import ConversationsList from '@/components/conversations/ConversationsList'
import { MOCK_CONVERSATIONS } from '@/lib/conversations/mockData'

const PAGE_SIZE = 6

const NoMatches = () => (
  <div className="py-12 text-center text-[12px] text-fg-subtle">
    No conversations match your filters.
  </div>
)

const ConversationsPage = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ConversationStatusFilter>('all')
  const [page, setPage] = useState(1)

  const attentionCount = useMemo(
    () => MOCK_CONVERSATIONS.filter((c) => c.handoff_status === 'requested').length,
    [],
  )

  const activeCount = useMemo(
    () => MOCK_CONVERSATIONS.filter((c) => c.status === 'active').length,
    [],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_CONVERSATIONS.filter((c) => {
      const matchesSearch =
        !q ||
        c.customer_name.toLowerCase().includes(q) ||
        c.customer_whatsapp.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'attention'
            ? c.handoff_status === 'requested'
            : statusFilter === 'with-staff'
              ? c.handoff_status === 'active'
              : statusFilter === 'ai-only'
                ? c.status === 'active' &&
                  (c.handoff_status === 'none' ||
                    c.handoff_status === 'resolved' ||
                    c.handoff_status === 'cancelled')
                : statusFilter === 'ended'
                  ? c.status === 'ended'
                  : true
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  return (
    <div className="flex flex-col gap-3.5 p-4">
      <PageHeader
        title="Conversations"
        subtitle={`${MOCK_CONVERSATIONS.length} conversations · ${activeCount} active right now`}
      />
      <ConversationsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        attentionCount={attentionCount}
      />
      <ConversationsList conversations={paged} emptyState={<NoMatches />} />
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalItems={filtered.length}
        onPageChange={setPage}
      />
    </div>
  )
}

export default ConversationsPage
