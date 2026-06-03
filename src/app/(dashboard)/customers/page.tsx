"use client"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineCloud } from "react-icons/hi2"

import PageHeader from "@/components/products/PageHeader"
import CustomersFilterBar, {
  type CustomerSortKey,
  type CustomerStatusFilter,
} from "@/components/customers/CustomersFilterBar"
import CustomersList from "@/components/customers/CustomersList"
import Pagination from "@/components/ui/Pagination"
import { listCustomers } from "@/lib/api/customers"
import { listOrders } from "@/lib/api/orders"
import { listConversations } from "@/lib/api/conversations"
import {
  getConversationsForCustomer,
  getLastActivityISO,
  getLifetimeValue,
  getOrdersForCustomer,
} from "@/lib/customers/utils"

const PAGE_SIZE = 6
const DORMANT_DAYS = 60
const CUSTOMER_LIMIT = 100

const CustomersPage = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<CustomerStatusFilter>("all")
  const [sort, setSort] = useState<CustomerSortKey>("ltv")
  const [page, setPage] = useState(1)

  const customersQuery = useQuery({
    queryKey: ["customers", "list", { limit: CUSTOMER_LIMIT }],
    queryFn: () => listCustomers({ skip: 0, limit: CUSTOMER_LIMIT }),
    staleTime: 30_000,
  })

  const ordersQuery = useQuery({
    queryKey: ["orders", "list"],
    queryFn: listOrders,
    staleTime: 30_000,
  })

  const conversationsQuery = useQuery({
    queryKey: ["conversations", "list"],
    queryFn: listConversations,
    staleTime: 30_000,
  })

  const customers = customersQuery.data ?? []
  const orders = ordersQuery.data ?? []
  const conversations = conversationsQuery.data ?? []

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const dormantCutoff = Date.now() - DORMANT_DAYS * 86_400_000

    return customers.filter((c) => {
      if (q) {
        const inName = (c.name ?? "").toLowerCase().includes(q)
        const inDisplay = (c.display_name ?? "").toLowerCase().includes(q)
        const inWa = c.whatsapp_number.includes(q)
        if (!inName && !inDisplay && !inWa) return false
      }
      if (status === "all") return true
      const custOrders = getOrdersForCustomer(c, orders)
      const custConvs = getConversationsForCustomer(c, conversations)
      const lastActivity = getLastActivityISO(custOrders, custConvs)
      const isActive = lastActivity
        ? new Date(lastActivity).getTime() >= dormantCutoff
        : false
      if (status === "active" && !isActive) return false
      if (status === "dormant" && isActive) return false
      return true
    })
  }, [customers, orders, conversations, search, status])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    if (sort === "ltv") {
      copy.sort((a, b) => {
        const la = getLifetimeValue(getOrdersForCustomer(a, orders))
        const lb = getLifetimeValue(getOrdersForCustomer(b, orders))
        return lb - la
      })
    } else if (sort === "activity") {
      copy.sort((a, b) => {
        const aIso =
          getLastActivityISO(
            getOrdersForCustomer(a, orders),
            getConversationsForCustomer(a, conversations),
          ) ?? ""
        const bIso =
          getLastActivityISO(
            getOrdersForCustomer(b, orders),
            getConversationsForCustomer(b, conversations),
          ) ?? ""
        return bIso.localeCompare(aIso)
      })
    } else if (sort === "name") {
      copy.sort((a, b) =>
        (a.name ?? a.whatsapp_number).localeCompare(b.name ?? b.whatsapp_number),
      )
    }
    return copy
  }, [filtered, sort, orders, conversations])

  const paged = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  )

  const activeThisMonth = useMemo(() => {
    const monthCutoff = Date.now() - 30 * 86_400_000
    return customers.filter((c) => {
      const custOrders = getOrdersForCustomer(c, orders)
      const custConvs = getConversationsForCustomer(c, conversations)
      const last = getLastActivityISO(custOrders, custConvs)
      return last && new Date(last).getTime() >= monthCutoff
    }).length
  }, [customers, orders, conversations])

  const isLoading = customersQuery.isLoading
  const isError = customersQuery.isError

  return (
    <div className="p-4 flex flex-col gap-3">
      <PageHeader
        title="Customers"
        subtitle={
          isLoading
            ? "Loading…"
            : `${customers.length} customers · ${activeThisMonth} active this month`
        }
      />
      <CustomersFilterBar
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
        sort={sort}
        onSortChange={(v) => {
          setSort(v)
          setPage(1)
        }}
      />
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => customersQuery.refetch()} />
      ) : (
        <>
          <CustomersList
            customers={paged}
            allOrders={orders}
            allConversations={conversations}
            emptyState={
              <div className="py-10 text-center text-[12px] text-fg-subtle">
                {customers.length === 0
                  ? "No customers yet. They'll appear here when they message your WhatsApp."
                  : "No customers match your filters."}
              </div>
            }
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={sorted.length}
            onPageChange={setPage}
          />
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
        className="grid grid-cols-[40px_1fr_auto] gap-3 px-3.5 py-3 border-b border-white/4 last:border-b-0 items-center"
      >
        <div className="w-10 h-10 rounded-full bg-white/4 animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
          <div className="h-2.5 w-40 bg-white/3 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="h-3 w-16 bg-white/4 rounded animate-pulse" />
          <div className="h-2.5 w-12 bg-white/3 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
    <HiOutlineCloud size={28} className="text-[#F09595]" />
    <div className="text-[12.5px] text-fg">Couldn&apos;t load customers.</div>
    <button
      type="button"
      onClick={onRetry}
      className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
    >
      Try again
    </button>
  </div>
)

export default CustomersPage
