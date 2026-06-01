import React from 'react'

type Props = {
  icon: React.ReactNode
  'aria-label': string
  onClick?: () => void
  badge?: boolean
  className?: string
}

const IconButton = ({ icon, onClick, badge, className = '', ...rest }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rest['aria-label']}
      className={`relative h-9 w-9 inline-flex items-center justify-center rounded-control bg-card border border-border-strong/80 text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer ${className}`}
    >
      {icon}
      {badge && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
      )}
    </button>
  )
}

export default IconButton
