"use client"
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import ResponsiveTable, { Column } from '@/components/ui/ResponsiveTable'
import { useLowStock, type LowStockItem } from '@/lib/dashboard'

const severity = (qty: number, threshold: number) => {
  if (threshold === 0) return 'text-fg'
  const ratio = qty / threshold
  if (ratio <= 0.25) return 'text-status-cancelled'
  if (ratio <= 0.5) return 'text-status-pending'
  return 'text-fg'
}

const LowStockCard = () => {
  const { data, isLoading, isError } = useLowStock()

  const rows = data ?? []

  const columns: Column<LowStockItem>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (r) => (
        <div>
          <div className="text-fg">{r.product_name}</div>
          {r.variant_label && (
            <div className="text-xs text-fg-muted">{r.variant_label}</div>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      render: (r) => (
        <span className="tnum">
          <span className={`font-medium ${severity(r.quantity, r.threshold)}`}>
            {r.quantity}
          </span>
          <span className="text-fg-muted"> / {r.threshold}</span>
        </span>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader
        title="Low stock"
        meta={
          isLoading ? (
            <span className="text-fg-subtle text-[10.5px]">loading…</span>
          ) : (
            <span className="text-fg-subtle text-[10.5px]">
              {rows.length} item{rows.length === 1 ? '' : 's'}
            </span>
          )
        }
      />
      <div className="mt-2">
        {isLoading ? (
          <div className="space-y-2 py-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-7 bg-white/[0.03] rounded animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-[11.5px] text-[#F09595] py-3 text-center">
            Couldn&apos;t load inventory.
          </div>
        ) : rows.length === 0 ? (
          <div className="text-[11.5px] text-fg-subtle py-3 text-center">
            Everything is well stocked.
          </div>
        ) : (
          <ResponsiveTable
            columns={columns}
            data={rows}
            rowKey={(r) => r.id}
          />
        )}
      </div>
    </Card>
  )
}

export default LowStockCard
