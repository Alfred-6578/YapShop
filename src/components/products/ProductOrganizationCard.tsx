"use client"
import { useQuery } from "@tanstack/react-query"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import { listCategories } from "@/lib/api/categories"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const ProductOrganizationCard = ({ product }: Props) => {
  const { data: categories } = useQuery({
    queryKey: ["categories", "list"],
    queryFn: listCategories,
    staleTime: 5 * 60_000,
  })

  const category = categories?.find((c) => c.id === product.category_id)

  return (
    <Card>
      <CardHeader title="Organization" />
      <div className="mt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-fg-muted">Category</span>
          {product.category_id ? (
            category ? (
              <span className="text-[11.5px] text-fg">{category.name}</span>
            ) : (
              <span className="text-[11.5px] text-fg-subtle">Loading…</span>
            )
          ) : (
            <span className="text-[11.5px] text-fg-subtle">—</span>
          )}
        </div>

        <div>
          <div className="text-[10.5px] text-fg-muted mb-1.5">Tags</div>
          {product.tags.length === 0 ? (
            <span className="text-[11.5px] text-fg-subtle italic">No tags</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-[5px] bg-white/[0.06] text-[#B8BDC4]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProductOrganizationCard
