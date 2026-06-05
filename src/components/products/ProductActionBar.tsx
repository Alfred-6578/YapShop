"use client"
import Link from "next/link"
import { HiEllipsisHorizontal, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2"

import type { ProductResponse, StaffResponse } from "@/lib/api/types"
import { canDeleteProduct, canEditProduct } from "@/lib/products/permissions"

type Props = {
  product: ProductResponse
  /** Drives visibility of Edit + Delete buttons. */
  currentUser: StaffResponse | null
  onDelete: () => void
  isDeleting?: boolean
}

const ProductActionBar = ({
  product,
  currentUser,
  onDelete,
  isDeleting = false,
}: Props) => {
  const showEdit = canEditProduct(currentUser)
  const showDelete = canDeleteProduct(currentUser)
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <nav
        aria-label="Breadcrumb"
        className="text-[12px] flex-1 min-w-0 truncate"
      >
        <Link
          href="/products"
          className="text-fg-muted hover:text-fg transition-colors"
        >
          Products
        </Link>
        <span className="text-fg-subtle mx-1.5">/</span>
        <span className="text-fg font-medium">{product.name}</span>
      </nav>

      <button
        type="button"
        aria-label="More actions"
        className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
      >
        <HiEllipsisHorizontal size={16} />
      </button>

      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete product"
          className="h-8 shrink-0 inline-flex items-center justify-center gap-1.5 px-2 vsm:px-3 py-2 rounded-[8px] text-[12.5px] font-medium bg-transparent border border-border text-[#F09595] hover:bg-[rgba(226,75,74,0.08)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <HiOutlineTrash size={14} />
          <span className="hidden vsm:inline">Delete</span>
        </button>
      )}

      {showEdit && (
        <Link
          href={`/products/${product.id}/edit`}
          aria-label="Edit product"
          className="h-8 shrink-0 inline-flex items-center justify-center gap-1.5 px-2 vsm:px-3 py-2 rounded-[8px] text-[12.5px] font-medium bg-accent text-accent-fg hover:bg-accent-hover cursor-pointer"
        >
          <HiOutlinePencilSquare size={14} />
          <span className="hidden vsm:inline">Edit</span>
        </Link>
      )}
    </div>
  )
}

export default ProductActionBar
