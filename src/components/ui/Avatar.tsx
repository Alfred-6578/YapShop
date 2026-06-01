import React from 'react'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  name: string
  src?: string
  size?: Size
  className?: string
}

const sizes: Record<Size, string> = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')

const Avatar = ({ name, src, size = 'md', className = '' }: Props) => {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-card-hover text-fg flex items-center justify-center font-semibold ${className}`}
      aria-label={name}
    >
      {initials(name)}
    </div>
  )
}

export default Avatar
