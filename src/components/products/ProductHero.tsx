import Card from "@/components/ui/Card"
import StatusBadge from "@/components/ui/StatusBadge"
import { formatRelative } from "@/lib/utils/format"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const ProductHero = ({ product }: Props) => {
  const isLive = product.is_live ?? false
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-[20px] font-medium tracking-tight truncate">{product.name}</h1>
          <p className="text-[11.5px] text-fg-muted mt-1">
            Updated {formatRelative(product.updated_at)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={product.is_active ? "active" : "inactive"} />
          {isLive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-medium bg-[rgba(21,194,106,0.18)] text-[#6FD9A0]">
              Live media
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 text-[18px] font-medium tnum">
        ₦{product.price.toLocaleString()}
      </div>
    </Card>
  )
}

export default ProductHero
