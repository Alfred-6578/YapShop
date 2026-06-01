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
      className={`relative h-10 w-10 inline-flex items-center justify-center rounded-control transition-colors ${
        active
          ? 'bg-accent text-accent-fg'
          : 'text-fg-muted hover:text-fg hover:bg-card-hover'
      }`}
    >
      {icon}
      {badge && (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-status-pending" />
      )}
    </Link>
  )
}

export default NavItem
