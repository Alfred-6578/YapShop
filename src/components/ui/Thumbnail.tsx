"use client"
import React from 'react'

type Props = {
  src?: string
  alt?: string
  initials: string
  color: string
  size?: number
  onRemove?: () => void
  primary?: boolean
}

const Thumbnail = ({
  src,
  alt,
  initials,
  color,
  size = 36,
  onRemove,
  primary,
}: Props) => {
  const fontSize = Math.round(size * 0.3)

  const overlays = (
    <>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onRemove()
          }}
          aria-label="Remove"
          className="absolute top-1 right-1 h-4 w-4 rounded-full bg-black/60 text-fg text-[10px] flex items-center justify-center leading-none cursor-pointer"
        >
          ×
        </button>
      )}
      {primary && (
        <span className="absolute bottom-1 left-1 bg-black/55 text-fg text-[8.5px] rounded-[3px] px-1.5 py-0.5 font-normal leading-none">
          primary
        </span>
      )}
    </>
  )

  if (src) {
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? initials}
          className="rounded-[7px] object-cover w-full h-full"
        />
        {overlays}
      </div>
    )
  }

  return (
    <div
      className="relative rounded-[7px] flex items-center justify-center shrink-0 font-medium"
      style={{
        width: size,
        height: size,
        background: color,
        color: 'rgba(255,255,255,0.85)',
        fontSize,
      }}
      aria-label={alt ?? initials}
    >
      {initials}
      {overlays}
    </div>
  )
}

export default Thumbnail
