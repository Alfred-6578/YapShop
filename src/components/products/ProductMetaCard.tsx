import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import { formatRelative } from "@/lib/utils/format"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const shortId = (id: string): string => {
  if (id.length <= 9) return id
  return `${id.slice(0, 4)}…${id.slice(-4)}`
}

const ProductMetaCard = ({ product }: Props) => {
  return (
    <Card>
      <CardHeader title="Meta" />
      <div className="mt-3">
        <Row label="ID">
          <span className="font-mono text-[10.5px] text-[#C5CAD0]">{shortId(product.id)}</span>
        </Row>
        <Row label="Tracking ID">
          {product.tracking_id ? (
            <span className="font-mono text-[10.5px] text-[#C5CAD0]">
              {shortId(product.tracking_id)}
            </span>
          ) : (
            <span className="text-[11px] text-fg-subtle">—</span>
          )}
        </Row>
        <Row label="Created">
          <span className="text-[11px] text-[#C5CAD0]">{formatRelative(product.created_at)}</span>
        </Row>
        <Row label="Updated">
          <span className="text-[11px] text-[#C5CAD0]">{formatRelative(product.updated_at)}</span>
        </Row>
      </div>
    </Card>
  )
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 py-1">
    <span className="text-[11px] text-fg-muted">{label}</span>
    {children}
  </div>
)

export default ProductMetaCard
