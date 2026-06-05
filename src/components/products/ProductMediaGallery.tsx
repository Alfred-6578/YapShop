"use client"
import { useState } from "react"
import { HiOutlinePhoto, HiPlay } from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Thumbnail from "@/components/ui/Thumbnail"
import { getProductColor, getProductInitials, isVideoMedia } from "@/lib/products/visuals"
import type { ProductResponse } from "@/lib/api/types"

type Props = {
  product: ProductResponse
}

const ProductMediaGallery = ({ product }: Props) => {
  const media = product.media
  const [selectedIndex, setSelectedIndex] = useState(0)

  const safeIndex = Math.min(selectedIndex, media.length - 1)
  const selected = media[safeIndex]

  return (
    <Card>
      <CardHeader
        title="Media"
        meta={
          <span className="text-[11px] text-fg-muted">
            {media.length} item{media.length !== 1 ? "s" : ""}
          </span>
        }
      />

      {media.length === 0 ? (
        <div className="mt-3 w-full aspect-square md:aspect-[16/9] max-h-[360px] border-dashed border-2 border-white/[0.08] rounded-[10px] flex flex-col items-center justify-center text-fg-subtle gap-2">
          <HiOutlinePhoto size={32} />
          <span className="text-[12px]">No photos or videos for this product</span>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          <div className="relative w-full aspect-square md:aspect-[16/9] max-h-[380px] rounded-[10px] overflow-hidden bg-black/40">
            {selected.url ? (
              isVideoMedia(selected) ? (
                <video
                  src={selected.url}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.url}
                  alt={`${product.name} — photo ${safeIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[44px] font-medium"
                style={{
                  backgroundColor: getProductColor(product),
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {getProductInitials(product)}
              </div>
            )}
            {safeIndex === 0 && (
              <span className="absolute top-2 left-2 bg-black/55 text-fg text-[10px] rounded-[4px] px-2 py-0.5 font-medium">
                {isVideoMedia(selected) ? "Primary · Video" : "Primary"}
              </span>
            )}

            {/* Per-item Live/Stock pill — mirrors the form's edit toggle
                but read-only here. Always shown so operators can verify at
                a glance whether the AI will use this item as proof. */}
            <span
              className={`absolute bottom-2 left-2 inline-flex items-center gap-1.5 text-[10.5px] font-medium px-2 py-1 rounded-[6px] ${
                (selected.is_live ?? true)
                  ? "bg-accent/85 text-accent-fg"
                  : "bg-black/55 text-fg-muted"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  (selected.is_live ?? true) ? "bg-accent-fg" : "bg-fg-subtle"
                }`}
              />
              {(selected.is_live ?? true) ? "Live" : "Stock"}
            </span>
          </div>

          {media.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {media.map((m, i) => {
                const isVid = isVideoMedia(m)
                const selectedRing = i === safeIndex ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""
                const isLive = m.is_live ?? true
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    aria-label={`${isVid ? "Video" : "Photo"} ${i + 1} (${
                      isLive ? "live" : "stock"
                    })`}
                    aria-pressed={i === safeIndex}
                    className={`relative rounded-[7px] transition-transform hover:scale-[1.04] cursor-pointer ${selectedRing}`}
                  >
                    {isVid && m.url ? (
                      <div className="relative h-16 w-16 rounded-[7px] overflow-hidden bg-black">
                        <video
                          src={m.url}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                          <HiPlay size={20} className="text-white drop-shadow" />
                        </div>
                      </div>
                    ) : (
                      <Thumbnail
                        size={64}
                        src={m.url || undefined}
                        color={getProductColor(product)}
                        initials={getProductInitials(product)}
                      />
                    )}

                    {/* Read-only live indicator. Filled accent dot = live;
                        hollow dim dot = stock. Matches the toggle visual
                        used by the form so operators learn one symbol. */}
                    <span
                      title={isLive ? "Live" : "Stock"}
                      className={`absolute bottom-1 left-1 h-4 w-4 rounded-full flex items-center justify-center ${
                        isLive
                          ? "bg-accent ring-1 ring-black/40"
                          : "bg-black/60 ring-1 ring-white/40"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLive ? "bg-accent-fg" : "bg-fg-subtle"
                        }`}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default ProductMediaGallery
