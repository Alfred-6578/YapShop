import { HiCheck, HiXMark } from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const ProductVisibilityCard = ({ product }: Props) => {
  // Live is now per-media. Surface the breakdown as a read-only summary —
  // the gallery shows which specific items are live; this card answers
  // "how many of my photos can the AI use as proof?" at a glance.
  const totalMedia = product.media.length
  const liveCount = product.media.filter((m) => m.is_live ?? true).length
  const liveSummary =
    totalMedia === 0
      ? "No media uploaded yet"
      : liveCount === totalMedia
        ? `All ${totalMedia} can be used as proof`
        : `${liveCount} of ${totalMedia} can be used as proof`

  return (
    <Card>
      <CardHeader title="Visibility" />
      <div className="mt-3 flex flex-col">
        <Row
          title="Active"
          description="Customers can browse and place orders"
          on={product.is_active}
        />
        <div className="flex items-start justify-between gap-2.5 py-2.5 border-t border-white/[0.05]">
          <div className="min-w-0">
            <div className="text-[12px] text-fg">Live media</div>
            <div className="text-[10.5px] text-fg-muted mt-0.5">
              {liveSummary}
            </div>
          </div>
          <span className="shrink-0 text-[11px] tnum text-fg font-medium">
            {liveCount}/{totalMedia}
          </span>
        </div>
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
