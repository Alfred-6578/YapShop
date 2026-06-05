"use client"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineExclamationTriangle, HiPlus } from "react-icons/hi2"

import Button from "@/components/ui/Button"
import PageHeader from "@/components/products/PageHeader"
import FilterBar, { type ProductStatusFilter } from "@/components/products/FilterBar"
import ProductsTable from "@/components/products/ProductsTable"
import Pagination from "@/components/ui/Pagination"
import { listProducts, searchProducts } from "@/lib/api/products"
import { getCurrentStaff } from "@/lib/api/staff"
import { canCreateProduct } from "@/lib/products/permissions"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

const PAGE_SIZE = 6

const ProductsPage = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ProductStatusFilter>("all")
  const [page, setPage] = useState(1)

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })
  const canCreate = canCreateProduct(meQuery.data ?? null)

  const debouncedSearch = useDebouncedValue(search, 300)
  const trimmedSearch = debouncedSearch.trim()
  const isActiveFilter =
    status === "active" ? true : status === "inactive" ? false : undefined
  const hasFilters = trimmedSearch !== "" || isActiveFilter !== undefined

  const { data: products, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: hasFilters
      ? ["products", "search", { name: trimmedSearch || undefined, is_active: isActiveFilter }]
      : ["products", "list", { limit: 100 }],
    queryFn: () =>
      hasFilters
        ? searchProducts({
            name: trimmedSearch || undefined,
            is_active: isActiveFilter,
            limit: 100,
          })
        : listProducts({ skip: 0, limit: 100 }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })

  const filtered = useMemo(() => {
    if (!products) return []
    const q = trimmedSearch.toLowerCase()
    if (!q) return products
    // Server already matched by name; this catches SKU matches we'd otherwise miss.
    return products.filter((p) => {
      const inName = p.name.toLowerCase().includes(q)
      const inSku = (p.sku ?? "").toLowerCase().includes(q)
      return inName || inSku
    })
  }, [products, trimmedSearch])

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  return (
    <div className="p-4 flex flex-col gap-3.5">
      <PageHeader
        title="Products"
        subtitle={
          isLoading
            ? "Loading…"
            : `${filtered.length} product${filtered.length === 1 ? "" : "s"} in your catalog`
        }
        action={
          canCreate ? (
            <Button variant="primary" href="/products/new" icon={<HiPlus size={14} />}>
              New product
            </Button>
          ) : null
        }
      />
      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1) }}
      />

      {isFetching && !isLoading ? (
        <div className="-mt-2 text-[10.5px] text-fg-subtle flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Searching…
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <>
          <ProductsTable
            products={paged}
            emptyState={
              <div className="py-12 text-center text-[12px] text-fg-subtle">
                {filtered.length === 0 && (products?.length ?? 0) === 0
                  ? 'No products yet. Click "New product" to add your first one.'
                  : "No products match your filters."}
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

const LoadingState = () => {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.04] last:border-b-0"
        >
          <div className="w-9 h-9 rounded-[7px] bg-white/[0.04] animate-pulse" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
            <div className="h-2.5 w-20 bg-white/[0.03] rounded animate-pulse" />
          </div>
          <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}

const ErrorState = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => {
  const message = error instanceof Error ? error.message : "Couldn't load products."
  return (
    <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
      <HiOutlineExclamationTriangle size={28} className="text-[#F09595]" />
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

export default ProductsPage
