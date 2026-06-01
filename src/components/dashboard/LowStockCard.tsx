"use client"
import React from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import ResponsiveTable, { Column } from '@/components/ui/ResponsiveTable'

export type LowStockRow = {
  id: string
  name: string
  variant: string
  qty: number
  threshold: number
}

type Props = {
  rows: LowStockRow[]
}

const severity = (qty: number, threshold: number) => {
  const ratio = qty / threshold
  if (ratio <= 0.25) return 'text-status-cancelled'
  if (ratio <= 0.5) return 'text-status-pending'
  return 'text-fg'
}

const LowStockCard = ({ rows }: Props) => {
  const columns: Column<LowStockRow>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (r) => (
        <div>
          <div className="text-fg">{r.name}</div>
          <div className="text-xs text-fg-muted">{r.variant}</div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      render: (r) => (
        <span className="tnum">
          <span className={`font-medium ${severity(r.qty, r.threshold)}`}>{r.qty}</span>
          <span className="text-fg-muted"> / {r.threshold}</span>
        </span>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader title="Low stock" meta={<span>{rows.length} items</span>} />
      <div className="mt-2">
        <ResponsiveTable columns={columns} data={rows} rowKey={(r) => r.id} />
      </div>
    </Card>
  )
}

export default LowStockCard
