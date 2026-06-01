import React from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import BarListRow from '@/components/ui/BarListRow'

type Item = {
  name: string
  units: number
}

type Props = {
  items: Item[]
  meta?: string
}

const TopProductsCard = ({ items, meta = 'units, 30d' }: Props) => {
  const max = Math.max(...items.map((i) => i.units), 1)
  return (
    <Card>
      <CardHeader title="Top products" meta={<span>{meta}</span>} />
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <BarListRow
            key={it.name}
            label={it.name}
            value={it.units}
            pct={(it.units / max) * 100}
          />
        ))}
      </div>
    </Card>
  )
}

export default TopProductsCard
