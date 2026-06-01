"use client"
import React, { useEffect, useMemo, useState } from "react"
import { HiPlus } from "react-icons/hi2"

import Button from "@/components/ui/Button"
import PageHeader from "@/components/products/PageHeader"
import FilterBar, { type ProductStatusFilter } from "@/components/products/FilterBar"
import ProductsTable from "@/components/products/ProductsTable"
import Pagination from "@/components/ui/Pagination"
import { MOCK_PRODUCTS } from "@/lib/products/mockData"

const PAGE_SIZE = 10

const NoMatches = () => (
  <div className="py-12 text-center text-[12px] text-fg-subtle">
    No products match your filters.
  </div>
)

const ProductsPage = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ProductStatusFilter>("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_PRODUCTS.filter((p) => {
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      const matchesStatus =
        status === "all" ||
        (status === "active" && p.is_active) ||
        (status === "inactive" && !p.is_active)
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
        title="Products"
        subtitle={`${filtered.length} products in your catalog`}
        action={
          <Button
            variant="primary"
            icon={<HiPlus size={14} />}
            href="/products/new"
          >
            New product
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />
      <ProductsTable products={paged} emptyState={<NoMatches />} />
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalItems={filtered.length}
        onPageChange={setPage}
      />
    </div>
  )
}

export default ProductsPage
