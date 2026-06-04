"use client"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineCloud } from "react-icons/hi2"

import PageHeader from "@/components/products/PageHeader"
import Pagination from "@/components/ui/Pagination"
import ConversationsFilterBar, {
  type ConversationStatusFilter,
} from "@/components/conversations/ConversationsFilterBar"
import ConversationsList from "@/components/conversations/ConversationsList"
import {
  type ConversationFilterParams,
  listConversationsFiltered,
} from "@/lib/api/conversations"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

const PAGE_SIZE = 12

const ConversationsPage = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ConversationStatusFilter>("all")
  const [needsAttention, setNeedsAttention] = useState(false)
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedValue(search, 300)

  // Server-side filter args
  const filterParams = useMemo<ConversationFilterParams>(() => {
    const params: ConversationFilterParams = {
      page,
      page_size: PAGE_SIZE,
    }
    if (status === "active") params.status = "active"
    if (status === "ended") params.status = "ended"
    if (needsAttention) params.handoff_status = "requested"
    return params
  }, [status, needsAttention, page])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["conversations", "filter", filterParams],
    queryFn: () => listConversationsFiltered(filterParams),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  })

  // Client-side text search over the current page only — server lacks a
  // text-search param, so this gates the rendered set after the page fetch.
  const visible = useMemo(() => {
    if (!data) return []
    const q = debouncedSearch.toLowerCase().trim()
    if (!q) return data.items
    return data.items.filter((c) => {
      const name = (c.customer_name ?? "").toLowerCase()
      const wa = c.customer_whatsapp_number ?? ""
      return name.includes(q) || wa.includes(q)
    })
  }, [data, debouncedSearch])

  return (
    <div className="p-4 flex flex-col gap-3.5">
      <PageHeader
        title="Conversations"
        subtitle={
          isLoading
            ? "Loading…"
            : data
              ? `${data.total} conversation${data.total === 1 ? "" : "s"}`
              : ""
        }
      />
      <ConversationsFilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v)
          setPage(1)
        }}
        needsAttention={needsAttention}
        onNeedsAttentionChange={(v) => {
          setNeedsAttention(v)
          setPage(1)
        }}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <ConversationsList
            conversations={visible}
            emptyState={
              <div className="py-10 text-center text-[12px] text-fg-subtle">
                {(data?.items.length ?? 0) === 0
                  ? "No conversations yet."
                  : "No conversations match your filters."}
              </div>
            }
          />
          {data && (
            <Pagination
              page={page}
              pageSize={data.page_size}
              totalItems={data.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

const LoadingState = () => (
  <div className="bg-card border border-border rounded-card overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 px-3.5 py-3 border-b border-white/4 last:border-b-0"
      >
        <div className="w-10 h-10 rounded-full bg-white/4 animate-pulse" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
          <div className="h-2.5 w-48 bg-white/3 rounded animate-pulse" />
        </div>
        <div className="h-2.5 w-12 bg-white/3 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
    <HiOutlineCloud size={28} className="text-[#F09595]" />
    <div className="text-[12.5px] text-fg">Couldn&apos;t load conversations.</div>
    <button
      type="button"
      onClick={onRetry}
      className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
    >
      Try again
    </button>
  </div>
)

export default ConversationsPage
