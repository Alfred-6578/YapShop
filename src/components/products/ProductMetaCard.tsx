"use client"
import { useState } from "react"
import { HiCheck, HiOutlineClipboard } from "react-icons/hi2"

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
        <Row label="Tracking ID">
          {product.tracking_id ? (
            <CopyableId value={product.tracking_id} />
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

const CopyableId = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can throw on insecure origins or denied permission —
      // surface nothing rather than crashing; user can still select the text.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy tracking ID"}
      title={value}
      className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-[#C5CAD0] hover:text-fg cursor-pointer group"
    >
      <span>{shortId(value)}</span>
      {copied ? (
        <HiCheck size={12} className="text-[#6FD9A0]" />
      ) : (
        <HiOutlineClipboard size={12} className="text-fg-subtle group-hover:text-fg" />
      )}
    </button>
  )
}

export default ProductMetaCard
