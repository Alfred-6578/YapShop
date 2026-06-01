import React from 'react'

type Props = {
  src?: string
  alt?: string
  initials: string
  color: string
  size?: number
}

const Thumbnail = ({ src, alt, initials, color, size = 36 }: Props) => {
  const fontSize = Math.round(size * 0.3)

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? initials}
        className="rounded-[7px] object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="rounded-[7px] flex items-center justify-center shrink-0 font-medium"
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
    </div>
  )
}

export default Thumbnail
