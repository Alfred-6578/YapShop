"use client"
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import BarListRow from '@/components/ui/BarListRow'
import { useTopProducts } from '@/lib/dashboard'

type Props = {
  /** Max number of products to show. Defaults to 5 — matches the previous
   *  page-level hardcoded list size. */
  limit?: number
}

const TopProductsCard = ({ limit = 5 }: Props) => {
  const { data, isLoading, isError } = useTopProducts({ limit })

  const items = data ?? []
  const max = Math.max(...items.map((i) => i.units), 1)

  return (
    <Card>
      <CardHeader
        title="Top products"
        meta={<span className="text-fg-subtle text-[10.5px]">by units</span>}
      />
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="h-5 bg-white/[0.03] rounded animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-[11.5px] text-[#F09595] py-3 text-center">
            Couldn&apos;t load top products.
          </div>
        ) : items.length === 0 ? (
          <div className="text-[11.5px] text-fg-subtle py-3 text-center">
            No sales yet.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <BarListRow
                key={it.product_id}
                label={it.name}
                value={it.units}
                pct={(it.units / max) * 100}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default TopProductsCard
