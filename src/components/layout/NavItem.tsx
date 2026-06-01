"use client"
import React from 'react'
import Link from 'next/link'

type Props = {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  badge?: boolean
}

const NavItem = ({ icon, label, href, active, badge }: Props) => {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`flex items-center gap-3 h-10 mx-2 px-2 rounded-control transition-colors ${
        active
          ? 'bg-accent text-accent-fg'
          : 'text-fg-muted hover:text-fg hover:bg-card-hover'
      }`}
    >
      <span className="relative inline-flex items-center justify-center w-7 shrink-0">
        {icon}
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-status-pending" />
        )}
      </span>
      <span className="text-[12.5px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
        {label}
      </span>
    </Link>
  )
}

export default NavItem
