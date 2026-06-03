import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Thumbnail from "@/components/ui/Thumbnail"
import { getProductColor, getProductInitials } from "@/lib/products/visuals"
import type { OrderItemResponse } from "@/lib/api/types"

type Props = {
  items: OrderItemResponse[]
  /** Authoritative total from the order — use this instead of summing items,
   *  since the server may apply discounts/shipping that don't show per-line. */
  total_amount: number
  isLoading?: boolean
}

const OrderItemsCard = ({ items, total_amount, isLoading = false }: Props) => {
  const meta = isLoading
    ? "Loading…"
    : `${items.length} item${items.length !== 1 ? "s" : ""}`

  return (
    <Card>
      <CardHeader title="Items" meta={<span>{meta}</span>} />

      <div className="mt-2">
        {isLoading ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className={`grid grid-cols-[40px_minmax(0,1fr)_auto] gap-2.5 items-center py-2 ${
                  i === 0 ? "" : "border-t border-white/5"
                }`}
              >
                <div className="h-10 w-10 rounded-card bg-white/5 animate-pulse" />
                <div className="min-w-0 flex flex-col gap-1.5">
                  <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-white/3 rounded animate-pulse" />
                </div>
                <div className="h-3 w-14 bg-white/4 rounded animate-pulse" />
              </div>
            ))}
          </>
        ) : items.length === 0 ? (
          <div className="py-6 text-center text-[11.5px] text-fg-subtle">
            No items recorded for this order.
          </div>
        ) : (
          items.map((it, i) => (
            <div
              key={it.id}
              className={`grid grid-cols-[40px_minmax(0,1fr)_auto] gap-2.5 items-center py-2 ${
                i === 0 ? "" : "border-t border-white/5"
              }`}
            >
              <Thumbnail
                size={40}
                color={getProductColor({ id: it.product_id })}
                initials={getProductInitials({ name: it.product_name })}
              />
              <div className="min-w-0">
                <div className="text-[12px] text-fg truncate">{it.product_name}</div>
                {it.product_sku && (
                  <div className="font-mono text-[10.5px] text-fg-subtle mt-0.5 truncate">
                    {it.product_sku}
                  </div>
                )}
                {it.product_variant_attributes && (
                  <div className="text-[10.5px] text-fg-muted mt-0.5 truncate">
                    {Object.entries(it.product_variant_attributes)
                      .map(([k, v]) => `${k}: ${String(v)}`)
                      .join(" · ")}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-[12px] font-medium tnum">
                  ₦{it.subtotal.toLocaleString()}
                </div>
                <div className="text-[10.5px] text-fg-muted mt-0.5 tnum">
                  {it.quantity} × ₦{it.unit_price.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}

        <div className="flex justify-between items-center border-t border-white/8 mt-1.5 pt-2.5 text-[13px] font-medium">
          <span className="text-fg-muted font-normal">Total</span>
          <span className="tnum">₦{total_amount.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  )
}

export default OrderItemsCard
