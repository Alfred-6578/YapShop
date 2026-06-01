import React from 'react'

type Props = {
  title: string
  meta?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

const CardHeader = ({ title, meta, action, className = '' }: Props) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {(meta || action) && (
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          {meta}
          {action}
        </div>
      )}
    </div>
  )
}

export default CardHeader
