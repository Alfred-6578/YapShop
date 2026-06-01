import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  padded?: boolean
  onClick?: () => void
}

const Card = ({ children, className = '', padded = true, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border-strong/80 rounded-card ${padded ? 'p-4' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
