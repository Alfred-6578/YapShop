import { HiCheck, HiXMark } from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const ProductVisibilityCard = ({ product }: Props) => {
  const isLive = product.is_live ?? false
  return (
    <Card>
      <CardHeader title="Visibility" />
      <div className="mt-3 flex flex-col">
        <Row
          title="Active"
          description="Customers can browse and place orders"
          on={product.is_active}
        />
        <Row
          title="Live media"
          description="Real vendor-shot photo or video — AI can share it as proof"
          on={isLive}
          topBorder
        />
      </div>
    </Card>
  )
}

const Row = ({
  title,
  description,
  on,
  topBorder = false,
}: {
  title: string
  description: string
  on: boolean
  topBorder?: boolean
}) => (
  <div
    className={`flex items-start justify-between gap-2.5 py-2.5 ${
      topBorder ? "border-t border-white/[0.05]" : ""
    }`}
  >
    <div className="min-w-0">
      <div className="text-[12px] text-fg">{title}</div>
      <div className="text-[10.5px] text-fg-muted mt-0.5">{description}</div>
    </div>
    {on ? (
      <span className="shrink-0 h-5 w-5 rounded-full bg-accent/15 text-accent inline-flex items-center justify-center">
        <HiCheck size={12} />
      </span>
    ) : (
      <span className="shrink-0 h-5 w-5 rounded-full bg-white/[0.05] text-fg-subtle inline-flex items-center justify-center">
        <HiXMark size={12} />
      </span>
    )}
  </div>
)

export default ProductVisibilityCard
