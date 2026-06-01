import React from 'react'

type Props = {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

const PageHeader = ({ title, subtitle, action }: Props) => {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[18px] font-medium tracking-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-[11.5px] text-fg-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
