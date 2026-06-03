"use client"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineCloud } from "react-icons/hi2"

import PageHeader from "@/components/products/PageHeader"
import Pagination from "@/components/ui/Pagination"
import OrdersFilterBar, { type OrderStatusFilter } from "@/components/orders/OrdersFilterBar"
import OrdersTable from "@/components/orders/OrdersTable"
import { listOrders } from "@/lib/api/orders"

const PAGE_SIZE = 8

const OrdersPage = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<OrderStatusFilter>("all")
  const [page, setPage] = useState(1)

  const { data: orders, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders", "list"],
    queryFn: listOrders,
    staleTime: 30_000,
  })

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = search.toLowerCase().trim()
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false
      if (q) {
        const inNumber = o.order_number.toLowerCase().includes(q)
        const inName = o.customer_name.toLowerCase().includes(q)
        const inWa = o.customer_whatsapp_number.includes(q)
        if (!inNumber && !inName && !inWa) return false
      }
      return true
    })
  }, [orders, search, status])

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  return (
    <div className="flex flex-col gap-3.5 p-4">
      <PageHeader
        title="Orders"
        subtitle={
          isLoading
            ? "Loading…"
            : `${filtered.length} order${filtered.length === 1 ? "" : "s"}`
        }
      />
      <OrdersFilterBar
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
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <>
          <OrdersTable
            orders={paged}
            emptyState={
              <div className="py-12 text-center text-[12px] text-fg-subtle">
                {filtered.length === 0 && (orders?.length ?? 0) === 0
                  ? "No orders yet. They'll appear here as customers place them through WhatsApp."
                  : "No orders match your filters."}
              </div>
            }
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

const LoadingState = () => (
  <div className="bg-card border border-border rounded-card overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-[100px_1fr_80px_90px_70px] gap-3 px-3.5 py-3 border-b border-white/[0.04] last:border-b-0"
      >
        <div className="h-3 bg-white/[0.05] rounded animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-2.5 w-24 bg-white/[0.03] rounded animate-pulse" />
        </div>
        <div className="h-3 bg-white/[0.04] rounded animate-pulse" />
        <div className="h-4 w-16 bg-white/[0.04] rounded animate-pulse" />
        <div className="h-2.5 w-12 bg-white/[0.03] rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const ErrorState = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => {
  const message = error instanceof Error ? error.message : "Couldn't load orders."
  return (
    <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
      <HiOutlineCloud size={28} className="text-[#F09595]" />
      <div className="text-[12.5px] text-fg text-center max-w-xs">{message}</div>
      <button
        type="button"
        onClick={onRetry}
        className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
      >
        Try again
      </button>
    </div>
  )
}

export default OrdersPage
