"use client"
import React from 'react'
import { HiPencilSquare } from 'react-icons/hi2'

import Card from '@/components/ui/Card'
import StatusBadge from '@/components/ui/StatusBadge'
import Thumbnail from '@/components/ui/Thumbnail'

export interface Product {
  id: string
  name: string
  sku: string
  tags: string[]
  price: number
  is_active: boolean
  thumbnail_color: string
  initials: string
}

type Props = {
  products: Product[]
  onEdit?: (product: Product) => void
  emptyState?: React.ReactNode
}

const GRID =
  'grid-cols-[36px_minmax(0,1fr)_max-content_max-content_20px] gap-2 px-3 ' +
  'vsm:grid-cols-[36px_minmax(0,1fr)_130px_76px_64px_24px] vsm:gap-3 vsm:px-3.5'

const ProductsTable = ({ products, onEdit, emptyState }: Props) => {
  return (
    <Card padded={false}>
      <div className={`grid ${GRID} pt-2 pb-2 text-[10px] text-fg-subtle uppercase tracking-wide`}>
        <span className="col-span-2">Product</span>
        <span className="hidden vsm:inline">Tags</span>
        <span className="text-right">Price</span>
        <span>Status</span>
        <span />
      </div>

      {products.length === 0 ? (
        emptyState ?? null
      ) : (
        products.map((p, i) => (
          <div
            key={p.id}
            className={`grid ${GRID} items-center py-3 hover:bg-white/2 ${
              i === 0 ? '' : 'border-t border-white/4'
            }`}
          >
            <Thumbnail initials={p.initials} color={p.thumbnail_color} />

            <div className="min-w-0">
              <div className="text-[12.5px] text-fg truncate">{p.name}</div>
              <div className="font-mono text-[10.5px] text-fg-subtle truncate">{p.sku}</div>
            </div>

            <div className="hidden vsm:flex items-center gap-1 min-w-0">
              {p.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-white/5 text-fg-muted truncate"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              className={`text-right tnum text-[12.5px] font-medium ${
                p.is_active ? 'text-fg' : 'text-fg-subtle'
              }`}
            >
              {p.price.toLocaleString()}
            </div>

            <div>
              <StatusBadge status={p.is_active ? 'active' : 'inactive'} />
            </div>

            <button
              type="button"
              onClick={() => onEdit?.(p)}
              aria-label={`Edit ${p.name}`}
              className="text-fg-subtle hover:text-fg cursor-pointer inline-flex items-center justify-center"
            >
              <HiPencilSquare size={14} />
            </button>
          </div>
        ))
      )}
    </Card>
  )
}

export default ProductsTable
