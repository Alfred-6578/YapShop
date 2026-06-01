import React from 'react'

type Crumb = {
  label: string
  href?: string
}

type Props = {
  items: Crumb[]
}

const Breadcrumb = ({ items }: Props) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((c, i) => {
        const last = i === items.length - 1
        return (
          <React.Fragment key={i}>
            {c.href && !last ? (
              <a href={c.href} className="text-fg-muted hover:text-fg">
                {c.label}
              </a>
            ) : (
              <span className={last ? 'text-fg font-medium' : 'text-fg-muted'}>{c.label}</span>
            )}
            {!last && <span className="text-fg-subtle">/</span>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
