import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const ProductDetailsCard = ({ product }: Props) => {
  return (
    <Card>
      <CardHeader title="Details" />
      <div className="mt-3 flex flex-col gap-2.5">
        <Row label="SKU">
          {product.sku ? (
            <span className="font-mono text-[11.5px] text-fg">{product.sku}</span>
          ) : (
            <span className="text-fg-subtle text-[11.5px]">—</span>
          )}
        </Row>
        <Row label="Price">
          <span className="tnum text-[12.5px] text-fg font-medium">
            ₦{product.price.toLocaleString()}
          </span>
        </Row>
        <div>
          <div className="text-[10.5px] text-fg-muted mb-1">Description</div>
          {product.description ? (
            <p className="text-[12px] text-fg leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          ) : (
            <p className="text-[12px] text-fg-subtle italic">No description provided</p>
          )}
        </div>
      </div>
    </Card>
  )
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 py-1">
    <span className="text-[11px] text-fg-muted">{label}</span>
    <span className="text-right min-w-0 truncate">{children}</span>
  </div>
)

export default ProductDetailsCard
