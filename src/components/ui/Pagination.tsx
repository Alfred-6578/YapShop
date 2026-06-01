"use client"
import React from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

type Props = {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, pageSize, totalItems, onPageChange }: Props) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  const prevDisabled = page === 1
  const nextDisabled = page >= totalPages

  const arrowClass = (disabled: boolean) =>
    `h-[26px] w-[26px] bg-card border border-border rounded-[7px] flex items-center justify-center transition-colors ${
      disabled
        ? 'text-fg-subtle opacity-40 cursor-not-allowed'
        : 'text-fg-muted hover:text-fg cursor-pointer'
    }`

  return (
    <div className="flex items-center justify-between pt-1">
      <span className="text-[11px] text-fg-muted">
        Showing {from}–{to} of {totalItems}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
          className={arrowClass(prevDisabled)}
        >
          <HiChevronLeft size={14} />
        </button>
        <span className="text-[11px] text-fg-muted tnum">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
          className={arrowClass(nextDisabled)}
        >
          <HiChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
